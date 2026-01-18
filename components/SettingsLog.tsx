"use client";

import { getDownloadedTorrent } from "@/lib/api/settings";
import { useEffect, useState } from "react";

type Logs = { 
    title: string, 
    download_at: Date
}

export function SettingsLogs() {
    const [tableData, setTableData] = useState<Logs[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            const res = await getDownloadedTorrent(currentPage, pageSize);
            const mappedLogs = res.data.map(log => ({
                title: log.title,
                download_at: log.download_at,
            }));

            setTableData(mappedLogs);
            setTotalPages(Math.ceil(res.totalCount / pageSize));
        };

        fetchLogs();
        const timer = setInterval(fetchLogs, 5000);

        return () => clearInterval(timer);
    }, [currentPage]);

    return (
        <div className="mt-8 p-2 flex flex-col gap-4">
            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-auto mx-auto">
                    <thead>
                        <tr className="text-sm font-medium text-gray-700 uppercase bg-gray-200">
                            <th className="px-4 py-3">No.</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Download Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item, index) => (
                            <tr key={index} className="text-sm">
                                <td className="border px-4 py-2 text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                                <td className="border px-4 py-2">{item.title}</td>
                                <td className="border px-4 py-2 text-center">
                                    {new Intl.DateTimeFormat("default", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }).format(item.download_at)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards for small screens */}
            <div className="md:hidden flex flex-col gap-2">
                {tableData.map((item, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-4 shadow-sm bg-white flex flex-col"
                    >
                        <div className="text-gray-700 break-words">
                            {item.title}
                        </div>
                        <div className="text-gray-500 text-sm mt-4">
                            {new Intl.DateTimeFormat("default", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            }).format(item.download_at)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-center mt-6 gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded ${currentPage === page ? "bg-gray-300" : ""}`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
