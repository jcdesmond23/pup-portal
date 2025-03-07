import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../api/config';

function VideoFeed() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const img = new Image();

        const handleLoad = () => {
            setError(null);
            setIsLoading(false);
        };

        const handleError = () => {
            setError('Unable to connect to camera');
            setIsLoading(false);
            // Retry connection after 5 seconds
            setTimeout(() => {
                setIsLoading(true);
                img.src = `${API_BASE_URL}/video/stream?t=${Date.now()}`;
            }, 5000);
        };

        img.onload = handleLoad;
        img.onerror = handleError;
        img.src = `${API_BASE_URL}/video/stream`;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, []);

    return (
        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {!error && (
                <img
                    src={`${API_BASE_URL}/video/stream?t=${Date.now()}`}
                    alt="Live video feed"
                    className={`w-full h-full object-contain transition-opacity duration-300 ${
                        isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                />
            )}
            {(error || isLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="text-center">
                        {error ? (
                            <>
                                <p className="text-white mb-4">{error}</p>
                                <button
                                    onClick={() => {
                                        setIsLoading(true);
                                        setError(null);
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Retry Connection
                                </button>
                            </>
                        ) : (
                            <p className="text-white">Connecting to camera...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoFeed;
