import {BreadcrumbSkeleton} from '~/components/skeletons';

export default function ListProducts() {
  return <>
    <div className="py-6">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <BreadcrumbSkeleton pages={[1, 2, 3]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">

        <div className={'border shadow-md divide-y'}>

          <div className={'p-4 flex justify-between items-center animate-pulse'}>
            <div className={'flex items-center gap-x-2'}>
              <div className={'p-4 w-40 bg-gray-200 rounded-md'}></div>
              <div className={'p-4 w-40 bg-gray-200 rounded-md'}></div>
            </div>
            <div className={'flex items-center gap-x-2'}>
              <div className={'p-4 w-28 bg-gray-200 rounded-md'}></div>
              <div className={'p-4 w-24 bg-gray-200 rounded-md'}></div>
              <div className={'p-4 w-24 bg-gray-200 rounded-md'}></div>
            </div>
          </div>
          <div className="">
            <table className={'table-auto w-full divide-y divide-gray-300 border'}>
              <thead className={'bg-gray-50'}>
              <tr>
                <th className={'px-3 py-3.5 w-10'}>
                  <div className="bg-gray-200 rounded-md h-4 w-4 animate-pulse"></div>
                </th>
                <th className={'w-14 px-3 py-3.5 text-left uppercase font-semibold text-sm'}>
                  ID
                </th>
                <th className={'px-3 py-3.5 text-left uppercase font-semibold text-sm'}>
                  Product Name
                </th>
                <th className={'w-20 px-3 py-3.5 text-left uppercase font-semibold text-sm'}>
                  Price
                </th>
                <th className={'px-3 py-3.5 text-left uppercase font-semibold text-sm'}>
                  Description
                </th>
                <th className={'px-3 py-3.5 text-center uppercase font-semibold text-sm'}>
                  Image
                </th>
                <th className={'w-10 px-3 py-3.5 text-center uppercase font-semibold text-sm'}>
                  Action
                </th>
              </tr>
              </thead>
              <tbody className={'animate-pulse divide-y divide-gray-200 bg-white'}>

              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((row, index) => (
                <tr key={index}>
                  <td className={'px-3 py-3.5'}>
                    <div className="bg-gray-200 rounded-md h-4 w-4"></div>
                  </td>
                  <td className={'px-3 py-3.5'}>
                    <div className="bg-gray-200 rounded-md w-8 h-5"></div>
                  </td>
                  <td className={'px-3 py-3.5'}>
                    <div className="w-full bg-gray-200 rounded-md h-5"></div>
                  </td>
                  <td className={'px-3 py-3.5'}>
                    <div className="bg-gray-200 rounded-md w-14 h-5"></div>
                  </td>
                  <td className={'px-3 py-3.5'}>
                    <div className="w-full bg-gray-200 rounded-md h-5"></div>
                  </td>
                  <td className={'px-3 py-3.5'}>
                    <div className=" bg-gray-200 rounded-full w-8 h-8 mx-auto"></div>
                  </td>
                  <td className={'px-3 py-3.5'}>
                    <div className="bg-gray-200 rounded-md w-3 h-5 mx-auto"></div>
                  </td>
                </tr>
              ))}

              </tbody>
            </table>
          </div>

          <div className={'px-4 sm:px-6 md:px-8 py-4 shadow border flex items-center justify-between animate-pulse'}>
            <div className={'h-3 bg-gray-200 w-40 rounded-lg'}></div>
            <div className={'flex items-center justify-end gap-x-3'}>
              <span className={'rounded-full bg-gray-200 p-4'}></span>
              <span className="isolate inline-flex rounded-full shadow-sm overflow-hidden bg-gray-200">
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
              </span>
              <span className={'rounded-full bg-gray-200 p-4'}></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  </>
}
