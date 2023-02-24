import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";

export default function EditCuisineSkeleton() {
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Cuisines', href: '/app/cuisines'}, {name: 'Edit Cuisine'}]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <div className="shadow border">

          <div className="p-4 sm:p-6 border-b">
            <h1 className={'font-semibold'}>Edit Cuisine</h1>
          </div>


          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 relative">
                <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                  Name <sup className='text-red-primary'>*</sup>
                </label>
                <div className="block bg-gray-200 w-full h-8 animate-pulse rounded-md"></div>
              </div>

              <div className="col-span-6 relative">
                <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                  Description
                </label>
                <div className="block bg-gray-200 w-full h-20 animate-pulse rounded-md"></div>
              </div>

              <div className="col-span-6 sm:col-span-3 relative">
                <label htmlFor="image" className="block text-sm font-bold text-gray-700">
                  Image
                </label>
                <div className="block bg-gray-200 w-full h-8 animate-pulse rounded-md"></div>
              </div>

              <div className="col-span-6 sm:col-span-3 relative">
                <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                  Status <sup className='text-red-primary'>*</sup>
                </label>
                <div className="block bg-gray-200 w-full h-8 animate-pulse rounded-md"></div>
              </div>

            </div>

            <div className="pt-4 sm:pt-6 md:pt-8">

              <div className="flex justify-end gap-x-3">

                <div className="block bg-gray-200 w-28 h-8 animate-pulse rounded-md"></div>

                <div className="block bg-gray-200 w-28 h-8 animate-pulse rounded-md"></div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  </>
}
