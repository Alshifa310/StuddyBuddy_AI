export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  time: string;
};

export type ChatThread = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

export type ChatSessionState = {
  activeChatId: string | null;
  threads: ChatThread[];
};

export const CHAT_STORAGE_KEY = "streaming-chatbot-history-v1";

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getTimeLabel(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: createId(),
    role,
    content,
    time: getTimeLabel(),
  };
}

export function createEmptyThread(title = "New chat"): ChatThread {
  const now = Date.now();

  return {
    id: createId(),
    title,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function buildThreadTitle(messages: ChatMessage[]) {
  const firstUserMessage = messages.find((message) => message.role === "user");

  if (!firstUserMessage) return "New chat";

  const compact = firstUserMessage.content.replace(/\s+/g, " ").trim();
  return compact.length > 42 ? `${compact.slice(0, 42).trimEnd()}…` : compact;
}

export function createDefaultState(): ChatSessionState {
  const starterThread = createEmptyThread();

  return {
    activeChatId: starterThread.id,
    threads: [starterThread],
  };
}

export function normalizeChatState(input: unknown): ChatSessionState {
  if (!input || typeof input !== "object") {
    return createDefaultState();
  }

  const maybeState = input as Partial<ChatSessionState>;
  const threads = Array.isArray(maybeState.threads)
    ? maybeState.threads
        .filter((thread): thread is ChatThread => Boolean(thread && thread.id))
        .map((thread) => ({
          ...thread,
          title: typeof thread.title === "string" && thread.title.trim() ? thread.title : "New chat",
          createdAt: typeof thread.createdAt === "number" ? thread.createdAt : Date.now(),
          updatedAt: typeof thread.updatedAt === "number" ? thread.updatedAt : Date.now(),
          messages: Array.isArray(thread.messages)
            ? thread.messages.filter(
                (message): message is ChatMessage =>
                  Boolean(message && message.id && (message.role === "user" || message.role === "assistant") && typeof message.content === "string"),
              )
            : [],
        }))
        .sort((left, right) => right.updatedAt - left.updatedAt)
    : [];

  if (threads.length === 0) {
    return createDefaultState();
  }

  const activeChatId =
    typeof maybeState.activeChatId === "string" && threads.some((thread) => thread.id === maybeState.activeChatId)
      ? maybeState.activeChatId
      : threads[0].id;

  return { activeChatId, threads };
}

export function sortThreads(threads: ChatThread[]) {
  return [...threads].sort((left, right) => right.updatedAt - left.updatedAt);
}
