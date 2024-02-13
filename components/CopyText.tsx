import React from 'react';
import Image from "next/image"
import Copy from "@/public/img/Copy.svg";

interface CopyTextProps {
    text: string;
    style?: string;
}

const CopyText: React.FC<CopyTextProps> = ({ text, style }) => {
    return (
        <>
            <Image onClick={() => navigator.clipboard.writeText(text)} className={`${style} h-4.5 w-4.5 cursor-pointer relative`} src={Copy} alt=""/> 
        </>
    )
}

export default CopyText