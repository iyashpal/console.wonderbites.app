import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {Link} from "react-router-dom";
import IndexFilters from "@/components/IndexFilters";
import * as Index from "@/components/Index";
import { CalendarDaysIcon, EnvelopeIcon, EyeIcon, HashtagIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import * as Alert from "@/components/alerts";
// import Pagination from "@/components/Pagination";

const sortByFilters = [
  {label: 'ID', value: 'id', icon: <HashtagIcon className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Date', value: 'date', icon: <CalendarDaysIcon className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Email', value: 'email', icon: <EnvelopeIcon className="h-5 w-5" aria-hidden="true"/>},
]

export default function ListOrders() {
  const users = []
  return <>
    <div className="py-6">
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
            {users.map((user, index) => (
              <Index.Tr key={index}>
                <Index.TdCheck/>
                <Index.Td className={"inline-flex items-center gap-x-1"}>

                </Index.Td>
                <Index.Td>

                </Index.Td>
                <Index.Td>
                </Index.Td>
                <Index.Td>
                </Index.Td>
                <Index.Td className={`uppercase text-xs font-semibold`}>
                </Index.Td>
                <Index.Td>
                  <div className="flex item-center justify-center gap-x-1">
                    <Link to={`/app/users/0/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                      <PencilSquareIcon className={'w-5 h-5'} />
                    </Link>

                    <Link to={`/app/users/0`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                      <EyeIcon className={'w-5 h-5'} />
                    </Link>

                    <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                      <TrashIcon className={'w-5 h-5'} />
                    </button>
                  </div>
                </Index.Td>
              </Index.Tr>
            ))}

            {users.length === 0 && <>
              <Index.Tr>
                <Index.Td colSpan={7}>
                  <Alert.Warning>
                    No orders available.
                  </Alert.Warning>
                </Index.Td>
              </Index.Tr>
            </>}
          </Index.TBody>
        </Index.Table>

        {/*<Pagination meta={meta} />*/}
      </div>
    </div>
  </>
}
