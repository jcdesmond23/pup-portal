import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import LoginModal from '../LoginModal/LoginModal'
import VideoFeed from '../VideoFeed/VideoFeed';

function MainContent() {
    const { isAuthenticated, openLoginModal } = useAuth();
    const [treatsDispensed, setTreatsDispensed] = useState(0)

    useEffect(() => {
        if (!isAuthenticated) {
            openLoginModal()
        }
    }, [isAuthenticated, openLoginModal])
    
    if (!isAuthenticated) {
        return <LoginModal />
    }
    
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
                            <button 
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                                onClick={() => setTreatsDispensed(treatsDispensed + 1)}
                            >
                                Dispense Treats
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default MainContent