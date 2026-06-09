import Image from "next/image";
import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { MessageContent } from "@/components/MessageContent";
import type { ChatMessage, ChatThread } from "@/lib/chat-storage";
import robotImg from "@/public/Gemini_Generated_Image_6bx9z6bx9z6bx9z6 (1).png";

function MessageRow({ message, onCopy }: { message: ChatMessage; onCopy: (content: string) => void }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[76%]">
          <div className="rounded-2xl rounded-tr-sm border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm leading-relaxed text-slate-100">
            <span className="whitespace-pre-wrap">{message.content}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-end gap-1.5 text-[11px] text-slate-500">
            {message.time}
            <svg width="14" height="10" viewBox="0 0 16 12" fill="none">
              <path d="M1 6l4 4L15 1" stroke="#67e8f9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 6l4 4" stroke="#67e8f9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-[0_0_18px_rgba(99,102,241,0.28)]">
        <span className="text-xs font-bold text-white">AI</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-relaxed text-slate-200">
          {message.content.trim() ? (
            <MessageContent content={message.content} role="assistant" />
          ) : (
            <div className="flex items-center gap-1.5 py-1 text-slate-400" aria-label="Assistant typing">
              <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300" />
            </div>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3">
            <span className="text-[11px] text-slate-500">{message.time}</span>
            <button
              type="button"
              onClick={() => onCopy(message.content)}
              className="rounded-full p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-fuchsia-200"
              title="Copy"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatConversation({
  thread,
  input,
  isStreaming,
  isEmpty,
  onInputChange,
  onSubmit,
  onStop,
  onQuickPrompt,
  onCopy,
  textareaRef,
  endRef,
  onOpenSidebar,
}: {
  thread: ChatThread | null;
  input: string;
  isStreaming: boolean;
  isEmpty: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  onQuickPrompt: (value: string) => void;
  onCopy: (content: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  endRef: RefObject<HTMLDivElement>;
  onOpenSidebar: () => void;
}) {
  const [showHeader, setShowHeader] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("showHeader");
      if (raw != null) {
        setShowHeader(raw === "true");
      }
    } catch {
      /* ignore */
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem("showHeader", showHeader ? "true" : "false");
    } catch {
      /* ignore */
    }
  }, [hydrated, showHeader]);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#080910]">
      {showHeader ? (
        <header className="relative shrink-0 bg-black  sm:px-6 sm:py-6 lg:px-0 border-b border-white/10">
          <div className="cursor-pointer p-1">
          <button
            type="button"
            onClick={() => setShowHeader(false)}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-200 transition hover:border-cyan-400/25 hover:bg-cyan-400/10 "
            aria-label="Hide header"
            title="Hide header"
          >
             -
          </button>
          </div>

          <div className="flex items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={onOpenSidebar}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-cyan-400/25 hover:bg-cyan-400/10"
                aria-label="Open sidebar"
                title="Menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              </button>
            
              <div className="w-11" />
            </div>

            

            <div className="flex items-start gap-3 px-4 py-4">
              <div className="hidden text-3xl sm:block">👋</div>
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Hi, there!</h1>
                <p className="mt-1 bg-gradient-to-r from-cyan-200 via-fuchsia-300 to-violet-300 bg-clip-text text-lg font-medium text-transparent sm:text-2xl">
                  Explore the frontend demo experience.
                </p>
                <p className="mt-2 max-w-xl text-sm text-slate-400">
                  Send messages, browse the UI, and review the local-only conversation flow.
                </p>
              </div>
            </div>
          </div>

          <div className="relative hidden shrink-0 items-center justify-center sm:flex">
           
            <Image src={robotImg} alt="Robot illustration" className="h-auto w-[250px] object-contain" priority />
          </div>
          </div>
        </header>
      ) : (
        <div className="px-5 py-3 bg-black border-b border-white/10 cursor-pointer">
          <div className="flex items-center justify-between">
            <div />
            <button
              type="button"
              onClick={() => setShowHeader(true)}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-slate-200 transition hover:border-cyan-400/25 hover:bg-cyan-400/10"
              aria-label="Show header"
              title="Show header"
            >
             +
            </button>
          </div>
        </div>
      )}


      <div className="messages-area min-h-0 flex-1 overflow-y-auto px-5 py-5 lg:px-7">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/10 text-slate-500">
            <div className="text-4xl">💬</div>
            <p className="text-sm">Send a message to start learning</p>
          </div>
        ) : null}

        <div className="space-y-5">
          {thread?.messages.map((message) => (
            <MessageRow key={message.id} message={message} onCopy={onCopy} />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-white/10 bg-black px-5 pb-3 pt-3 lg:px-7 lg:pb-4">
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/8 hover:text-cyan-100" onClick={() => onQuickPrompt("Hello! What is this demo for?")}>What is this demo?</button>
          <button type="button" className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/8 hover:text-cyan-100" onClick={() => onQuickPrompt("How does the frontend-only version work?")}>Frontend-only version</button>
          <button type="button" className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/8 hover:text-cyan-100" onClick={() => onQuickPrompt("Thanks for the portfolio demo")}>Portfolio demo</button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="rounded-[24px] border border-fuchsia-400/25 bg-white/[0.03] p-4 shadow-[0_10px_50px_rgba(14,16,30,0.45)] backdrop-blur-xl">
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    onSubmit();
                  }
                }}
                placeholder="Message the portfolio demo..."
                rows={1}
                className="min-h-[40px] flex-1 resize-none bg-transparent px-1 py-1 text-sm text-slate-100 outline-none placeholder:text-slate-600"
              />

              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-500/25 bg-rose-500/15 text-rose-200 transition hover:bg-rose-500/25"
                  title="Stop generating"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-white shadow-[0_12px_30px_rgba(99,102,241,0.32)] transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-35"
                  title="Send message"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4 20-7z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </form>

        <p className="mt-2 text-center text-[10px] leading-4 text-slate-600 sm:text-[11px]">
          {thread?.messages.length ? "Chats are saved locally in this browser." : "Start a chat and your history will be saved locally."}
        </p>
      </div>
    </section>
  );
}
