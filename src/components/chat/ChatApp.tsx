"use client";

import { useEffect, useRef, useState } from "react";
import { ChatConversation } from "@/components/chat/ChatConversation";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useChatHistory } from "@/hooks/useChatHistory";
import { buildThreadTitle, createMessage } from "@/lib/chat-storage";
import { getDemoResponse, getDemoTypingDelay, waitForDemoDelay } from "@/lib/demo-chat";

export function ChatApp() {
  const {
    activeThread,
    recentThreads,
    createNewChat,
    selectChat,
    deleteChat,
    appendMessages,
    updateMessage,
    openOrCreateChat,
    createMessage: buildMessage,
  } = useChatHistory();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeThread?.messages.length]);

  function autoResizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  function stopStreaming() {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
  }

  function openSidebar() {
    setIsSidebarOpen(true);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  async function sendMessage(messageText?: string) {
    const userMessage = (messageText ?? input).trim();
    if (!userMessage || isStreaming) return;

    const chatId = openOrCreateChat();
    const userChatMessage = buildMessage("user", userMessage);
    const assistantChatMessage = buildMessage("assistant", "");

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsStreaming(true);

    appendMessages(chatId, [userChatMessage, assistantChatMessage], buildThreadTitle([userChatMessage]));

    abortControllerRef.current = new AbortController();

    try {
      await waitForDemoDelay(getDemoTypingDelay(userMessage), abortControllerRef.current.signal);
      updateMessage(chatId, assistantChatMessage.id, () => createMessage("assistant", getDemoResponse(userMessage)));
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        const message = error instanceof Error ? error.message : "Something went wrong.";
        updateMessage(chatId, assistantChatMessage.id, () => createMessage("assistant", `Error: ${message}`));
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }

  return (
    <main className="flex h-[100dvh] flex-col items-center justify-items-center bg-[radial-gradient(circle_at_top,#15152c_0%,#080810_42%,#040408_100%)] px-2 py-2 text-slate-100 sm:px-3 sm:py-3 md:px-4 md:py-4">
      <div className="mb-3 w-full max-w-[1440px] rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50 shadow-[0_12px_40px_rgba(8,145,178,0.12)] backdrop-blur-xl">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <strong className="text-sm font-semibold tracking-wide">StuddyBuddy AI • Portfolio Demo</strong>
          <span className="text-sm text-cyan-50/85">Frontend-only demo created for portfolio presentation.</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 w-full max-w-[1440px] overflow-hidden rounded-[24px] border border-white/10 bg-black/30 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:rounded-[28px] ">
        <div className="hidden lg:block">
          <ChatSidebar
            threads={recentThreads}
            activeChatId={activeThread?.id ?? null}
            onNewChat={createNewChat}
            onSelectChat={selectChat}
            onDeleteChat={deleteChat}
          />
        </div>

        <ChatConversation
          thread={activeThread}
          input={input}
          isStreaming={isStreaming}
          isEmpty={!activeThread || activeThread.messages.length === 0}
          onInputChange={(value) => {
            setInput(value);
            autoResizeTextarea();
          }}
          onSubmit={() => sendMessage()}
          onStop={stopStreaming}
          onQuickPrompt={(prompt) => {
            setInput(prompt);
            setTimeout(() => textareaRef.current?.focus(), 0);
          }}
          onCopy={copyToClipboard}
          textareaRef={textareaRef}
          endRef={messagesEndRef}
          onOpenSidebar={openSidebar}
        />
      </div>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar backdrop"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={closeSidebar}
          />
          <div className="absolute inset-y-0 left-0 w-[88vw] max-w-[340px] shadow-[0_25px_80px_rgba(0,0,0,0.5)]">
            <ChatSidebar
              threads={recentThreads}
              activeChatId={activeThread?.id ?? null}
              onNewChat={() => {
                createNewChat();
                closeSidebar();
              }}
              onSelectChat={(chatId) => {
                selectChat(chatId);
                closeSidebar();
              }}
              onDeleteChat={(chatId) => {
                deleteChat(chatId);
                closeSidebar();
              }}
              onClose={closeSidebar}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
