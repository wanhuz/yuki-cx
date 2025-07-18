// AddToSchedulerForm.tsx (Client Component)
'use client';

import { useFormStatus } from 'react-dom';
import { addToScheduler } from '@/lib/api/scheduler';
import { toast } from 'react-toastify';

export function AddToSchedulerForm({ AB_ID, SeriesName }: { AB_ID: number, SeriesName : string}) {


    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        try {
            await addToScheduler(formData);
            toast.success(`Added ${SeriesName} to scheduler`);
        } catch (error) {
            toast.error(`Failed to add ${SeriesName} to scheduler`);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="hidden" name="ab_id" value={AB_ID} />
            <input type="hidden" name="series_name" value={SeriesName} />
            <button
                type="submit"
                className={'bg-sky-500 text-white py-1 px-3 hover:bg-sky-600 h-12 rounded-xl text-sm sm:text-md disabled:bg-sky-300'}
            >
                Add to Scheduler
            </button>
        </form>
    );
}

