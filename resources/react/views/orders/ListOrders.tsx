import {DateTime} from "luxon";
import {useEffect} from "react";
import Icons from '~/helpers/icons'
import {Order} from "@/types/models";
import {useDataLoader} from "@/hooks";
import * as Alert from "@/components/alerts";
import Pagination from "@/components/Pagination";
import {PaginatorMeta} from "@/types/paginators";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {ListFilters, ListTable} from "@/components/page";
import {Link, useLocation, useSearchParams} from "react-router-dom";

const columns = [
  {name: 'Order #', options: {className: 'text-center'}},
  {name: 'Date/Time', options: {className: 'text-left'}},
  {name: 'Customer', options: {className: 'text-center'}},
  {name: 'Type', options: {className: 'text-center'}},
  {name: 'Session', options: {className: 'text-center'}},
  {name: 'Created By', options: {className: 'text-center'}},
  {name: 'Total', options: {className: 'text-center'}},
  {name: 'Status', options: {className: 'text-center'}},
]
const sortByFilters = [
  {label: 'ID', value: 'id', icon: <Icons.Outline.Hashtag className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Date', value: 'date', icon: <Icons.Outline.CalendarDays className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Email', value: 'email', icon: <Icons.Outline.Envelope className="h-5 w-5" aria-hidden="true"/>},
]

export default function ListOrders() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const loader = useDataLoader<{ data: Order[], meta: PaginatorMeta }>(`/orders`)

  useEffect(() => {
    loader.sync({params: {page: searchParams.get('page') ?? 1}})
  }, [location, searchParams])

  return <>
    {loader.isProcessed() && <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Orders'}]}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <ListFilters create={{url: '/app/orders/create', label: 'Create Order'}} sortBy={sortByFilters}/>

        <ListTable
          thead={columns}
          tbody={loader.response.data.map((order, index) => ([
            order.id,
            DateTime.fromISO(order.created_at).toLocaleString(DateTime.DATETIME_SHORT),
            (!!order?.user?.id ? <>
              <Link to={`/app/users/${order?.user?.id}`} className={`text-red-primary hover:underline`}>{order?.user?.name}</Link>
            </> : <>
              <span>-</span>
            </>),
            `-`,
            `-`,
            `-`,
            `-`,
            <>
              {order.status === 0 && <span>Placed</span>}
              {order.status === 1 && <span>Confirmed</span>}
              {order.status === 2 && <span>Preparing</span>}
              {order.status === 3 && <span>In-Transit</span>}
              {order.status === 4 && <span>Delivered</span>}
              {order.status === 5 && <span>Canceled</span>}
            </>,
            <div className="flex item-center justify-center gap-x-1">
              <Link to={`/app/users/${order.id}/edit`} className={'hidden bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                <Icons.Outline.PencilSquare className={'w-5 h-5'}/>
              </Link>

              <Link to={`/app/orders/${order.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                <Icons.Outline.Eye className={'w-5 h-5'}/>
              </Link>

              <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                <Icons.Outline.Trash className={'w-5 h-5'}/>
              </button>
            </div>
          ]))}

          empty={(
            <Alert.Warning>
              No orders available.
            </Alert.Warning>
          )}
        />

        <Pagination meta={loader.response.meta}/>
      </div>
    </div>}
  </>
}
