import { useFlash } from '@/hooks'
import { Details } from '@/components/Show'
import { useEffect, useState } from 'react'
import * as Alert from '@/components/alerts'
import TrashModal from '@/components/TrashModal'
import { ShowCuisineSkeleton } from './skeleton'
import { Category, Cuisine } from '~/contracts/schema'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import CuisineCategories from './Partials/CuisineCategories'
import { useLoaderData, useNavigate } from 'react-router-dom'

export default function ShowCuisine() {
  const { cuisine, categories } = useLoaderData() as { cuisine: Cuisine, categories: Category[] }
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
            <Details
              module="Cuisine"
              title={cuisine.name}
              by={cuisine.user?.name ?? ''}
              date={cuisine.created_at}
              onTrash={() => setIsTrashing(true)}
              onEdit={() => navigateTo(`/app/banners/${cuisine.id}/edit`)}
              fields={[
                { name: 'ID', value: cuisine.id },
                { name: 'Name', value: cuisine.name },
                { name: 'Image', value: <img alt={cuisine.name} src={cuisine.thumbnail_url} className="w-10 h-10 rounded-full object-cover shadow border-2 border-gray-300" /> },
                { name: 'Description', value: cuisine.description, onModal: true },
                { name: 'Status', value: cuisine.status === 1 ? <><span className={'text-red-primary'}>Active</span></> : 'Inactive' },
              ]}
            />
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
