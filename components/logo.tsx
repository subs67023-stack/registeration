"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
    width: number;
    height: number;
    className?: string;
    textClassName?: string;
}

export default function Logo({ width, height, className = "object-contain", textClassName = "text-indigo-900 font-bold" }: LogoProps) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div
                className={`flex items-center justify-center bg-indigo-50 rounded-full border border-indigo-100`}
                style={{ width, height }}
            >
                <span className={`${textClassName}`} style={{ fontSize: width / 2 }}>R</span>
            </div>
        );
    }

    return (
        <Image
            src="/logo-new.jpg"
            alt="Logo"
            width={width}
            height={height}
            className={className}
            onError={() => setError(true)}
        />
    );
}
