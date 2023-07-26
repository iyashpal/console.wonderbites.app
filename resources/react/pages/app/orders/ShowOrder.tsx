import { DateTime } from "luxon";
import { useDataLoader } from "@/hooks";
import { useEffect, useState } from "react";
import * as Loaders from '~/components/loaders'
import { Link, useParams } from "react-router-dom"
import { Order, Product } from '~/contracts/schema'
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";
import Modal from "@/components/Modal";
import { Select, Textarea } from "@/components/forms";

type OrderProps = { order: Order, products: Product[] }

type OrderNote = {
  comment: string,
  datetime: string,
  status: string,
  username: string
}

export default function ShowOrder() {
  const { id } = useParams() as { id: string }
  const loader = useDataLoader<Order>(`orders/${id}`)
  const [order, setOrder] = useState<Order>({} as Order)
  const [tab, setTab] = useState<'details' | 'status'>('details')
  const [products, setProducts] = useState<Product[]>([] as Product[])


  useEffect(() => {
    setOrder(loader.response)
    setProducts(loader.response.products ?? [])
    return () => {
      setOrder({} as Order)
      setProducts([])
    }
  }, [loader.response])

  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Orders', href: '/app/orders' }, { name: 'Order Details' }]} />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {loader.isProcessed() ? (
            <div className={'bg-white shadow'}>
              <div className={'grid grid-cols-2 bg-gray-300 font-semibold'}>
                <button onClick={() => setTab('details')} className={`py-2 ${tab === 'details' ? 'bg-red-primary text-white' : 'text-black'}`}>Order Details</button>
                <button onClick={() => setTab('status')} className={`py-2 ${tab === 'status' ? 'bg-red-primary text-white' : 'text-black'}`}>Status &amp; Comments</button>
              </div>

              <div className={`p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col`}>
                <div className={'mb-3 sm:mb-4 md:mb-5 lg:mb-6'}>
                  <h3 className={'font-semibold text-lg'}>Order {`#${order.id}`}</h3>
                  <div className={'pt-3'}>
                    <span className={'uppercase font-semibold text-sm bg-red-primary rounded-full px-3 py-1 text-white'}>{order.status}</span>
                  </div>
                </div>
                {tab === 'details' ? (
                  <Details order={order} products={products} />
                ) : (
                  <Status order={order} products={products} />
                )}
              </div>
            </div>
          ) : (
            <div className={'bg-white shadow p-10 flex items-center justify-center'}>
              <Loaders.Circle className={`animate-spin w-8 h-8 text-red-primary`} />
            </div>
          )}
        </div>
      </div>
    </div>
  </>
}

