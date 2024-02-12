'use client'

import Image from 'next/image'
import Info from "../public/img/info-circle.svg";
import { useState, useEffect, Component } from "react"
import ModalList from './ModalList';
import { useRouter } from 'next/navigation'
import PropTypes from 'prop-types';

const FormOder = ({ listCurrency }) => {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [dataForm, setdataForm] = useState({
      importe: 0,
      concepto: ""
    })
    const [currencySelected, setCurrencySelected] = useState({
        "symbol": "",
        "name": "",
        "min_amount": "",
        "max_amount": "",
        "image": "",
        "blockchain": ""
    })

    useEffect(() => {
      setData(listCurrency)
    }, [])

    useEffect(() => {
      setReload(!reload)
    }, [data])

    const changeCurrency = (currency: object) => {
      setCurrencySelected(currency)
      setShow(false)
    }

    const inputsForm = (e: { target: { name: string; value: any; }; }) => {
      setdataForm({...dataForm, [e.target.name]: e.target.value})
      if(e.target.name === 'importe'){
        const newListCurrency = listCurrency.filter((c) => Number(e.target.value) >= c.min_amount && Number(e.target.value) <= c.max_amount)
        setData(newListCurrency)
      }
    }

    const filterCurrencyValid = (e) => {
      const newListCurrency = listCurrency.filter((c: { min_amount: number; }) => dataForm.importe > c.min_amount)
    }

    const create_payment = async (e) => {
      setLoading(true)
      e.preventDefault()

      const body = {
        expected_output_amount: dataForm.importe,
        input_currency: currencySelected.symbol,
        notes: dataForm.concepto,
        merchant_urlko: 'http://localhost:3000',
        merchant_urlok: 'http://localhost:3000'
      }

      const heaader = {"X-Device-Id": "e9a05b02-3429-4cf8-8846-4d24129744f7"}
      const res = await fetch("https://payments.pre-bnvo.com/api/v1/orders/", {
        method: 'post',
        headers: heaader,
        body: JSON.stringify(body) || null,
      }).then(r => r.json())
        .then(data => {
          router.push(`/order/${data.identifier}`)
      }) //Recordar colocar en .env
      
    }    

    return (
        <>
          <form className="space-y-6" action="#" method="POST" autoComplete="off" onSubmit={create_payment}>
              <div>
                <label htmlFor="importe" className="block text-sm font-bold leading-6 text-slate-900">
                  Importe a pago
                </label>
                <div className="mt-2">
                  <input
                    id="importe"
                    name="importe"
                    type="text"
                    onChange={inputsForm}
                    pattern='^\d+(?:\.\d{0,2})$'
                    placeholder="Añade importe a pagar"
                    required
                    className="block w-full rounded-md border-0 px-3 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-row lg:w-1/3">
                  <div className='basis-1/1'>
                    <label htmlFor="currency" className="block text-sm font-bold leading-6 text-gray-900">
                      Seleccionar moneda 
                    </label>
                  </div>
                  <div className='basis-1/1'>
                    <Image
                      className="relative top-1.5 left-2 mx-auto w-3"
                      src={Info}
                      alt="info-icon"
                    />                  
                  </div>
                </div>
                <div className="mt-2">
                <ul role="list" className="divide-y divide-gray-100 cursor-pointer" onClick={() => dataForm.importe != 0 ? setShow(!show) : 0}>
                    <li className="flex justify-between gap-x-6 border-2 px-3 py-4 rounded-md">
                    <div className="flex min-w-0 gap-x-4">
                        {
                          currencySelected?.symbol != '' &&
                            <img className="h-7 w-7 mt-0.5 flex-none rounded-full bg-gray-50" src={currencySelected?.image} alt=""/>
                        }
                        <div className="min-w-0 flex-auto">
                        <p className="text-sm mt-1 font-semibold leading-6 text-gray-900">{currencySelected?.name}</p>
                        </div>
                    </div>
                    <div className="shrink-0 sm:flex sm:flex-col sm:items-end mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-zinc-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    </li>
                </ul>               
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="concepto" className="block text-sm font-bold leading-6 text-gray-900">
                    Concepto
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="concepto"
                    name="concepto"
                    onChange={inputsForm}
                    placeholder="Añade descripción del pago"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 px-3 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="pb-4">
                <button
                  type="submit"
                  disabled={dataForm?.importe > 0 && dataForm?.concepto != '' && currencySelected?.symbol != '' && loading === false ? false : true}
                  className="flex w-full justify-center disabled:bg-[#C6DFFE] rounded-md bg-[#035AC5] px-3 py-4 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#035AC5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#035AC5]"
                >
                  {loading ? 'Loading...' : 'Continuar'}
                </button>
              </div>
            </form>
            {
                show &&
                  <ModalList 
                    filterCurrencyValid={filterCurrencyValid}
                    changeCurrency={changeCurrency}
                    currencySelected={currencySelected}
                    setShow={setShow}
                    data={data}
                    show={show}
                  />
            }
        </>
    )
}

FormOder.propTypes = {
  listCurrency: PropTypes.array
};

export default FormOder