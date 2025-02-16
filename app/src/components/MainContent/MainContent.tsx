import { useState } from 'react'

function MainContent() {
    const [treatsDispensed, setTreatsDispensed] = useState(0)
    
    return (
        <div className="main-content flex flex-col gap-4">
            <div className='flex items-center justify-between gap-4'>
                <h2 className="text-lg xs:text-xl font-bold">Live Feed</h2>
                <h2 className="text-lg xs:text-xl font-bold">Treats Dispensed: {treatsDispensed}</h2>
            </div>
            <div className="w-full max-w-screen-md aspect-video bg-red-500" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => {setTreatsDispensed(treatsDispensed + 1)}}>
                Dispense Treats
            </button>
        </div>
    )
}

export default MainContent