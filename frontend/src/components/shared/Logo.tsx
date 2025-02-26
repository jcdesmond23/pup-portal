import React from 'react';
import DogIcon from './DogIcon';

interface LogoProps {
    color?: string;
}

function Logo({ color }: LogoProps) {
    return (
        <div className={`flex items-center gap-4 justify-center`}>
            <DogIcon className="w-12 h-12" color={color} />
            <h1 className={`text-4xl font-bold text-${color}`}>Pup Portal</h1>
        </div>
    );
}

export default Logo;