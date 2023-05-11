import { DateTime } from "luxon";
import Icons from '~/helpers/icons'
import { Cuisine } from "~/contracts/schema";
import { useEffect, useState } from "react";
import * as Alert from "@/components/alerts";
import { useDataLoader, useFlash } from "@/hooks";
import TrashModal from "@/components/TrashModal";
import { MetaData } from "@/contracts/pagination";
import Resources from "@/components/resources";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import ListCuisineSkeleton from "./skeleton/ListCuisineSkeleton";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

const columns = [
  { name: 'ID', options: { className: 'text-center' } },
  { name: 'Cuisine Name', options: { className: 'text-left' } },
  { name: 'Image', options: { className: 'text-center' } },
  { name: 'Status', options: { className: 'text-center' } },
  { name: 'Created On', options: { className: 'text-center' } },
  { name: 'Added By', options: { className: 'text-center' } },
]
const sortByFilters = [
  { label: 'ID', value: 'id' },
  { label: 'Name', value: 'name' }
]
export default function ListCuisines() {
  const loader = useDataLoader<{ data: Cuisine[], meta: MetaData }>(`/cuisines`)
  const flash = useFlash()
  const location = useLocation()
  const navigateTo = useNavigate()
  const [cuisine, setCuisine] = useState<Cuisine>({} as Cuisine)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    loader.sync({ params: { page: searchParams.get('page') ?? 1 } })
  }, [location, searchParams])


  function onDeleteCuisine() {
    setIsTrashing(false)
    flash.set('cuisine_deleted', true)
    navigateTo('/app/cuisines')
  }

  function onCloseTrash() {
    setIsTrashing(false)
    setCuisine({} as Cuisine)
  }

  return <>
    {loader.isProcessed() ?
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{ name: 'Cuisines' }]} />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">

          {flash.get('cuisine_deleted') && <>
            <Alert.Success className={'mb-6'}>Cuisine deleted successfully</Alert.Success>
          </>}

          <Resources.List
            columns={columns}
            sorting={sortByFilters}
            data={loader.response.data}
            metadata={loader.response.meta}
            createLink={{ label: 'Add Cuisine', href: '/app/cuisines/create' }}
          >
            {({ data }) => data.map(cuisine => ([
              cuisine.id,
              <Link to={`/app/cuisines/${cuisine.id}`} className={'hover:text-red-primary inline-flex items-center'}>
                {cuisine.name}
              </Link>,
              <img className={'w-9 h-9 rounded-full mx-auto object-cover'} src={cuisine.thumbnail_url} alt={cuisine.name} />,
              cuisine.status === 1 ? <><span className={'text-red-600'}>Active</span></> : 'Inactive',
              DateTime.fromISO(cuisine.created_at).toLocaleString(DateTime.DATETIME_SHORT),
              <Link to={`/app/users/${cuisine.user?.id}`} className={'hover:text-red-primary inline-flex items-center'}>
                <Icons.Outline.Link className={'w-3 h-3 mr-1'} /> {cuisine.user?.name}
              </Link>,
              <div className="flex item-center justify-center gap-x-1">
                <Link to={`/app/cuisines/${cuisine.id}/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                  <Icons.Outline.PencilSquare className={'w-5 h-5'} />
                </Link>

                <Link to={`/app/cuisines/${cuisine.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                  <Icons.Outline.Eye className={'w-5 h-5'} />
                </Link>
                <button onClick={() => {
                  setCuisine(cuisine);
                  setIsTrashing(true);
                }} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                  <Icons.Outline.Trash className={'w-5 h-5'} />
                </button>
              </div>
            ]))}
          </Resources.List>
        </div>
        <TrashModal
          show={isTrashing}
          url={`/cuisines/${cuisine.id}`}
          title={'Delete'}
          description={<>Are you sure you want to delete "<b>{cuisine.name}</b>"?</>}
          onClose={onCloseTrash}
          onDelete={onDeleteCuisine}
        />
      </div>
      : <ListCuisineSkeleton />}
  </>
}
