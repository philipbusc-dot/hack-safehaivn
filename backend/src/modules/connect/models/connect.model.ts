import { prisma } from "../../../db";
import type { UserWithStats, Match, ChatMessage } from "../types/connect.types";

// ─── Survivor Queries (User-backed after the User↔Survivor merge) ─────────────

// Only the fields Connect needs from a User row, plus their statistics.
const userSelect = {
  id: true,
  username: true,
  description: true,
  age: true,
  baseLocation: true,
  lat: true,
  lng: true,
  photoUrl: true,
  createdAt: true,
  stats: { select: { id: true, name: true, value: true, unit: true } },
} as const;

/** Returns the authenticated user (the "current survivor"), or null. */
export async function findCurrentUser(
  userId: string
): Promise<UserWithStats | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  }) as unknown as Promise<UserWithStats | null>;
}

/** Returns all other users the current user has NOT swiped yet. */
export async function findAllSurvivors(
  currentUserId: string
): Promise<UserWithStats[]> {
  const swipes = await prisma.match.findMany({
    where: { senderId: currentUserId },
    select: { receiverId: true },
  });
  const swipedIds = swipes.map((s) => s.receiverId);

  return prisma.user.findMany({
    where: { id: { not: currentUserId, notIn: swipedIds } },
    select: userSelect,
  }) as unknown as Promise<UserWithStats[]>;
}

/** Updates the GPS coordinates of a specific user. */
export async function updateSurvivorLocation(
  id: string,
  latitude: number,
  longitude: number
): Promise<UserWithStats> {
  return prisma.user.update({
    where: { id },
    data: { lat: latitude, lng: longitude },
    select: userSelect,
  }) as unknown as Promise<UserWithStats>;
}

/** Returns a list of users by their IDs. */
export async function findSurvivorsByIds(
  ids: string[]
): Promise<UserWithStats[]> {
  return prisma.user.findMany({
    where: { id: { in: ids } },
    select: userSelect,
  }) as unknown as Promise<UserWithStats[]>;
}

// ─── Cached AI compatibility opinion ──────────────────────────────────────────

/** The data needed to render/generate a candidate's standalone opinion. */
export type OpinionSource = UserWithStats & { aiOpinion: string | null };

/** Fetch a candidate with their cached opinion (or null if not generated). */
export async function findUserForOpinion(
  id: string
): Promise<OpinionSource | null> {
  return prisma.user.findUnique({
    where: { id },
    select: { ...userSelect, aiOpinion: true },
  }) as unknown as Promise<OpinionSource | null>;
}

/** Persist a freshly generated opinion so future views reuse it. */
export async function setOpinion(id: string, aiOpinion: string): Promise<void> {
  await prisma.user.update({ where: { id }, data: { aiOpinion } });
}

// ─── Match (Swipe) Queries ────────────────────────────────────────────────────

/** Persists a new swipe action between two survivors */
export async function createSwipe(
  senderId: string,
  receiverId: string,
  status: "like" | "love" | "no"
): Promise<Match> {
  return prisma.match.create({ data: { senderId, receiverId, status } });
}

/**
 * Finds all matches (like / love) where the given user is the sender.
 * Used to build the matched-survivors list.
 */
export async function findMatchesBySender(senderId: string): Promise<Match[]> {
  return prisma.match.findMany({
    where: { senderId, status: { in: ["like", "love"] } },
  });
}

/**
 * Two-way inbox support: every user the given user has exchanged messages with,
 * mapped to the timestamp (ms) of their most recent message. Lets the recipient
 * of a message see the conversation regardless of who swiped first, and lets the
 * inbox be ordered by recent activity.
 */
export interface ChatActivity {
  at: number; // ms timestamp of the most recent message
  text: string; // the most recent message's text (for an inbox preview)
}

export async function findChatActivity(
  userId: string
): Promise<Record<string, ChatActivity>> {
  const msgs = await prisma.chatMessage.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    select: { senderId: true, receiverId: true, text: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  const activity: Record<string, ChatActivity> = {};
  for (const m of msgs) {
    const other = m.senderId === userId ? m.receiverId : m.senderId;
    if (other === userId) continue; // ignore any self-messages
    activity[other] = { at: m.createdAt.getTime(), text: m.text }; // asc → last wins = latest
  }
  return activity;
}

// ─── Chat Message Queries ─────────────────────────────────────────────────────

/**
 * Returns all messages exchanged between two survivors, ordered chronologically.
 */
export async function findMessages(
  userIdA: string,
  userIdB: string
): Promise<ChatMessage[]> {
  return prisma.chatMessage.findMany({
    where: {
      OR: [
        { senderId: userIdA, receiverId: userIdB },
        { senderId: userIdB, receiverId: userIdA },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
}

/** Creates a new outbound message from the current user to a survivor */
export async function createMessage(
  senderId: string,
  receiverId: string,
  text: string
): Promise<ChatMessage> {
  return prisma.chatMessage.create({
    data: {
      senderId,
      receiverId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  });
}

/** Updates the text of an existing message */
export async function updateMessageText(
  messageId: string,
  text: string
): Promise<ChatMessage> {
  return prisma.chatMessage.update({
    where: { id: messageId },
    data: { text },
  });
}

/** Permanently deletes a message by its ID */
export async function deleteMessageById(messageId: string): Promise<void> {
  await prisma.chatMessage.delete({ where: { id: messageId } });
}
