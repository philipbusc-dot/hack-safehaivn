import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { Country } from "../types/risk.types";

type Props = {
  countries: Country[];
  value: Country | null;
  onChange: (country: Country) => void;
  loading?: boolean;
};

export default function CountrySearch({
  countries,
  value,
  onChange,
  loading,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? countries.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.iso2.toLowerCase().includes(q)
        )
      : countries;
    return pool.slice(0, 50);
  }, [countries, query]);

  const select = (c: Country) => {
    onChange(c);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2 border bg-drop rounded-full text-xs px-3 py-1">
        <Search size={13} className="text-panel shrink-0" />
        <input
          className="w-full bg-transparent outline-none text-panel placeholder:text-panel"
          placeholder={
            loading
              ? "Loading countries…"
              : value
              ? value.name
              : "Search a country…"
          }
          value={query}
          disabled={loading}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
      </div>

      {open && !loading && (
        <ul className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-surface border border-line rounded-2xl py-1 shadow-lg">
          {results.length === 0 ? (
            <li className="px-3 py-2 text-xs text-panel">No matches</li>
          ) : (
            results.map((c) => (
              <li key={c.iso2}>
                <button
                  type="button"
                  onClick={() => select(c)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-drop ${
                    value?.iso2 === c.iso2
                      ? "text-accent font-semibold"
                      : "text-white"
                  }`}
                >
                  {c.flag && (
                    <img
                      src={c.flag}
                      alt=""
                      className="w-4 h-3 object-cover rounded-sm shrink-0"
                    />
                  )}
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-[10px] uppercase text-muted">
                    {c.iso2}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
