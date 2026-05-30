type Props = {
    region: string;
    score: number | undefined;
}
export default function RiskCard({ region, score }: Props) {
    return (
        <div className="flex flex-row w-full items-center text-muted italic bg-surface border border-line rounded-full justify-between px-4 py-2">
            <h1 className="flex items-center gap-2 font-bold text-sm">
                {region}
            </h1>
            <h1 className="font-bold text-lg">
                {score ?? "—"}
            </h1>
        </div>
    )
}
