import React from 'react';
import Image from "next/image"
import Apro from "@/public/img/tick-circle.svg";
import Cancel from "@/public/img/close-circle.svg";
import { useRouter } from 'next/navigation'


interface NotificationsProps {
    active: boolean;
  }

const Notification: React.FC<NotificationsProps> = ({ active }) => {
    const router = useRouter()

    return (
        <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-0 lg:px-8">
            <div className="border-2 border-gray-200/30 shadow-md shadow-grey-800/20 rounded-2xl px-8 py-0 sm:w-full lg:w-1/3 sm:mx-auto">
            
            <div className="sm:mx-auto sm:w-full sm:max-w-sm py-8 px-3 text-center">
                <div className="flex justify-center">
                <Image className="h-20 w-20" src={active ? Apro : Cancel} alt=""/>
                </div>
                <h2 className="mt-5 text-center text-2xl font-semibold leading-10 tracking-tight text-gray-700">
                    {`¡Pago ${active ? 'completado' : 'cancelado'}!`}
                </h2>
                <span className="flex my-5 justify-center pb-5">
                Lorem ipsum dolor sit amet consectetur. Laoreet blandit auctor et varius dolor elit facilisi enim. Nulla ut ut eu nunc.
                </span>
                <button
                  type="submit"
                  onClick={() => router.push(`/`)}
                  className="flex w-full mt-6 justify-center disabled:bg-[#C6DFFE] rounded-md bg-[#035AC5] px-3 py-4 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#035AC5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#035AC5]"
                >
                  Crear nuevo pago
                </button>
            </div>

            </div>
        </div>
        </>
    )
}

export default Notification