function Details({ order, products }: OrderProps) {
  return <>
    <div className={'border p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7'}>
      <h4 className={'font-semibold mb-3 md:mb-4'}>Order Details</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="" className={'font-bold text-sm'}>Customer Name</label>
          <div className={'text-gray-600'}>
            {order.user_id ? (
              <Link className={'text-red-primary underline'} to={`/app/users/${order.user_id}`}>
                {[order.first_name, order.last_name].join(' ')}
              </Link>
            ) : (
              [order.first_name, order.last_name].join(' ')
            )}
          </div>
        </div>
        <div>
          <label htmlFor="" className={'font-bold text-sm'}>Date Placed</label>
          <div className={'text-gray-600'}>{DateTime.fromISO(order.created_at).toLocaleString(DateTime.DATETIME_MED)}</div>
        </div>
        <div>
          <label htmlFor="" className={'font-bold text-sm'}>Email</label>
          <div className={'text-gray-600'}>{order.email}</div>
        </div>
        <div>
          <label htmlFor="" className={'font-bold text-sm'}>Channel</label>
          <div className={'text-gray-600'}>{order.channel || '-'}</div>
        </div>
        <div>
          <label htmlFor="" className={'font-bold text-sm'}>Type</label>
          <div className={'text-gray-600'}>{order.order_type}</div>
        </div>
        <div>
          <label htmlFor="" className={'font-bold text-sm'}>Payment Method</label>
          <div className={'text-gray-600'}>{order.payment_mode === 'COD' ? 'Cash On Delivery' : order.payment_mode}</div>
        </div>
        <div>
          <label htmlFor="" className={'font-bold text-sm'}>Address</label>
          <div className={'text-gray-600'}>{[order.street, order.city].filter(f => f).join(', ')}</div>
        </div>
      </div>
    </div>

    <div className="border p-3 sm:p-4 md:p-5 lg:p-6 mt-3 sm:mt-4 md:mt-5 lg:pt-6">
      <h4 className={'font-semibold mb-3 md:mb-4'}>Order</h4>
      <div className="">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="uppercase py-3 bg-gray-100 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                Product #
              </th>
              <th scope="col" className="uppercase py-3 bg-gray-100 px-3 text-left text-sm font-semibold text-gray-900">
                Product Name
              </th>
              <th scope="col" className="uppercase py-3 bg-gray-100 px-3 text-center text-sm font-semibold text-gray-900">
                Quantity
              </th>
              <th scope="col" className="uppercase py-3 bg-gray-100 px-3 text-left text-sm font-semibold text-gray-900">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {order.data?.map((dataProduct, index) => {
              const product = products.find(({ id }) => id === dataProduct.id) as Product
              return (
                <tr key={index} className="even:bg-gray-50">
                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-3">
                    <Link to={`/app/products/${dataProduct.id}`} className="text-red-600 hover:underline">{dataProduct.id}</Link>
                  </td>
                  <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500">
                    {product?.name}
                  </td>
                  <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500 text-center">
                    {dataProduct.quantity}
                  </td>
                  <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500">
                    {product?.price}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  </>
}

function Status({ order, products }: OrderProps) {
  const [showAddNote, setShowAddNote] = useState(false)
  const [notes, setNotes] = useState<OrderNote[]>([{
    username: 'username',
    comment: order.note ?? '-',
    datetime: DateTime.fromISO(order.created_at).toLocaleString(),
    status: order.status
  }])
  function onSubmit(data) {
    console.log(data)
    setNotes([...notes, { ...data }])
  }
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" className="uppercase py-3 bg-gray-100 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
              Date Added
            </th>
            <th scope="col" className="uppercase py-3 bg-gray-100 px-3 text-left text-sm font-semibold text-gray-900">
              Notes
            </th>
            <th scope="col" className="uppercase py-3 bg-gray-100 px-3 text-left text-sm font-semibold text-gray-900">
              Made By
            </th>
            <th scope="col" className="uppercase py-3 bg-gray-100 px-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="uppercase py-3 bg-gray-100 px-3 text-left text-sm font-semibold text-gray-900">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {notes.map((note, index) => {
            return (
              <tr key={index} className="even:bg-gray-50">
                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-3">
                  {note.datetime}
                </td>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500">
                  {note.comment}
                </td>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500">
                  {note.username}
                </td>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500 capitalize">
                  {note.status}
                </td>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500">

                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex items-center py-8">
        <button onClick={() => setShowAddNote(!showAddNote)} className="bg-red-primary rounded-md shadow-md shadow-red-800  py-1.5 px-5 text-white text-sm font-semibold">
          Add Note
        </button>
      </div>

      <AddNoteModal show={showAddNote} onClose={() => setShowAddNote(false)} onSubmit={onSubmit} />
    </div>
  )
}


function AddNoteModal({ show, onClose, onSubmit }: { show: boolean, onClose: () => void, onSubmit: (data: OrderNote) => void }) {
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('Paid')

  function handle() {
    onSubmit({
      username: 'username',
      datetime: DateTime.now().toLocaleString(),
      comment: comment,
      status: status,
    })

    setComment('')
    setStatus('Paid')

    onClose()
  }
  return (
    <Modal show={show} onClose={onClose} className="max-w-xl">
      <div className="divide-y divide-gray-200 overflow-hidden bg-white">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Order Note</h3>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>

        <div className="px-4 py-5 sm:p-6 space-y-2">
          <div>
            <label htmlFor="">Comment</label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full" rows={3}></Textarea>
          </div>
          <div>
            <label htmlFor="">Status</label>
            <Select value={comment} onChange={(e) => setStatus(e.target.value)} className="w-full">
              <option disabled>Placed</option>
              <option>Paid</option>
              <option>Delivered</option>
              <option>Delivering</option>
            </Select>
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6 flex items-center justify-end">
          <button onClick={handle} type="button" className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}
