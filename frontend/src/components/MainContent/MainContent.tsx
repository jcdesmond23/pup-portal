import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { dispenseTreat } from '../../api/dispense';
import { isAuthError } from '../../api/errors';
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import VideoFeed from '../VideoFeed/VideoFeed';
import Login from '../Login/Login';

function MainContent() {
    const { isAuthenticated, logout } = useAuth();
    const [treatsDispensed, setTreatsDispensed] = useState(0);
    const [isDispensing, setIsDispensing] = useState(false);
    const [dispenseError, setDispenseError] = useState<string | null>(null);
    
    if (!isAuthenticated) {
        return <Login />
    }

    const handleDispenseTreat = async () => {
        if (isDispensing) return;
        
        setIsDispensing(true);
        setDispenseError(null);
        
        try {
            await dispenseTreat();
            setTreatsDispensed(prev => prev + 1);
        } catch (err) {
            // Check if it's an auth error and logout if so
            if (isAuthError(err)) {
              logout();
            }
            setDispenseError(err instanceof Error ? err.message : 'Failed to dispense treat');
        } finally {
            setIsDispensing(false);
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow overflow-y-auto">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-[640px] mx-auto">
                        <div className="main-content flex flex-col gap-4">
                            <div className='flex items-center justify-between gap-4'>
                                <h2 className="text-lg xs:text-xl font-bold">Live Feed</h2>
                                <h2 className="text-lg xs:text-xl font-bold">Treats Dispensed: {treatsDispensed}</h2>
                            </div>
                            <VideoFeed />
                            <div className="flex flex-col items-center gap-2">
                                <button 
                                    className={`
                                        w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium
                                        transition-colors duration-200
                                        ${isDispensing 
                                            ? 'bg-blue-400 cursor-not-allowed' 
                                            : 'hover:bg-blue-600 active:bg-blue-700'}
                                    `}
                                    onClick={handleDispenseTreat}
                                    disabled={isDispensing}
                                >
                                    {isDispensing ? 'Dispensing...' : 'Dispense Treats'}
                                </button>
                                {dispenseError && (
                                    <p className="text-red-500 text-sm">{dispenseError}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default MainContent