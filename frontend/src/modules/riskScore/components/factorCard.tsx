import { Pencil, Trash2 } from "lucide-react";

type Props = {
    factor: string;
    score: number | undefined;
    unit?: string;
    isWeakestLink: boolean;
    accentColor?: string;
    onDelete: () => void;
    onEdit?: () => void;
};

export default function FactorCard({
    factor,
    score,
    unit,
    isWeakestLink,
    accentColor,
    onDelete,
    onEdit,
}: Props) {
    return (
        <div
            className="flex flex-row w-full items-center text-white bg-surface border border-line rounded-full justify-between px-4 py-2"
            style={isWeakestLink && accentColor ? { borderColor: accentColor } : undefined}
        >

            <span className="flex items-center gap-2 font-bold text-sm">
                <button
                    onClick={onDelete}
                    className="cursor-pointer text-faint hover:text-danger"
                    aria-label={`Delete ${factor}`}
                >
                    <Trash2 size={16} />
                </button>
                {factor}
                {isWeakestLink && (
                    <span
                        className="text-[10px] uppercase"
                        style={accentColor ? { color: accentColor } : undefined}
                    >
                        Weakest Link
                    </span>
                )}
            </span>
            <span className="flex items-center gap-3">
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="cursor-pointer text-faint hover:text-accent"
                        aria-label={`Edit ${factor}`}
                    >
                        <Pencil size={16} />
                    </button>
                )}
                <span className="font-bold text-lg">
                    {score ?? "—"}
                    {score !== undefined && unit && (
                        <span className="ml-1 text-xs font-normal text-faint">{unit}</span>
                    )}
                </span>
            </span>
        </div>
    );
}
