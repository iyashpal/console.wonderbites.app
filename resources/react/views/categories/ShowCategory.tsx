import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import * as Alert from "@/components/alerts";
import {DateTime} from "luxon";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import TrashModal from "@/components/TrashModal";
import {useFlash} from "@/hooks";
import {useState} from "react";
import {Category} from "@/types/models";

export default function ShowCategory() {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  const {category} = useLoaderData() as { category: Category }
  function onDelete() {
    flash.set('category_deleted', true)
    navigateTo('/app/categories')
  }

  function onCloseTrash() {
    setIsTrashing(false)
  }
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Categories', href: '/app/Categories'}, {name: 'Category Detail'}]}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {flash.get('category_created') && <>
          <Alert.Success className={'mt-4'}>Category created successfully.</Alert.Success>
        </>}

        {flash.get('category_updated') && <>
          <Alert.Success className={'mt-4'}>Category updated successfully.</Alert.Success>
        </>}
        <div className="py-4">
          <div className="shadow px-4 pt-4 sm:px-6 sm:pt-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-xl">{category.name}</span>
              </div>
              <div className="text-sm">
                <p>Created on: {DateTime.fromISO(category.created_at).toLocaleString(DateTime.DATE_MED)}</p>
                {/*<p>By: {category.user?.fullname || 'Unknown'}</p>*/}
              </div>
            </div>
            <div>
              <p className={'font-medium text-sm mb-3'}>Category Details</p>
              <div className={'-mx-4 sm:-mx-6 overflow-x-auto'}>
                <table className={'table-auto w-full'}>
                  <thead>
                  <tr>
                    <th className={'text-left px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>Name</th>
                    <th className={'text-left px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>ID</th>
                    <th className={'text-left px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>Description</th>
                    <th className={'text-left px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>Status</th>
                    <th className={'text-center px-4 sm:px-6 py-2 bg-gray-50 border-y border-gray-300 uppercase text-sm'}>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td className={'text-left px-4 sm:px-6 py-2 whitespace-nowrap'}>
                      <span className={'text-red-primary font-bold'}>
                        {category.name}
                      </span>
                    </td>
                    <td className={'text-left px-4 sm:px-6 py-2 whitespace-nowrap'}>
                      {category.id}
                    </td>
                    <td className={'text-left px-4 sm:px-6 py-2'}>
                      {category.description}
                    </td>

                    <td className={'text-left px-4 sm:px-6 py-2 whitespace-nowrap'}>
                      <span className={'font-bold'}>
                        {category.status === 1 ? <><span className={'text-red-primary'}>Active</span></> : 'Inactive'}
                      </span>
                    </td>
                    <td className={'text-center px-4 sm:px-6 py-2 whitespace-nowrap'}>
                      <div className="flex item-center justify-center gap-x-1">
                        <Link to={`/app/categories/${category.id}/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                          <PencilSquareIcon className={'w-5 h-5'}/>
                        </Link>
                        <button onClick={() => setIsTrashing(true)} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                          <TrashIcon className={'w-5 h-5'}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <TrashModal
            show={isTrashing}
            onDelete={onDelete}
            onClose={onCloseTrash}
            title={'Delete Category'}
            url={`/categories/${category.id}`}
            description={<>Are you sure you want to delete "<b>{category.name}</b>" category?</>}
          />
        </div>
      </div>
    </div>
  </>
}
