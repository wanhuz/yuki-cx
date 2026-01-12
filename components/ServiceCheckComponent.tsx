"use client";

export default function ServiceCheckComponent({
  name,
  status,
  reason,
}: {
  name: string;
  status: boolean;
  reason?: string;
}) {
  const statusColor = status ? "green" : "red";
  const statusMeaning = status ? "online" : "offline";

  return (
    <div className="flex items-center justify-between">
      <div>{name}</div>

      <div className="flex items-center">
        <div
          className={`w-4 h-4 rounded-full ${
            statusColor === "green" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <div className="ml-2 capitalize">
          {statusMeaning}
          {!status && reason && (
            <span className="ml-1 text-sm text-gray-400">
              ({reason})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
