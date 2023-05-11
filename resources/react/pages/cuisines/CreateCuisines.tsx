import { useCuisineForm } from '@/hooks/forms';
import Resources from '@/components/resources';
import InputError from '@/components/Form/InputError';
import Breadcrumb from '@/layouts/AuthLayout/Breadcrumb';

export default function CreateCuisines() {
  const form = useCuisineForm({ name: '', description: '', status: 0 })
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Cuisines', href: '/app/cuisines' }, { name: 'Add Cuisine' }]} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <Resources.Form title='Add Cuisine' backUrl='/app/cuisines' onSubmit={form.onSubmit.create} processing={form.isProcessing}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Name <sup className='text-red-primary'>*</sup>
              </label>
              <input type="text" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.name} />
            </div>

            <div className="col-span-6 relative">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea onChange={form.input.onChange.description} name="description" id="description" rows={5} className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.description} />
            </div>

            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="image" className="block text-sm font-bold text-gray-700">
                Image <sup className='text-red-primary'>*</sup>
              </label>
              <input type="file" onChange={form.input.onChange.thumbnail} accept={'image/*'} name="image" id="image" className="mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none" />
              <InputError error={form.errors?.thumbnail} />
            </div>

            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                Status <sup className='text-red-primary'>*</sup>
              </label>
              <select id="status" defaultValue={1} onChange={form.input.onChange.status} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={1}>Public</option>
                <option value={0}>Private</option>
              </select>
              <InputError error={form.errors?.status} />
            </div>

          </div>
        </Resources.Form>
      </div>
    </div>
  </>
}
