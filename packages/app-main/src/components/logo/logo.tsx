'use client';

import Image from "next/image";
import bluebankLogo from "../../../public/BlueBank.svg";

export function Logo({ width, height }: { width: number, height: number }) {
    return (
        <div>
            <Image src={bluebankLogo} alt="Logo" width={width} height={height} />
        </div>
    );
}