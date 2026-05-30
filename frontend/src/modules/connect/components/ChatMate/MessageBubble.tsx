import type { SurvivorProfile } from "../../types/connect.types";
import type { Message } from "../../types/ChatPage.types";
import Avatar from "../Avatar";

interface MessageBubbleProps {
  msg: Message;
  activeContact: SurvivorProfile;
  /** The current user's profile picture + name, shown on "you" bubbles. */
  youAvatarUrl?: string | null;
  youName?: string;
  editingId: string | null;
  editText: string;
  onSetEditText: (text: string) => void;
  onStartEdit: (msg: Message) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (msgId: string) => void;
  onEditKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * Renders a single message bubble with sender info, message body,
 * and inline edit/delete actions for own messages.
 */
const MessageBubble = ({
  msg,
  activeContact,
  youAvatarUrl,
  youName,
  editingId,
  editText,
  onSetEditText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditKeyDown,
}: MessageBubbleProps) => {
  const isYou = msg.sender === "you";
  const isEditing = editingId === msg.id;

  return (
    <div className="self-stretch p-3 rounded-lg flex flex-col justify-start items-start overflow-hidden w-full transition-all border border-neutral-800 bg-black outline -outline-offset-1px outline-neutral-700">

      {/* Meta row: avatar, name, edit/delete actions */}
      <div className="self-stretch inline-flex justify-between items-center overflow-hidden mb-2 select-none">
        <div className="flex justify-start items-center gap-2.5 min-w-0">
          <Avatar
            src={isYou ? youAvatarUrl : activeContact.avatarUrl}
            name={isYou ? youName ?? "You" : activeContact.name}
            className={`w-6 h-6 rounded-full shrink-0 text-[10px] text-white ${isYou ? "bg-blue-700" : "bg-neutral-600"}`}
          />
          <div className={`text-base font-medium truncate ${isYou ? "text-white" : "text-lime-400"}`}>
            {isYou ? "you" : activeContact.name}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center items-center gap-2 font-mono text-xs select-none">
          {isEditing ? (
            <>
              <button
                onClick={onSaveEdit}
                className={`font-semibold uppercase tracking-wider hover:underline ${isYou ? "text-white" : "text-lime-400"}`}
              >
                save
              </button>
              <span className={isYou ? "text-white/40" : "text-lime-400/40"}>|</span>
              <button
                onClick={onCancelEdit}
                className={`font-semibold uppercase tracking-wider hover:underline ${isYou ? "text-white" : "text-lime-400"}`}
              >
                cancel
              </button>
            </>
          ) : (
            <>
              {isYou && (
                <>
                  <button
                    onClick={() => onStartEdit(msg)}
                    className="hover:underline font-light text-xs text-neutral-300 hover:text-white"
                  >
                    edit
                  </button>
                  <span className="text-neutral-500">|</span>
                  <button
                    onClick={() => onDelete(msg.id)}
                    className="hover:underline font-light text-xs text-neutral-300 hover:text-white"
                  >
                    delete
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Message body */}
      <div className="self-stretch min-w-0 pr-2">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => onSetEditText(e.target.value)}
            onKeyDown={onEditKeyDown}
            className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm px-2.5 py-1.5 outline-none rounded focus:ring-1 focus:ring-lime-400"
            autoFocus
          />
        ) : (
          <p className={`text-sm md:text-base font-normal font-['Inter'] leading-relaxed whitespace-pre-wrap wrap-anywhere ${isYou ? "text-white" : "text-lime-400"}`}>
            {msg.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
