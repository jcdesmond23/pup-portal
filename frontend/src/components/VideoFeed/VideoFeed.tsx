import { useState } from 'react';

function VideoFeed() {
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {error ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500">
                    {error}
                </div>
            ) : (
                <img
                    src="/api/video"
                    alt="Video Feed"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        console.error('Video feed error:', e);
                        setError('Failed to connect to camera');
                    }}
                />
            )}
        </div>
    );
}

export default VideoFeed;