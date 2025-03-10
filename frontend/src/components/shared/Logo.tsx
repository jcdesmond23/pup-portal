import DogIcon from './DogIcon';

function Logo() {
    return (
        <div className={`flex items-center gap-4 justify-center`}>
            <DogIcon className="w-12 h-12" color='currentColor'/>
            <h1 className={`text-4xl font-bold dark:text-white text-black`}>Pup Portal</h1>
        </div>
    );
}

export default Logo;