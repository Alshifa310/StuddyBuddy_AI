const DEMO_RESPONSES = [
  `👋 Welcome to the demo version of StuddyBuddy AI!

StuddyBuddy AI is an AI-powered study assistant originally built with:
• Next.js frontend
• AWS backend architecture
• Streaming AI responses
• Conversation history support

This portfolio version showcases the frontend experience and UI design without running the real AI backend to avoid hosting costs.

🔗 Main Project:
https://github.com/Alshifa310/StuddyBuddy_AI/tree/main`,

`💡 This frontend-only version works by simulating AI responses instead of calling the real backend.

In the original project:
• User messages were sent to AWS backend services
• AI responses were streamed back in real time
• Conversations were processed dynamically

In this demo:
• Backend requests are disabled
• Mock responses are generated locally
• The chat interface, animations, and user experience are preserved for showcase purposes`,

 `😊 You're welcome! Thanks for checking out StuddyBuddy AI Portfolio Demo.`,

 `🤖 This is a frontend portfolio demo of StuddyBuddy AI.

The original project includes a real AWS-powered backend with AI integration, while this version focuses on demonstrating:
• User interface design
• Chat experience
• Frontend development skills
• Responsive layout and interactions

Feel free to explore the interface and test the chat experience!`
];

function normalizeMessage(message: string) {
  return message.toLowerCase().replace(/\s+/g, " ").trim();
}

export function getDemoResponse(message: string) {
  const normalized = normalizeMessage(message);

  if (/\b(hi|hello|hey|hola)\b/.test(normalized)) {
    return DEMO_RESPONSES[0];
  }

  if (/\b(backend|api|lambda|aws|openai|bedrock|server|cost)\b/.test(normalized)) {
    return DEMO_RESPONSES[1];
  }

  if (/\b(thanks|thank you|appreciate)\b/.test(normalized)) {
    return DEMO_RESPONSES[2];
  }

  return DEMO_RESPONSES[3];
}

export function getDemoTypingDelay(message: string) {
  const lengthDelay = Math.min(message.trim().length * 14, 900);
  return 700 + lengthDelay;
}

export function waitForDemoDelay(delayMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, delayMs);

    function onAbort() {
      window.clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    }

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}