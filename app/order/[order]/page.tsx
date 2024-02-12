'use client'

import moment from "moment";
import QRCode from "react-qr-code";
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation'
import Image from "next/image"
import Timer from "@/public/img/timer.svg";
import Warning from "@/public/img/warning-2.svg";
import Metamask from "@/public/img/metamask.jpg";
import CopyText from "@/components/CopyText";

import Notification from "@/components/Notification";

const Order = () => {

    enum CriptoCurrencysQR {
        XRP_TEST = 'ripple',
        BTC_TEST = "bitcoin",
        ETH_TEST = "ethereum",
        BCH_TEST = "bchtest",
        USDC_TEST3 = "ethereum"
    };

    const params = useParams<{ order: string }>()
    const [web3, setWeb3] = useState(false)
    const [existsQR, setExistsQr] = useState(false)
    const [loading, setLoading] = useState(true)
    const [textLoading, setTextLoading] = useState('Cargando datos...')
    const [dataOrder, setDataOrder] = useState({})
    const [currency, setCurrency] = useState({})
    const [payExpired, setPayExpired] = useState(false)

    const [[minutes, seconds], setTime] = useState([0, 0]);
    const reset = () => setTime([Number(minutes), Number(seconds)]);

    const tick = () => {
        if (minutes === 0 && seconds === 0) {
            reset()
        } else if (seconds === 0) {
            setTime([minutes - 1, 59]);
        } else {
            setTime([minutes, seconds - 1]);
        }
    };

    const millisecondsToSecondsAndMinutes = (milisegundos) => {
        const segundos = Math.floor(milisegundos / 1000);
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;

        const minutosFormateados = minutos.toString().padStart(2, '0');
        const segundosFormateados = segundosRestantes.toString().padStart(2, '0');
        setTime([Number(minutosFormateados), Number(segundosFormateados)])
    }

    const expire_time = (expire, type) => {
        const date = new Date()
        const dateExp = moment(new Date(expire))
        return dateExp.diff(date, type)
    }

    const get_order_identifier = async () => {
        const heaader = {"X-Device-Id": "e9a05b02-3429-4cf8-8846-4d24129744f7"}
        const res = await fetch(`https://payments.pre-bnvo.com/api/v1/orders/info/${params.order}`, {headers: heaader}) //Recordar colocar en .env
        
        if(res.status === 500){
            setTextLoading('Error: Orden de pago no encontrada')
            return
        }

        const data = await res.json()
        const currencyQR = data[0].address.split(':')

        if(currencyQR.length > 1){
            data[0].address = currencyQR[1]
            setExistsQr(true)
        }

        if(data[0].status === 'EX' || data[0].status === 'OC' || data[0].status === 'CO' || data[0].status === 'AC'){
            setPayExpired(true)
        } else {
            millisecondsToSecondsAndMinutes(expire_time(data[0].expired_time,'miliseconds'))
        }

        setDataOrder(data[0])
        await get_list_currrency(data[0].currency_id)
        setLoading(false)
    }

    const get_list_currrency = async (currency) => {
        const heaader = {"X-Device-Id": "e9a05b02-3429-4cf8-8846-4d24129744f7"}
        const res = await fetch("https://payments.pre-bnvo.com/api/v1/currencies/", {headers: heaader}) //Recordar colocar en .env
        const data = await res.json()
        let moned = data.find((element) => element.symbol === currency)
        setCurrency(moned)
    }

    const connectWalletMetamask = () => {
        if(window.ethereum && window.ethereum.isMetaMask) {
            let w = ''
            window.ethereum.request({method: 'eth_requestAccounts'}).then((wallet) => {
                w = wallet
            })
            const transactionParameters = { 
                from: w, 
                to: '0xcA6841b4ff679a62bDfb1090A0dDbA1a6Ef74545', 
                value: 0.0000537 
            };
            window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],                    
            })            
        }
    }

    useEffect(() => {
        let socket = new WebSocket(`wss://payments.pre-bnvo.com/ws/${params.order}`);
        socket.onclose = () => {
            get_order_identifier().then(() => {
                setPayExpired(true)
            })
            return () => {
                socket.close();
            }
        };
    }, [payExpired]);

    useEffect(() => {
        get_order_identifier()
    },[])

    useEffect(() => {
        if(!loading){
            if(seconds != 0 || minutes != 0){
                const timerId = setInterval(() => tick(), 900);
                return () => clearInterval(timerId);
            } else {
                setPayExpired(true)
                return
            }
        }
    })

    return (
        <>
            {
                !loading ?
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-0 lg:px-8">
                        {
                            !payExpired ?
                                <div className="lg:px-32 py-0 sm:w-full lg:w-full sm:mx-auto">
                                    <div className="lg:flex sm:flex-wrap md:flex">
                                        <div className="flex-1 sm:1/1 lg:w-1/2 m-3">
                                            <h2 className="mt-5 text-lefttext-base text-lg font-semibold leading-10 tracking-tight text-gray-700">
                                                Resumen del pedido
                                            </h2>
                                            <div className="rounded-md text-sm text-[#002859] bg-gray-100 px-5 py-0.5">
                                                <div className="flex justify-between my-5">
                                                    <span className="font-semibold">Importe: </span>
                                                    <span className="font-medium">{dataOrder?.fiat_amount} {dataOrder?.fiat} </span>
                                                </div>
                                                <hr />
                                                <div className="flex justify-between my-5">
                                                    <span className="font-semibold">Moneda seleccionada: </span>
                                                    <img className="h-7 w-7 ml-auto relative bottom-1 mr-1 rounded-full bg-gray-50" src={currency?.image} alt=""/>
                                                    <span className="font-medium">{dataOrder?.currency_id} </span>
                                                </div>
                                                <hr />
                                                <div className="flex justify-between my-5">
                                                    <span className="font-semibold">Comercio: </span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-auto relative top-0.5 mr-1 fill-current text-sky-300">
                                                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                    </svg>

                                                    <span className="font-medium">Comercio de  pruebas Semega </span>
                                                </div>
                                                <div className="flex justify-between my-5">
                                                    <span className="font-semibold">Fecha: </span>
                                                    <span className="font-medium">{moment(dataOrder?.created_at).format('DD/MM/yyyy HH:mm')}</span>
                                                </div>
                                                <hr />
                                                <div className="flex justify-between my-5">
                                                    <span className="font-semibold">Concepto: </span>
                                                    <span className="font-medium">{dataOrder?.notes}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 sm:1/1 lg:w-1/2 m-3">
                                            <h2 className="mt-5 text-left text-lg font-semibold leading-10 tracking-tight text-gray-700">
                                                Realizar el pedido
                                            </h2>
                                            <div className="border-2 text-center border-gray-200/30 shadow-md shadow-grey-800/20 rounded-md">
                                                <div className="flex my-5 justify-center">
                                                    <Image className="h-7 w-7 relative bottom-0.5 right-0.5 rounded-full bg-gray-50" src={Timer} alt=""/>
                                                    <span className="text-[#002859]">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
                                                </div>
                                                <div className="my-5">
                                                <button
                                                    type="submit"
                                                    onClick={() => setWeb3(false)}
                                                    className={`${!web3 ? 'bg-[#035AC5] m-1 text-white px-3.5' : 'bg-[#F9FAFC] m-1 text-[#647184]'} py-1 rounded-full`}
                                                    >
                                                    Smart QR
                                                </button>
                                                <button
                                                    type="submit"
                                                    onClick={() => setWeb3(true)}
                                                    className={`${web3 ? 'bg-[#035AC5] m-1 text-white px-3.5' : 'bg-[#F9FAFC] m-1 text-[#647184]'} py-1 rounded-full`}
                                                    >
                                                    Web3
                                                </button>
                                                </div>
                                                <div className="flex my-5 justify-center">
                                                    {
                                                        !web3 ?
                                                        <QRCode value={`${!existsQR ? `${CriptoCurrencysQR[dataOrder.currency_id]}:` : ''}${dataOrder?.address}?amount=${dataOrder?.crypto_amount}${dataOrder?.tag_memo ? `&dt=${dataOrder?.tag_memo}` : ''}`} size={160} />
                                                        :
                                                        <Image onClick={connectWalletMetamask} className="h-40 w-40 cursor-pointer relative bottom-0.5 right-0.5" src={Metamask} alt=""/>
                                                    }
                                                </div>
                                                <div className="flex my-5 justify-center">
                                                    <span className="text-[#002859]">Enviar <span className="font-semibold">{dataOrder?.crypto_amount} {dataOrder?.currency_id}</span> </span>
                                                    <CopyText text={dataOrder?.crypto_amount} style={'left-2'}/>
                                                </div>
                                                <div className="flex my-5 justify-center break-words">
                                                    <span className="text-[#002859] w-2/3">{dataOrder?.address}</span> 
                                                    <CopyText text={dataOrder?.address} style={'top-0.5'}/>
                                                </div>
                                                <div className="flex my-5 justify-center text-sm font-semibold">
                                                    <Image className="h-4.5 w-4.5 relative right-1" src={Warning} alt=""/> 
                                                    <span className="text-[#002859]">Etiqueta destino {dataOrder?.tag_memo}</span>
                                                    <CopyText text={dataOrder?.tag_memo} style={'left-2'}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <Notification active={dataOrder.status === 'CO' || dataOrder.status === 'AC' ? true : false}/>
                        }
                    </div>
                :
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-0 lg:px-8 text-center">
                        <div className="border-gray-200/30 shadow-grey-800/20 rounded-2xl px-8 py-0 sm:w-full lg:w-1/2 sm:mx-auto">
                            <h1 className="text-xl font-bold text-slate-400">{textLoading}</h1>
                        </div>
                    </div>                    
            }
        </>
    )
}

export default Order