import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, Heart } from "lucide-react";
import { useMatchList } from "../../hooks/useMatchList";
import Avatar from "../Avatar";

interface ChatListSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Compact inbox time: today → "3:14 PM", this year → "Mar 4", else "Mar 4, 24". */
function formatInboxTime(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString(
    [],
    d.getFullYear() === now.getFullYear()
      ? { month: "short", day: "numeric" }
      : { year: "2-digit", month: "short", day: "numeric" }
  );
}

const ChatListSidebar = ({ isOpen, onClose }: ChatListSidebarProps) => {
  const navigate = useNavigate();
  const { id: activeId } = useParams<{ id: string }>();
  const { matches, loading } = useMatchList(activeId);

  if (!isOpen) return null;

  return (
    <div className="w-80 md:w-96 h-full border-r border-neutral-800 bg-neutral-900 flex flex-col select-none shrink-0 z-20 font-['Inter']">

      {/* Header */}
      <div className="self-stretch px-4 pt-8 pb-4 border-b border-neutral-800 bg-neutral-900 inline-flex justify-start items-center gap-3 shrink-0">
        <Link
          to="/connect"
          className="size-6 text-indigo-50 hover:text-white flex items-center justify-center shrink-0"
          title="Back to Matchmaking"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="flex-1 text-center pr-6 text-indigo-50 text-xl md:text-2xl font-medium truncate uppercase tracking-wide">
          name list
        </h2>
      </div>

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col justify-start items-start gap-4 scrollbar-none bg-neutral-950">
        {loading ? (
          <div className="w-full p-6 text-center text-xs text-neutral-500 font-mono animate-pulse">
            Scanning signal bands...
          </div>
        ) : matches.length > 0 ? (
          matches.map((survivor) => (
            <div
              key={survivor.id}
              onClick={() => {
                navigate(`/chat/${survivor.id}`);
                onClose();
              }}
              className={`w-full px-4 py-2.5 inline-flex justify-between items-center overflow-hidden cursor-pointer transition-all border-l-2 ${activeId === survivor.id
                ? "bg-neutral-800 border-lime-400 font-semibold"
                : "hover:bg-neutral-900/55 border-transparent"
                }`}
            >
              <div className="flex items-center justify-start gap-4 min-w-0 flex-1">
                {/* Avatar */}
                <Avatar
                  src={survivor.avatarUrl}
                  name={survivor.name}
                  className="size-8 rounded-full shrink-0 bg-neutral-800 border border-neutral-700 shadow-sm text-xs text-neutral-200"
                />

                {/* Name + last-message preview */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-white text-lg md:text-xl font-medium truncate">
                      {survivor.name}
                    </span>
                    {survivor.matchType === "love" && (
                      <span className="text-[10px] text-purple-400 bg-purple-950/40 border border-purple-500/20 px-1 rounded shrink-0">
                        <Heart fill="currentColor" />
                      </span>
                    )}
                  </div>
                  {survivor.lastMessage && (
                    <div className="text-xs text-neutral-500 truncate">
                      {survivor.lastMessage}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                {survivor.lastMessageAt && (
                  <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                    {formatInboxTime(survivor.lastMessageAt)}
                  </span>
                )}
                <span className="size-6 flex justify-center items-center text-white/80">
                  <ChevronRight size={18} strokeWidth={2.5} />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full p-6 text-center text-xs text-neutral-500 font-mono">
            No contacts online. Swipe in the Matchmaker feed to establish a signal channel.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListSidebar;
