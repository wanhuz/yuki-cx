'use client';

import { toast } from 'react-toastify';
import { startProcessingMissingEpisode } from '@/lib/api/scheduler-fetch-missing';

export  function SchedulerFetchMissingButton() {
    
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await startProcessingMissingEpisode().catch((error) => console.error(error));

            toast.success(
                <div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                        {result?.length} episode{result!.length > 1 ? "s" : ""} fetched
                    </div>
                    <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
                        {result?.map((item: string) => (
                            <div
                                key={item}
                                title={item} // full filename on hover
                                style={{
                                    borderTop: "1px solid rgba(0,0,0,0.08)",
                                    fontSize: 13,
                                    overflowWrap: "anywhere", // break long names instead of clipping
                                }}
                                >
                                {result.length > 1 ? `${item}` : `${item}`}
                            </div>
                        ))}
                    </div>
                </div>,
                {
                    position: "bottom-right",
                    style: { width: "max-content", maxWidth: "90vw" },
                    autoClose: 20000,
                }
            );
        } catch (error) {
                toast.error(`Failed to add  to scheduler`, { position: "bottom-right" });
            }
        };

    return (
        <>
            <form onSubmit={onSubmit} className="flex items-center space-x-2">
                <button
                    type="submit"
                    className="bg-sky-500 text-white py-1 px-3 sm:me-2 md:me-0 hover:bg-sky-600 h-10 rounded-xl text-sm sm:text-md disabled:bg-sky-300 text-nowrap"
                >
                    <span className='hidden sm:block'>Fetch missing episode</span>
                    <span className='block sm:hidden'>Fetch</span>
                </button>

            </form>
        </>
    );
}
