function MainContent() {
    return (
        <div className="main-content flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Live Feed</h2>
            <div className="w-full max-w-screen-md aspect-video bg-red-500" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => {console.log('dispense treats')}}>Dispense Treats</button>
        </div>
    )
}

export default MainContent