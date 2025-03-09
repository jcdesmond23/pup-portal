import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { dispenseTreat } from '../../api/treats';
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import LoginModal from '../LoginModal/LoginModal'
import VideoFeed from '../VideoFeed/VideoFeed';

function MainContent() {
    const { isAuthenticated, openLoginModal } = useAuth();
    const [treatsDispensed, setTreatsDispensed] = useState(0);
    const [isDispensing, setIsDispensing] = useState(false);
    const [dispenseError, setDispenseError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            openLoginModal()
        }
    }, [isAuthenticated, openLoginModal])
    
    if (!isAuthenticated) {
        return <LoginModal />
    }

    const handleDispenseTreat = async () => {
        if (isDispensing) return;
        
        setIsDispensing(true);
        setDispenseError(null);
        
        try {
            await dispenseTreat();
            setTreatsDispensed(prev => prev + 1);
        } catch (err) {
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