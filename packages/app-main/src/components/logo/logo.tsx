'use client';

import Image from "next/image";
import bluebankLogo from "../../../public/BlueBank.svg";

type LogoSize = 'small' | 'medium' | 'large';

const sizes = {
    small: { width: 60, height: 60 },
    medium: { width: 120, height: 120 },
    large: { width: 180, height: 180 }
};

export function Logo({ size = 'medium' }: { size?: LogoSize }) {
    const { width, height } = sizes[size];
    
    return (
        <div>
            <Image src={bluebankLogo} alt="Logo" width={width} height={height} />
        </div>
    );
}