"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CHAT_STORAGE_KEY,
  type ChatMessage,
  type ChatSessionState,
  type ChatThread,
  buildThreadTitle,
  createDefaultState,
  createMessage,
  createEmptyThread,
  normalizeChatState,
  sortThreads,
} from "@/lib/chat-storage";

function readStoredState(): ChatSessionState {
  if (typeof window === "undefined") {
    return createDefaultState();
  }

  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    return raw ? normalizeChatState(JSON.parse(raw)) : createDefaultState();
  } catch {
    return createDefaultState();
  }
}

function writeStoredState(state: ChatSessionState) {
  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state));
}

export function useChatHistory() {
  const [state, setState] = useState<ChatSessionState>(createDefaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readStoredState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredState(state);
  }, [hydrated, state]);

  const activeThread = useMemo(
    () => state.threads.find((thread) => thread.id === state.activeChatId) ?? state.threads[0] ?? null,
    [state.activeChatId, state.threads],
  );

  useEffect(() => {
    if (!hydrated) return;

    if (state.threads.length === 0) {
      const starterThread = createEmptyThread();
      setState({ activeChatId: starterThread.id, threads: [starterThread] });
      return;
    }

    if (!activeThread) {
      setState((current) => ({ ...current, activeChatId: current.threads[0]?.id ?? null }));
    }
  }, [activeThread, hydrated, state.threads.length]);

  function createNewChat() {
    const thread = createEmptyThread();
    setState((current) => ({
      activeChatId: thread.id,
      threads: sortThreads([thread, ...current.threads]),
    }));
  }

  function selectChat(chatId: string) {
    setState((current) => ({ ...current, activeChatId: chatId }));
  }

  function deleteChat(chatId: string) {
    setState((current) => {
      const remainingThreads = current.threads.filter((thread) => thread.id !== chatId);

      if (remainingThreads.length === 0) {
        const starterThread = createEmptyThread();
        return { activeChatId: starterThread.id, threads: [starterThread] };
      }

      const nextActiveChatId = current.activeChatId === chatId ? remainingThreads[0].id : current.activeChatId;

      return {
        activeChatId: nextActiveChatId && remainingThreads.some((thread) => thread.id === nextActiveChatId)
          ? nextActiveChatId
          : remainingThreads[0].id,
        threads: remainingThreads,
      };
    });
  }

  function appendMessages(chatId: string, messages: ChatMessage[], title?: string) {
    setState((current) => {
      const nextThreads = current.threads.map((thread) => {
        if (thread.id !== chatId) return thread;

        const nextMessages = [...thread.messages, ...messages];
        return {
          ...thread,
          title: title ?? (thread.title === "New chat" ? buildThreadTitle(nextMessages) : thread.title),
          updatedAt: Date.now(),
          messages: nextMessages,
        };
      });

      return {
        activeChatId: chatId,
        threads: sortThreads(nextThreads),
      };
    });
  }

  function updateMessage(chatId: string, messageId: string, updater: (message: ChatMessage) => ChatMessage) {
    setState((current) => {
      const nextThreads = current.threads.map((thread) => {
        if (thread.id !== chatId) return thread;

        const nextMessages = thread.messages.map((message) => (message.id === messageId ? updater(message) : message));
        return {
          ...thread,
          title: thread.title === "New chat" ? buildThreadTitle(nextMessages) : thread.title,
          updatedAt: Date.now(),
          messages: nextMessages,
        };
      });

      return {
        activeChatId: chatId,
        threads: sortThreads(nextThreads),
      };
    });
  }

  function openOrCreateChat(): string {
    if (activeThread) return activeThread.id;

    const thread = createEmptyThread();
    setState((current) => ({
      activeChatId: thread.id,
      threads: sortThreads([thread, ...current.threads]),
    }));
    return thread.id;
  }

  return {
    activeThread,
    recentThreads: state.threads,
    createNewChat,
    selectChat,
    deleteChat,
    appendMessages,
    updateMessage,
    openOrCreateChat,
    createMessage,
  };
}
