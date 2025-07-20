'use client';

import { toast } from 'react-toastify';
import { addToScheduler } from '@/lib/api/scheduler';

export function AddToSchedulerForm({ anime_data }: { anime_data: Anime }) {
    

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await addToScheduler(anime_data);
            toast.success(`Added ${anime_data.SeriesName} to scheduler`, { position: "bottom-right" });
        } catch (error) {
            toast.error(`Failed to add ${anime_data.SeriesName} to scheduler`, { position: "bottom-right" });
        }
    };

    return (
        <>
        <div className="space-y-4">
            <form onSubmit={onSubmit} className="flex items-center space-x-2">
                <input type="hidden" name="ab_id" value={anime_data.ID} />
                <input type="hidden" name="series_name" value={anime_data.SeriesName} />

                <button
                    type="submit"
                    className="bg-sky-500 text-white py-1 px-3 hover:bg-sky-600 h-12 rounded-xl text-sm sm:text-md disabled:bg-sky-300"
                >
                    Add to Scheduler
                </button>

            </form>
        </div>
        </>
    );
}
