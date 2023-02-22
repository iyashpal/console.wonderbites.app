import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {useFetch} from "@/hooks";
import {Link, useLocation, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Cuisine} from "@/types/models";
import { CuisinesPaginator, PaginatorMeta} from "@/types/paginators";
import * as Index from "@/components/Index";
import {DateTime} from "luxon";
import {className} from "@/helpers";
import * as Alert from "@/components/alerts";
import Pagination from "@/components/Pagination";
import {ListPageSkeleton, TableRowsSkeleton} from "@/components/skeletons";
import {BookmarkIcon, EllipsisVerticalIcon, HashtagIcon, LinkIcon} from "@heroicons/react/24/outline";

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
                <Index.Th>
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
                    <Link to={`/app/cuisines/${cuisine.id}/edit`} className={'hover:text-red-primary inline-flex items-center'}>
                      <LinkIcon className={'w-3 h-3 mr-1'}/> {cuisine.name}
                    </Link>
                  </Index.Td>
                  <Index.Td>
                    {cuisine.status === 1 ? <><span className={'text-red-600'}>Active</span></> : 'Inactive'}
                  </Index.Td>
                  <Index.Td>
                    {DateTime.fromISO(cuisine.created_at).toLocaleString(DateTime.DATE_MED)}
                  </Index.Td>
                  <Index.Td>
                    <Link to={`/app/users/${cuisine.user?.id}`} className={'hover:text-red-primary inline-flex items-center'}>
                      <LinkIcon className={'w-3 h-3 mr-1'}/> {cuisine.user?.fullname}
                    </Link>
                  </Index.Td>
                  <Index.Td className={'text-center'}>
                    <button>
                      <EllipsisVerticalIcon {...className('h-5 w-5')} />
                    </button>
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
      : <ListPageSkeleton columns={[
        {label: 'ID'},
        {label: 'Cuisine Name'},
        {label: 'Status', align: 'center'},
        {label: 'Created On', align: 'center'},
        {label: 'Added By'}
      ]} limit={10}/>}
  </>
}
