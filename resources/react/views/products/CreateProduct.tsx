import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";

export default function CreateProduct() {
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Products', href: '/app/products'}, {name: 'Add Product'}]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <div className="shadow border">
          <div className="p-4 sm:p-6 border-b">
            <h1 className={'font-semibold'}>Add Product</h1>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-bold text-gray-700">
                  Name
                </label>
                <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm font-bold text-gray-700">
                  ID
                </label>
                <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
              </div>


              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="country" className="block text-sm font-bold text-gray-700">
                  Category
                </label>
                <select id="country" name="country" autoComplete="country-name" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                  <option>Category 1</option>
                  <option>Category 2</option>
                  <option>Category 3</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="email-address" className="block text-sm font-bold text-gray-700">
                  Price
                </label>
                <input type="text" name="email-address" id="email-address" autoComplete="email" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                  Description
                </label>
                <textarea name="description" id="description" autoComplete="description" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"></textarea>
              </div>

              <div className="col-span-6">
                <label htmlFor="file-uploads" className="block text-sm font-bold text-gray-700">
                  Images
                </label>
                <div className={''}>
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">

                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>

                      <div className="flex text-sm text-gray-600">
                        <p className="pr-1">Drop your file(s) here or</p>
                        <label htmlFor="file-upload" className="relative cursor-pointer  bg-white font-medium text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 hover:text-red-500">
                          <span>browse</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 20MB</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 sm:pt-6 md:pt-8">

              <div className="flex justify-end">

                <button type="button" className="rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Cancel</button>

                <button type="submit" className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Save</button>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  </>
}
