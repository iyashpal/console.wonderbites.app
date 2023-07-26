import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import Icons from '~/helpers/icons'
import { Order } from "~/contracts/schema";
import { useDataLoader, useForm } from "@/hooks";
import { MetaData } from "@/contracts/pagination";
import Resources from "@/components/resources";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Select } from "@/components/forms";

const columns = [
  { name: 'Order #', options: { className: 'text-center whitespace-nowrap' } },
  { name: 'Date/Time', options: { className: 'text-left' } },
  { name: 'Customer', options: { className: 'text-left' } },
  { name: 'Type', options: { className: 'text-left' } },
  { name: 'Total', options: { className: 'text-center' } },
  { name: 'Address', options: { className: 'text-left' } },
  { name: 'Status', options: { className: 'text-left w-44' } },
]
const sortByFilters = [
  { label: 'ID', value: 'id' },
  { label: 'Date', value: 'date' },
  { label: 'Email', value: 'email' },
]

export default function ListOrders() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const loader = useDataLoader<{ data: Order[], meta: MetaData }>(`/orders`)

  useEffect(() => {
    loader.sync({ params: { page: searchParams.get('page') ?? 1 } })
  }, [location, searchParams])

  return <>
    {loader.isProcessed() && <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Orders' }]} />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <Resources.List
          columns={columns}
          sorting={sortByFilters}
          data={loader.response.data}
          metadata={loader.response.meta}
          createLink={{ label: 'Create Order', href: '/app/orders/create' }}
        >
          {({ data }) => data.map((order) => ([
            order.id,
            DateTime.fromISO(order.created_at).toLocaleString(DateTime.DATETIME_SHORT),
            (!!order?.user?.id ? <>
              <Link to={`/app/users/${order?.user?.id}`} className={`text-red-primary hover:underline`}>{order?.user?.name}</Link>
            </> : <>
              <span>-</span>
            </>),
            <span className="uppercase">{order.order_type}</span>,
            `-`,
            [order.street, '', order.city].filter(item => item).join(', '),
            <Status order={order} />,
            <div className="flex item-center justify-center gap-x-1">
              <Link to={`/app/orders/${order.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                <Icons.Outline.Eye className={'w-5 h-5'} />
              </Link>
            </div>
          ]))}
        </Resources.List>
      </div>
    </div>}
  </>
}

function Status({ order }: { order: Order }) {
  const [state, setState] = useState(order.status)
  const form = useForm({ status: order.status })

  const items = {
    placed: 'Placed',
    cancelled: order.status === 'cancelled' ? 'Cancelled' : 'Cancel',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    'in-transit': 'Out For Delivery',
    delivered: 'Delivered',
  }

  function is(status) {
    return state === status;
  }

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    form.put(`/orders/${order.id}`, { data: { status: e.target.value } }).then(() => {
      setState(e.target.value)
    })
  }

  return (
    <Select disabled={['delivered', 'cancelled'].includes(state)} defaultValue={state} onChange={onChange}>
      {Object.keys(items).map((key, index) => (
        <option key={index} value={key} disabled={is(key)} className={`${is(key) ? 'text-red-primary' : ''}`}>
          {items[key]}
        </option>
      ))}
    </Select>
  )
}
