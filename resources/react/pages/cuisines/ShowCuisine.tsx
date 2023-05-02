import { DateTime } from 'luxon'
import { useFlash } from '@/hooks'
import { useEffect, useState } from 'react'
import * as Alert from '@/components/alerts'
import TrashModal from '@/components/TrashModal'
import { ShowCuisineSkeleton } from './skeleton'
import { Category, Cuisine } from '~/contracts/schema'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import CuisineCategories from './Partials/CuisineCategories'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function ShowCuisine() {
  const { cuisine, categories } = useLoaderData() as {cuisine: Cuisine, categories: Category[]}
  const flash = useFlash()
  const navigateTo = useNavigate()
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  useEffect(() => {
    setIsLoaded(cuisine.id !== undefined)
  }, [cuisine])

  function onDeleteCuisine() {
    flash.set('cuisine_deleted', true)
    navigateTo('/app/cuisines')
  }

  function onCloseTrash() {
    setIsTrashing(false)
  }

  return <>
    {isLoaded ? <>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{ name: 'Cuisines', href: '/app/cuisines' }, { name: 'Cuisine Detail' }]} />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          {flash.get('cuisine_created') && <>
            <Alert.Success className={'mt-4'}>Cuisine created successfully.</Alert.Success>
          </>}

          {flash.get('cuisine_updated') && <>
            <Alert.Success className={'mt-4'}>Cuisine updated successfully.</Alert.Success>
          </>}

          {flash.get('cuisine_category_attached') && <>
            <Alert.Success className={'mt-4'}>Cuisine category added successfully.</Alert.Success>
          </>}
          {flash.get('cuisine_category_deleted') && <>
            <Alert.Success className={'mt-4'}>Cuisine category deleted successfully.</Alert.Success>
          </>}
          <div className="py-4">
            <div className="shadow px-4 pt-4 sm:px-6 sm:pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-xl">{cuisine.name}</span>
                </div>
                <div className="text-sm">
                  <p>Created on: {DateTime.fromISO(cuisine.created_at).toLocaleString(DateTime.DATE_MED)}</p>
                  <p>By: {cuisine.user?.name || 'Unknown'}</p>
                </div>
              </div>
              <div>
                <p className={'font-medium text-sm mb-3'}>Cuisine Details</p>
                <div className={'-mx-4 sm:-mx-6 overflow-x-auto'}>
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
                            {cuisine.name}
                          </span>
                        </td>
                        <td className={'text-left px-4 sm:px-6 py-2 whitespace-nowrap'}>
                          {cuisine.id}
                        </td>
                        <td className={'text-left px-4 sm:px-6 py-2 whitespace-nowrap'}>
                          <div className={''}>
                            <img src={cuisine.thumbnail_url} alt={cuisine.name} className={'w-10 h-10 rounded-full object-cover shadow border-2 border-gray-300'}/>
                          </div>
                        </td>
                        <td className={'text-left px-4 sm:px-6 py-2'}>
                          {cuisine.description}
                        </td>

                        <td className={'text-left px-4 sm:px-6 py-2 whitespace-nowrap'}>
                          <span className={'font-bold'}>
                            {cuisine.status === 1 ? <><span className={'text-red-primary'}>Active</span></> : 'Inactive'}
                          </span>
                        </td>
                        <td className={'text-center px-4 sm:px-6 py-2 whitespace-nowrap'}>
                          <div className="flex item-center justify-center gap-x-1">
                            <Link to={`/app/cuisines/${cuisine.id}/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                              <PencilSquareIcon className={'w-5 h-5'} />
                            </Link>
                            <button onClick={() => setIsTrashing(true)} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                              <TrashIcon className={'w-5 h-5'} />
                            </button>
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

      <div className="pb-6">
        <CuisineCategories cuisine={cuisine} categories={categories} />
      </div>

      <TrashModal
        show={isTrashing}
        onClose={onCloseTrash}
        onDelete={onDeleteCuisine}
        title={'Delete Cuisine'}
        url={`/cuisines/${cuisine.id}`}
        description={<>Are you sure you want to delete "<b>{cuisine.name}</b>" cuisine?</>}
      />
    </> : <ShowCuisineSkeleton />}

  </>
}
