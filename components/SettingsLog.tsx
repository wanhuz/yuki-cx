"use client";

import { getDownloadedTorrent } from "@/lib/api/settings";
import { useEffect, useState } from "react";

type Logs = { 
    title: string, 
    download_at: Date
}

export function SettingsLogs() {
    const [tableData, setTableData] = useState<Logs[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            const logs = await getDownloadedTorrent();
            const mappedLogs = logs.map(log => ({
                title: log.title,
                download_at: log.download_at
            }));
            setTableData(mappedLogs);
        };

        fetchLogs();

        const timer = setInterval(() => {
            fetchLogs();
        }, 5000); // 30 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="mt-8 p-2">
            <table className="w-full table-auto mx-auto">
                <thead>
                    <tr className="text-sm font-medium text-gray-700 uppercase bg-gray-200 ">
                        <th className="px-4 py-3">No.</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.length < 1 && <tr><td colSpan={3} className="text-center py-10">No data found</td></tr>}
                    {tableData && tableData.map((item: {title: string, download_at: Date}, index: number) => (
                        <tr key={index} className="text-sm">
                            <td className="border px-4 py-2">{++index}</td>
                            <td className="border px-4 py-2">{item.title}</td>
                            <td className="border px-4 py-2">
                                {
                                    new Intl.DateTimeFormat('default', { 
                                        year: 'numeric', 
                                        month: '2-digit', 
                                        day: '2-digit', 
                                        hour: '2-digit', 
                                        minute: '2-digit', 
                                        second: '2-digit' 
                                    }).format(item.download_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
