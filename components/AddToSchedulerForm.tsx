// AddToSchedulerForm.tsx (Client Component)
'use client';

import { addToScheduler } from '@/lib/api/scheduler';
import { toast } from 'react-toastify';

export function AddToSchedulerForm({ anime_data }: { anime_data: Anime}) {

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await addToScheduler(anime_data);
            toast.success(`Added ${anime_data.SeriesName} to scheduler`, {position: "bottom-right"});
        } catch (error) {
            toast.error(`Failed to add ${anime_data.SeriesName} to scheduler`, {position: "bottom-right"});
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="hidden" name="ab_id" value={anime_data.ID} />
            <input type="hidden" name="series_name" value={anime_data.SeriesName} />
            <button
                type="submit"
                className={'bg-sky-500 text-white py-1 px-3 hover:bg-sky-600 h-12 rounded-xl text-sm sm:text-md disabled:bg-sky-300'}
            >
                Add to Scheduler
            </button>
        </form>
    );
}

