const ModalList = ({
    filterCurrencyValid,
    currencySelected,
    changeCurrency,
    setShow,
    data,
    show
}) => {
    return(
        <>
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal={true}>
                <div className="fixed lg:max-h-[90%] bg-white inset-0 bg-opacity-100 transition-opacity"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl shadow-slate-200/70 transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-0">
                        <div className="sm:items-start">
                            <div className="sm:flex mt-3 text-center sm:mt-0 sm:text-left">
                                <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Seleccionar criptomoneda</h3>
                                <svg onClick={() => setShow(!show)} className="h-5 w-5 cursor-pointer relative sm:left-[64%] lg:left-2/3 top-1 curs bottom-1 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        </div>
                        <div className="bg-white px-4 py-3 sm:px-6">
                            <input
                            id="concepto"
                            name="concepto"
                            placeholder="Buscar"
                            type="text"
                            required
                            onKeyDown={filterCurrencyValid}
                            className="block w-full rounded-md border-0 px-3 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                            />
                            <ul role="list" className="divide-y divide-gray-100">
                            {
                                data?.map((currency) => 
                                <li key={currency?.symbol} onClick={()=> changeCurrency(currency)} className="flex justify-between gap-x-6 px-2 py-3 rounded-md cursor-pointer hover:bg-slate-100">
                                    <div className="flex min-w-0 gap-x-4">
                                        <img className="h-10 w-10 mt-1.5 flex-none rounded-full bg-gray-50" src={currency.image} alt=""/>
                                        <div className="min-w-0 flex-auto">
                                        <p className="text-sm mt-1 font-semibold leading-6 text-gray-900">{currency.name}</p>
                                        <p className="truncate text-xs leading-5 text-gray-500">{currency.symbol}</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 sm:flex sm:flex-col sm:items-end mt-2">
                                    {
                                        currencySelected.symbol != currency.symbol ?
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-sky-300">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    }
                                    </div>
                                </li>
                                )
                            }
                            </ul>                                  
                        </div>
                    </div>
                    </div>
                </div>
            </div>          
        </>
    )
}

export default ModalList