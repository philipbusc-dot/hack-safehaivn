import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    isOpen: boolean;
    title?: string;
    submitLabel?: string;
    initialName?: string;
    initialValue?: number | null;
    initialUnit?: string;
    saving?: boolean;
    error?: string | null;
    onClose: () => void;
    onSubmit: (name: string, value: number, unit: string) => void;
};

const DEFAULT_UNIT = "days";

export default function InputModal({
    isOpen,
    title = "Add a Statistic",
    submitLabel = "Save",
    initialName = "",
    initialValue = null,
    initialUnit = DEFAULT_UNIT,
    saving = false,
    error = null,
    onClose,
    onSubmit,
}: Props) {
    const [name, setName] = useState(initialName);
    const [days, setDays] = useState(
        initialValue === null ? "" : String(initialValue)
    );
    const [unit, setUnit] = useState(initialUnit);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setDays(initialValue === null ? "" : String(initialValue));
            setUnit(initialUnit || DEFAULT_UNIT);
            setLocalError("");
        }
    }, [isOpen, initialName, initialValue, initialUnit]);

    if (!isOpen) return null;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = Number(days);
        if (!name.trim()) {
            setLocalError("Factor name is required.");
            return;
        }
        if (!Number.isFinite(value) || value < 0) {
            setLocalError("The value must be 0 or more.");
            return;
        }
        if (!unit.trim()) {
            setLocalError("A unit is required (e.g. days, kg, L).");
            return;
        }
        onSubmit(name.trim(), value, unit.trim());
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <form
                className="flex flex-col gap-4 bg-bg border-2 border-line w-full max-w-md rounded-2xl p-6"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleFormSubmit}
            >
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col text-muted gap-2">
                        <h1 className="text-xl font-bold text-white">{title}</h1>
                        <p>A statistic can better inform others of your situation</p>
                    </div>
                </div>

                <label className="flex flex-col gap-1 text-xs text-muted font-bold">
                    Statistic Name
                    <input
                        autoFocus
                        className="bg-surface rounded-lg text-sm px-3 py-2 text-white"
                        placeholder="Type Here"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <div className="flex flex-row gap-3">
                    <label className="flex flex-1 flex-col gap-1 text-xs text-muted font-bold">
                        Statistic Value
                        <input
                            type="number"
                            min={0}
                            className="bg-surface rounded-lg text-sm px-3 py-2 text-white"
                            placeholder="Type Here"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                        />
                    </label>

                    <label className="flex w-28 flex-col gap-1 text-xs text-muted font-bold">
                        Unit
                        <input
                            type="text"
                            className="bg-surface rounded-lg text-sm px-3 py-2 text-white"
                            placeholder="days"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        />
                    </label>
                </div>

                {(localError || error) && (
                    <p className="text-danger text-sm">{localError || error}</p>
                )}
                <div className="flex flex-row justify-end gap-5">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex items-center justify-center text-muted font-light gap-2 p-2 disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center text-muted gap-2 p-2 font-bold disabled:opacity-50 cursor-pointer"
                    >
                        {submitLabel}
                    </button>
                </div>
            </form>
        </div>,
        document.body
    );
}
