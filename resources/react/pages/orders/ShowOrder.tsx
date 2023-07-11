import { DateTime } from "luxon";
import { useDataLoader } from "@/hooks";
import { Order, Product } from '~/contracts/schema'
import { useEffect, useState } from "react";
import * as Loaders from '~/components/loaders'
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";

export default function ShowOrder() {
  const { id } = useParams() as { id: string }
  const [order, setOrder] = useState<Order>({} as Order)
  const [products, setProducts] = useState<Product[]>([] as Product[])

  const loader = useDataLoader<Order>(`orders/${id}`)

  useEffect(() => {
    console.log(loader.response)
    setOrder(loader.response)
    return () => {
      setOrder({} as Order)
    }
  }, [loader])

  useEffect(() => {
    setProducts(loader.response.products ?? [])
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
                <button className={'py-2 bg-red-primary text-white'}>Order Details</button>
                <button className={'py-2 text-black'}>Status &amp; Comments</button>
              </div>

              <div className={`p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col`}>
                <div className={'mb-3 sm:mb-4 md:mb-5 lg:mb-6'}>
                  <h3 className={'font-semibold text-lg'}>Order {`#${order.id}`}</h3>
                  <div className={'pt-3'}>
                    <span className={'uppercase font-semibold text-sm bg-red-primary rounded-full px-3 py-1 text-white'}>{order.status}</span>
                  </div>
                </div>

                <div className={'border p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7'}>
                  <h4 className={'font-semibold mb-3 md:mb-4'}>Order Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="" className={'font-bold text-sm'}>Customer Name</label>
                      <div className={'text-gray-600'}>
                        {order.user_id ? (<Link className={'text-red-primary underline'} to={`/app/users/${order.user_id}`}>{[order.first_name, order.last_name].join(' ')}</Link>) : [order.first_name, order.last_name].join(' ')}
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
                          <th scope="col" className="uppercase py-3 bg-gray-100 px-3 text-left text-sm font-semibold text-gray-900">
                            Quantity
                          </th>
                          <th scope="col" className="uppercase py-3 bg-gray-100 px-3 text-left text-sm font-semibold text-gray-900">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {loader.response.data?.map((dataProduct, index) => {
                          const product = products.find(({ id }) => id === dataProduct.id) as Product
                          return (
                            <tr key={index} className="even:bg-gray-50">
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-3">
                                <Link to={`/app/products/${dataProduct.id}`} className="text-red-600 hover:underline">{dataProduct.id}</Link>
                              </td>
                              <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500">
                                {product?.name}
                              </td>
                              <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500">
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
