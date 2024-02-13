import FormOder from '@/components/FormOrder';

const get_list_currrency = async () => {
  const heaader = {"X-Device-Id": `${process.env.NEXT_PUBLIC_X_DEVICE_ID}`}
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/currencies/`, {headers: heaader}) //Recordar colocar en .env
  const data = await res.json()
  return data
}

export default async function Home() {

  const listCurrency = await get_list_currrency()

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-0 lg:px-8">
        <div className="border-2 border-gray-200/30 shadow-md shadow-grey-800/20 rounded-2xl px-8 py-0 sm:w-full lg:w-1/2 sm:mx-auto">
          
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-5 text-center text-3xl font-semibold leading-10 tracking-tight text-gray-700">
              Crear pago
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full">
            <FormOder listCurrency={listCurrency}/>
          </div>
        </div>
      </div>
    </>
  );
}
