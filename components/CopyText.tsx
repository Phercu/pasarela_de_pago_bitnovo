import Image from "next/image"
import Copy from "@/public/img/Copy.svg";

const CopyText = ({ text, style }) => {
    return (
        <>
            <Image onClick={() => navigator.clipboard.writeText(text)} className={`${style} h-4.5 w-4.5 cursor-pointer relative`} src={Copy} alt=""/> 
        </>
    )
}

export default CopyText