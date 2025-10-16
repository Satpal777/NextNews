import React from 'react';
import { Newspaper, Zap } from 'lucide-react';

interface LogoProps {
    className?: string;
}

export function Logo({ className = '' }: LogoProps) {
    return (
        <div className={`flex items-center space-x-2 group ${className}`}>
            {/* Logo icon wrapper */}
            <div className="relative">
                {/* Animated background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-zinc-400 via-zinc-500 to-zinc-600 rounded-xl blur opacity-30 group-hover:opacity-50 animate-pulse"></div>

                {/* Main logo container */}
                <div className="relative bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 p-3 rounded-xl border border-zinc-600 shadow-lg">
                    {/* Lightning accent */}
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-1 shadow-md">
                        <Zap className="w-3 h-3 text-zinc-900" strokeWidth={3} fill="currentColor" />
                    </div>

                    {/* Main newspaper icon */}
                    <Newspaper className="w-7 h-7 text-zinc-100 group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
                </div>
            </div>

            {/* Text section */}
            <div className="flex flex-col">
                <div className="relative">
                    <span className="text-2xl font-black bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-900 bg-clip-text text-transparent leading-tight tracking-tight">
                        News
                    </span>
                    <span className="text-2xl font-black bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-700 bg-clip-text text-transparent leading-tight">
                        Man
                    </span>

                    {/* Accent dot */}
                    <div className="absolute -top-1 right-0 w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-sm"></div>
                </div>

                {/* Animated underline */}
                <div className="relative mt-0.5">
                    <div className="h-0.5 bg-gradient-to-r from-zinc-400 via-zinc-500 to-zinc-600 rounded-full"></div>
                    <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                </div>

                {/* Tagline */}
                <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                    Breaking Stories
                </span>
            </div>

            {/* Side accents */}
            <div className="hidden sm:flex flex-col space-y-1 ml-2">
                <div className="w-1 h-3 bg-gradient-to-b from-zinc-400 to-zinc-600 rounded-full"></div>
                <div className="w-1 h-2 bg-gradient-to-b from-zinc-500 to-zinc-700 rounded-full"></div>
                <div className="w-1 h-4 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-full"></div>
            </div>
        </div>
    );
}
