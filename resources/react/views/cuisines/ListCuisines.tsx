import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {useFetch} from "@/hooks";
import {Link, useLocation, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Cuisine} from "@/types/models";
import {CuisinesPaginator, PaginatorMeta} from "@/types/paginators";
import * as Index from "@/components/Index";
import {DateTime} from "luxon";
import * as Alert from "@/components/alerts";
import Pagination from "@/components/Pagination";
import {TableRowsSkeleton} from "@/components/skeletons";
import {BookmarkIcon, HashtagIcon, LinkIcon, EyeIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import ListCuisineSkeleton from "./skeleton/ListCuisineSkeleton";

export default function ListCuisines() {
  const fetcher = useFetch()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [cuisines, setCuisines] = useState<Cuisine[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [meta, setMeta] = useState<PaginatorMeta>({} as PaginatorMeta)
  const [selected] = useState<number[]>([])

  useEffect(() => {
    fetchCuisines()
  }, [location])

  function fetchCuisines(): void {
    setIsLoading(true)
    fetcher.get('/cuisines', {params: {page: searchParams.get('page') ?? 1}})
      .then(({data: response}: { data: CuisinesPaginator }) => {
        setIsLoading(false)
        setIsLoaded(true)
        setCuisines(response.data)
        setMeta(response.meta)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  return <>
    {isLoaded ?
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Cuisines'}]}/>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">
          <Index.Filters sortBy={[
            {label: 'ID', value: 'id', icon: <HashtagIcon className={'w-5 h-5'}/>},
            {label: 'Name', value: 'name', icon: <BookmarkIcon className={'w-5 h-5'}/>}
          ]} create={{url: '/app/cuisines/create', label: 'Add Cuisine'}}/>

          <Index.Table>
            <Index.THead>
              <Index.Tr>
                <Index.ThCheck isChecked={false}/>
                <Index.Th>
                  ID
                </Index.Th>
                <Index.Th className={'text-left'}>
                  Cuisine Name
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
              {isLoading ? <>
                <TableRowsSkeleton columns={[{label: 'ID'}, {label: 'Category Name'}, {label: 'Type'}]} limit={10}/>
              </> : <>
                {cuisines.map(cuisine => <Index.Tr key={cuisine.id}>
                  <Index.TdCheck isChecked={false} onChange={(e) => selected.push(Number(e.target.value ?? 0))} value={1}/>
                  <Index.Td>
                    {cuisine.id}
                  </Index.Td>
                  <Index.Td className={'text-left'}>
                    <Link to={`/app/cuisines/${cuisine.id}`} className={'hover:text-red-primary inline-flex items-center'}>
                      <LinkIcon className={'w-3 h-3 mr-1'}/> {cuisine.name}
                    </Link>
                  </Index.Td>
                  <Index.Td>
                    {cuisine.status === 1 ? <><span className={'text-red-600'}>Active</span></> : 'Inactive'}
                  </Index.Td>
                  <Index.Td className={'uppercase'}>
                    {DateTime.fromISO(cuisine.created_at).toLocaleString(DateTime.DATETIME_SHORT)}
                  </Index.Td>
                  <Index.Td>
                    <Link to={`/app/users/${cuisine.user?.id}`} className={'hover:text-red-primary inline-flex items-center'}>
                      <LinkIcon className={'w-3 h-3 mr-1'}/> {cuisine.user?.fullname}
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
                      <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                        <TrashIcon className={'w-5 h-5'}/>
                      </button>
                    </div>
                  </Index.Td>
                </Index.Tr>)}
                {cuisines.length === 0 && <>
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
          <Pagination meta={meta}/>
        </div>
      </div>
      : <ListCuisineSkeleton/>}
  </>
}
