'use client';

import { toast, ToastOptions } from 'react-toastify';
import { startProcessingMissingEpisode } from '@/lib/api/scheduler-fetch-missing';
import { useState } from 'react';
import { FetchResult } from '@/lib/type/FetchResult';

const toastOptions: ToastOptions = {
    position: 'bottom-right',
    style: { width: 'max-content', maxWidth: '90vw' },
    autoClose: 20000,
};

function showResultToast(result: FetchResult[]) {
    // Duplicates mean the work is already done, so don't surface them
    const relevant = result.filter(
        (r) => r.status.ok || r.status.code !== 'DUPLICATE'
    );

    if (relevant.length === 0) {
        toast.info('No missing episodes found', { position: 'bottom-right' });
        return;
    }

    const succeeded = relevant.filter((r) => r.status.ok);
    const errors = relevant.filter((r) => !r.status.ok);

    const summary = [
        succeeded.length > 0 && `${succeeded.length} added`,
        errors.length > 0 && `${errors.length} failed`,
    ]
        .filter(Boolean)
        .join(' · ');

    const content = (
        <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{summary}</div>
            <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                {relevant.map((item, index) => (
                    <div
                        key={`${item.fileName}-${index}`}
                        title={item.fileName}
                        style={{
                            borderTop: '1px solid rgba(0,0,0,0.08)',
                            padding: '4px 0',
                            fontSize: 13,
                            overflowWrap: 'anywhere',
                        }}
                    >
                        <div>{item.fileName}</div>
                        {!item.status.ok && (
                            <div style={{ opacity: 0.7, fontSize: 12 }}>
                                {item.status.error}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    if (errors.length > 0) {
        toast.error(content, toastOptions);
    } else {
        toast.success(content, toastOptions);
    }
}

export function SchedulerFetchMissingButton() {
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isLoading) return; // guard against double submits

        setIsLoading(true);
        try {
            const result = await startProcessingMissingEpisode();
            showResultToast(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            toast.error(`Failed to fetch missing episodes: ${message}`, {
                position: 'bottom-right',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="flex items-center space-x-2">
            <button
                type="submit"
                disabled={isLoading}
                className="bg-sky-500 text-white py-1 px-3 sm:me-2 md:me-0 hover:bg-sky-600 h-10 rounded-xl text-sm sm:text-md disabled:bg-sky-300 text-nowrap"
            >
                <span className="hidden sm:block">
                    {isLoading ? 'Fetching...' : 'Fetch missing episode'}
                </span>
                <span className="block sm:hidden">
                    {isLoading ? '...' : 'Fetch'}
                </span>
            </button>
        </form>
    );
}