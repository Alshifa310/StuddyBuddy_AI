import type { ChatThread } from "@/lib/chat-storage";

function threadInitials(title: string) {
  return (
    title
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "CH"
  );
}

function threadPreview(thread: ChatThread) {
  const lastUserMessage = [...thread.messages].reverse().find((message) => message.role === "user");
  const lastMessage = lastUserMessage ?? thread.messages[thread.messages.length - 1];

  if (!lastMessage) return "No messages yet";

  const compact = lastMessage.content.replace(/\s+/g, " ").trim();
  if (!compact) return lastMessage.role === "assistant" ? "Assistant is typing" : "No preview yet";

  return compact.length > 64 ? `${compact.slice(0, 64).trimEnd()}…` : compact;
}

export function ChatSidebar({
  threads,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onClose,
}: {
  threads: ChatThread[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onClose?: () => void;
}) {
  return (
    <aside className="flex h-full w-full flex-col border-b border-white/10 bg-[#07080f]/95 p-4 backdrop-blur-xl lg:w-[320px] lg:border-b-0 lg:border-r">
      <div className="shrink-0">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 via-sky-500/15 to-fuchsia-500/15 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-cyan-100 uppercase">StuddyBuddy AI</p>
              <p className="text-xs text-slate-500">Your Personal Tutor</p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-100 lg:hidden"
            aria-label="Start new chat"
            onClick={onNewChat}
          >
            +
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between lg:hidden">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Chats</p>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-cyan-400/25 hover:bg-white/[0.04]"
              aria-label="Close sidebar"
              title="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="hidden w-full items-center justify-center gap-2 rounded-2xl border border-fuchsia-400/20 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_36px_rgba(99,102,241,0.28)] transition hover:scale-[1.01] hover:shadow-[0_18px_50px_rgba(168,85,247,0.3)] lg:flex"
        >
          <span className="text-base leading-none">+</span>
          New Chat
        </button>

        <div className="mt-5 flex items-center justify-between px-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          <span>Recent Chats</span>
          <span>{threads.length}</span>
        </div>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {threads.map((thread) => {
          const selected = thread.id === activeChatId;

          return (
            <div
              key={thread.id}
              className={[
                "rounded-2xl border px-3 py-3 transition",
                selected
                  ? "border-fuchsia-400/35 bg-white/[0.07] shadow-[0_0_0_1px_rgba(232,121,249,0.12)]"
                  : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.05]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectChat(thread.id);
                  onClose?.();
                }}
                className="flex w-full items-start gap-3 text-left"
              >
                <div
                  className={[
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-[11px] font-semibold",
                    selected
                      ? "border-fuchsia-300/25 bg-fuchsia-500/15 text-fuchsia-100"
                      : "border-white/10 bg-white/[0.03] text-slate-400",
                  ].join(" ")}
                >
                  {threadInitials(thread.title)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-white">{thread.title}</p>
                    <span className="shrink-0 text-[11px] text-slate-500">
                      {new Date(thread.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="truncate text-xs leading-5 text-slate-500">{threadPreview(thread)}</p>
                </div>
              </button>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteChat(thread.id);
                    onClose?.();
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/8 text-slate-500 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200"
                  aria-label={`Delete ${thread.title}`}
                  title="Delete chat"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

     
    </aside>
  );
}
