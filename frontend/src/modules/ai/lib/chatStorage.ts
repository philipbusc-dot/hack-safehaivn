// Browser-side persistence for chatbot conversations (localStorage).
// Stateless backend + this = real, revisitable chat history with no server work.
//
// History is scoped per user: every key is suffixed with the signed-in user's
// id, so two accounts on the same browser never see each other's chats.
import type { ChatMessage, ChatTurn } from "../types/ai.types";

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const BASE = "safehaivn.chats.v1";
const ACTIVE_BASE = "safehaivn.chats.active.v1";

/** Build a user-scoped storage key. `scope` is the user id (or "anon"). */
function chatsKey(scope: string): string {
  return `${BASE}::${scope}`;
}
function activeKey(scope: string): string {
  return `${ACTIVE_BASE}::${scope}`;
}

/** Load saved conversations for a user, dropping corrupt or pending data. */
export function loadConversations(scope: string): Conversation[] {
  try {
    const raw = localStorage.getItem(chatsKey(scope));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (c): c is Conversation =>
          !!c && typeof c.id === "string" && Array.isArray(c.messages)
      )
      .map((c) => ({
        id: c.id,
        title: typeof c.title === "string" ? c.title : "Chat",
        updatedAt: typeof c.updatedAt === "number" ? c.updatedAt : 0,
        // Never restore unfinished "pending" bubbles or empty messages.
        messages: c.messages.filter(
          (m) => m && !m.pending && typeof m.html === "string" && m.html.length > 0
        ),
      }))
      .filter((c) => c.messages.length > 0);
  } catch {
    return [];
  }
}

/** Persist a user's conversations. Silently ignores quota / disabled storage. */
export function saveConversations(scope: string, conversations: Conversation[]): void {
  try {
    localStorage.setItem(chatsKey(scope), JSON.stringify(conversations));
  } catch {
    /* storage full or unavailable — history just won't persist this session */
  }
}

/** Derive a short, readable title from the first user message. */
export function deriveTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user")?.html.trim();
  if (!firstUser) return "New chat";
  return firstUser.length > 32 ? `${firstUser.slice(0, 32)}…` : firstUser;
}

/** Remember which conversation the user is currently viewing. */
export function loadActiveId(scope: string): string | null {
  try {
    return localStorage.getItem(activeKey(scope));
  } catch {
    return null;
  }
}

export function saveActiveId(scope: string, id: string): void {
  try {
    localStorage.setItem(activeKey(scope), id);
  } catch {
    /* storage unavailable — ignore */
  }
}

/**
 * Recent turns of the active conversation, for cross-tab context (e.g. the
 * Recommended Actions tab tailoring itself to the chat). Returns [] when the
 * active chat has no real user messages yet, so other tabs stay generic.
 */
export function getActiveContext(scope: string, maxTurns = 10): ChatTurn[] {
  const convos = loadConversations(scope);
  if (convos.length === 0) return [];
  const activeId = loadActiveId(scope);
  const active = convos.find((c) => c.id === activeId) ?? convos[0];
  const turns: ChatTurn[] = active.messages
    .filter((m) => !m.pending && m.html.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.html }));
  return turns.some((t) => t.role === "user") ? turns.slice(-maxTurns) : [];
}
