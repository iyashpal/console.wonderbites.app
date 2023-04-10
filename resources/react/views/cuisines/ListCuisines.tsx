import {DateTime} from "luxon";
import {Cuisine} from "@/types/models";
import {useEffect, useState} from "react";
import {useDataLoader, useFlash} from "@/hooks";
import * as Index from "@/components/Index";
import * as Alert from "@/components/alerts";
import TrashModal from "@/components/TrashModal";
import Pagination from "@/components/Pagination";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {TableRowsSkeleton} from "@/components/skeletons";
import ListCuisineSkeleton from "./skeleton/ListCuisineSkeleton";
import {PaginatorMeta} from "@/types/paginators";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {BookmarkIcon, HashtagIcon, LinkIcon, EyeIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";

export default function ListCuisines() {
  const loader = useDataLoader<{data: Cuisine[], meta: PaginatorMeta}>(`/cuisines`)
  const flash = useFlash()
  const location = useLocation()
  const navigateTo = useNavigate()
  const [cuisine, setCuisine] = useState<Cuisine>({} as Cuisine)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const [selected] = useState<number[]>([])

  useEffect(() => {
    loader.sync({params: {page: searchParams.get('page') ?? 1}})
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
          <Breadcrumb pages={[{name: 'Cuisines'}]}/>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">

          {flash.get('cuisine_deleted') && <>
            <Alert.Success className={'mb-6'}>Cuisine deleted successfully</Alert.Success>
          </>}

          <Index.Filters sortBy={[
            {label: 'ID', value: 'id', icon: <HashtagIcon className={'w-5 h-5'}/>},
            {label: 'Name', value: 'name', icon: <BookmarkIcon className={'w-5 h-5'}/>}
          ]} create={{url: '/app/cuisines/create', label: 'Add Cuisine'}}/>

          <Index.Table>
            <Index.THead>
              <Index.Tr>
                <Index.ThCheck checked={false}/>
                <Index.Th>
                  ID
                </Index.Th>
                <Index.Th className={'text-left'}>
                  Cuisine Name
                </Index.Th>
                <Index.Th>
                  Image
                </Index.Th>
                <Index.Th>
                  Status
                </Index.Th>
                <Index.Th>
                  Created On
                </Index.Th>
                <Index.Th>
                  Added By
                </Index.Th>
                <Index.Th className={'w-24'}>
                  Action
                </Index.Th>
              </Index.Tr>
            </Index.THead>

            <Index.TBody>
              {loader.isProcessing() ? <>
                <TableRowsSkeleton columns={[{label: 'ID'}, {label: 'Category Name'}, {label: 'Type'}]} limit={10}/>
              </> : <>
                {loader.response.data.map(cuisine => <Index.Tr key={cuisine.id}>
                  <Index.TdCheck checked={false} onChange={(e) => selected.push(Number(e.target.value ?? 0))} value={1}/>
                  <Index.Td>
                    {cuisine.id}
                  </Index.Td>
                  <Index.Td className={'text-left'}>
                    <Link to={`/app/cuisines/${cuisine.id}`} className={'hover:text-red-primary inline-flex items-center'}>
                      {cuisine.name}
                    </Link>
                  </Index.Td>
                  <Index.Td>
                    <img className={'w-9 h-9 rounded-full mx-auto'} src={cuisine.thumbnail_url} alt={cuisine.name} />
                  </Index.Td>
                  <Index.Td>
                    {cuisine.status === 1 ? <><span className={'text-red-600'}>Active</span></> : 'Inactive'}
                  </Index.Td>
                  <Index.Td className={'uppercase'}>
                    {DateTime.fromISO(cuisine.created_at).toLocaleString(DateTime.DATETIME_SHORT)}
                  </Index.Td>
                  <Index.Td>
                    <Link to={`/app/users/${cuisine.user?.id}`} className={'hover:text-red-primary inline-flex items-center'}>
                      <LinkIcon className={'w-3 h-3 mr-1'}/> {cuisine.user?.name}
                    </Link>
                  </Index.Td>
                  <Index.Td className={'text-center'}>
                    <div className="flex item-center justify-center gap-x-1">
                      <Link to={`/app/cuisines/${cuisine.id}/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                        <PencilSquareIcon className={'w-5 h-5'}/>
                      </Link>

                      <Link to={`/app/cuisines/${cuisine.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                        <EyeIcon className={'w-5 h-5'}/>
                      </Link>
                      <button onClick={() => {
                        setCuisine(cuisine);
                        setIsTrashing(true);
                      }} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                        <TrashIcon className={'w-5 h-5'}/>
                      </button>
                    </div>
                  </Index.Td>
                </Index.Tr>)}
                {loader.response.data.length === 0 && <>
                  <Index.Tr>
                    <Index.Td colSpan={7}>
                      <Alert.Warning>
                        No cuisines available.{' '}
                        <Link to={'/app/cuisines/create'} className="font-medium text-yellow-700 underline hover:text-yellow-600">
                          Click here to add more cuisines.
                        </Link>
                      </Alert.Warning>
                    </Index.Td>
                  </Index.Tr>
                </>}
              </>}
            </Index.TBody>
          </Index.Table>
          <Pagination meta={loader.response.meta}/>
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
      : <ListCuisineSkeleton/>}
  </>
}
