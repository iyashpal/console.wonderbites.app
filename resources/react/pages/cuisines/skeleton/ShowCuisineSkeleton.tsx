import BreadcrumbSkeleton from "~/components/skeletons/BreadcrumbSkeleton";

export default function ShowCuisineSkeleton() {
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <BreadcrumbSkeleton pages={[1,2]}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="shadow px-4 pt-4 sm:px-6 sm:pt-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-xl">
                  <span className="inline-block bg-gray-200 rounded-full w-32 h-5 animate-pulse"></span>
                </span>
              </div>
              <div className="text-sm">
                <p><span className="inline-block bg-gray-200 rounded-full w-28 h-4 animate-pulse"></span></p>
                <p><span className="inline-block bg-gray-200 rounded-full w-20 h-4 animate-pulse"></span></p>
              </div>
            </div>
            <div>
              <p className={'font-medium text-sm mb-3'}>Cuisine Details</p>
              <div className={'-mx-4 sm:-mx-6'}>
                <table className={'table-auto w-full'}>
                  <thead>
                  <tr>
                    <th className={'text-left px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>Name</th>
                    <th className={'text-left px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>ID</th>
                    <th className={'text-left px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>Image</th>
                    <th className={'text-left px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>Description</th>
                    <th className={'text-left px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>Status</th>
                    <th className={'text-center px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td className={'text-left px-4 sm:px-6 py-2 whitespace-nowrap'}>
                      <span className={'text-red-primary font-bold'}>
                        <span className="inline-block bg-gray-200 animate-pulse rounded-full w-full h-5"></span>
                      </span>
                    </td>
                    <td className={'text-left px-4 sm:px-6 py-2 whitespace-nowrap'}>
                      <span className="inline-block bg-gray-200 animate-pulse rounded-full w-10 h-5"></span>
                    </td>
                    <td className={'text-left px-4 sm:px-6 py-2 whitespace-nowrap'}>
                      <div className={''}>
                        <span className="inline-block bg-gray-200 animate-pulse rounded-full w-8 h-8"></span>
                      </div>
                    </td>
                    <td className={'text-left px-4 sm:px-6 py-2'}>
                      <span className="inline-block bg-gray-200 animate-pulse rounded-full w-full h-5"></span>
                    </td>

                    <td className={'text-left px-4 sm:px-6 py-2 whitespace-nowrap'}>
                      <span className={'font-bold'}>
                        <span className="inline-block bg-gray-200 animate-pulse rounded-full w-20 h-5"></span>
                      </span>
                    </td>
                    <td className={'text-center px-4 sm:px-6 py-2 whitespace-nowrap'}>
                      <div className="flex item-center justify-center gap-x-1">
                        <span className="inline-block bg-gray-200 animate-pulse rounded-md w-7 h-7"></span>
                        <span className="inline-block bg-gray-200 animate-pulse rounded-md w-7 h-7"></span>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </>
}
