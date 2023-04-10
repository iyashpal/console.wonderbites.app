import {DateTime} from "luxon";
import * as Index from "@/components/Index";
import * as Alert from "@/components/alerts";
import Pagination from "@/components/Pagination";
import IndexFilters from "@/components/IndexFilters";
import {Link, useLocation, useSearchParams} from "react-router-dom";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import { CalendarDaysIcon, EnvelopeIcon, EyeIcon, HashtagIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {useDataLoader} from "@/hooks";
import {useEffect} from "react";
import {Order} from "@/types/models";
import {PaginatorMeta} from "@/types/paginators";

const sortByFilters = [
  {label: 'ID', value: 'id', icon: <HashtagIcon className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Date', value: 'date', icon: <CalendarDaysIcon className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Email', value: 'email', icon: <EnvelopeIcon className="h-5 w-5" aria-hidden="true"/>},
]

export default function ListOrders() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const loader = useDataLoader<{data: Order[], meta: PaginatorMeta}>(`/orders`)

  useEffect(() => {
    loader.sync({params: {page: searchParams.get('page') ?? 1}})
  }, [location, searchParams])

  return <>
    {loader.isProcessed() && <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Orders'}]}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <IndexFilters create={{url: '/app/orders/create', label: 'Create Order'}} sortBy={sortByFilters}/>
        <Index.Table>
          <Index.THead>
            <Index.Tr className={'shadow-inner'}>
              <Index.ThCheck checked={false}/>
              <Index.Th className={'text-left'}>
                Order #
              </Index.Th>
              <Index.Th className={'text-left'}>
                Date/Time
              </Index.Th>
              <Index.Th className={'text-left'}>
                Customer
              </Index.Th>
              <Index.Th className={'text-left'}>
                Type
              </Index.Th>
              <Index.Th className={'text-left'}>
                Session
              </Index.Th>
              <Index.Th  className={'text-left'}>
                Created By
              </Index.Th>
              <Index.Th  className={'text-left'}>
                Total
              </Index.Th>
              <Index.Th className={'text-left'}>
                Status
              </Index.Th>
              <Index.Th className={'w-24'}>
                Action
              </Index.Th>
            </Index.Tr>
          </Index.THead>

          <Index.TBody>
            {loader.response.data.map((order, index) => (
              <Index.Tr key={index}>
                <Index.TdCheck/>
                <Index.Td className={''}>{order.id}</Index.Td>
                <Index.Td>
                  {DateTime.fromISO(order.created_at).toLocaleString(DateTime.DATETIME_SHORT)}
                </Index.Td>
                <Index.Td>
                  {(!!order?.user?.id ? <>
                    <Link to={`/app/users/${order?.user?.id}`} className={`text-red-primary hover:underline`}>{order?.user?.name}</Link>
                  </> : <>
                    <span>-</span>
                  </>)}
                </Index.Td>
                <Index.Td>-</Index.Td>
                <Index.Td>-</Index.Td>
                <Index.Td>-</Index.Td>
                <Index.Td>-</Index.Td>
                <Index.Td className={`uppercase text-xs font-semibold`}>
                  {order.status === 0 && <span>Placed</span>}
                  {order.status === 1 && <span>Confirmed</span>}
                  {order.status === 2 && <span>Preparing</span>}
                  {order.status === 3 && <span>In-Transit</span>}
                  {order.status === 4 && <span>Delivered</span>}
                  {order.status === 5 && <span>Canceled</span>}
                </Index.Td>
                <Index.Td>
                  <div className="flex item-center justify-center gap-x-1">
                    <Link to={`/app/users/${order.id}/edit`} className={'hidden bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                      <PencilSquareIcon className={'w-5 h-5'} />
                    </Link>

                    <Link to={`/app/orders/${order.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                      <EyeIcon className={'w-5 h-5'} />
                    </Link>

                    <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                      <TrashIcon className={'w-5 h-5'} />
                    </button>
                  </div>
                </Index.Td>
              </Index.Tr>
            ))}

            {loader.response.data.length === 0 && <>
              <Index.Tr>
                <Index.Td colSpan={10}>
                  <Alert.Warning>
                    No orders available.
                  </Alert.Warning>
                </Index.Td>
              </Index.Tr>
            </>}
          </Index.TBody>
        </Index.Table>

        <Pagination meta={loader.response.meta} />
      </div>
    </div>}

  </>
}
