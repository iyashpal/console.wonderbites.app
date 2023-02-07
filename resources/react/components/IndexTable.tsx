export default function IndexTable({children}: { toggleCheck?: JSX.Element, children?: JSX.Element | JSX.Element[] }) {
  return <>
    <div className="">
      <div className="inline-block min-w-full align-middle">

        <div className="overflow-x-auto overflow-y-hidden">

          <table className="min-w-full table-fixed divide-y divide-gray-300 border">
            <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">

              </th>
              <th scope="col" className="w-14 py-3.5 pr-3 text-center text-sm font-semibold text-gray-900 uppercase">
                ID
              </th>
              <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900 uppercase">
                Product Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                Price
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                Description
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 uppercase">
                Image
              </th>
              <th scope="col" className="px-3 py-3.5 text-center w-10 text-sm font-semibold text-gray-900 uppercase">
                Action
              </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
            {children}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </>
}
