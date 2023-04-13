import {useEffect} from "react";
import {useDataLoader} from "@/hooks";
import {Banner} from "@/types/models";
import {Link} from "react-router-dom";
import {PaginatorMeta} from "@/types/paginators";
import ListTable from "@/components/page/ListTable";
import ListFilters from "@/components/page/ListFilters";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {BookmarkIcon, EyeIcon, HashtagIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import Pagination from "@/components/Pagination";

export default function ListBanners() {
  const loader = useDataLoader<{ data: Banner[], meta: PaginatorMeta }>(`/banners`)

  const columns = {
    id: {name: 'id', options: {className: 'text-center'}},
    product_name: {name: 'Name', options: {className: 'text-left'}},
    description: {name: 'Group', options: {className: 'text-left'}},
    sku: {name: 'Type', options: {className: 'text-left'}},
    updated_at: {name: 'Update Date', options: {className: 'text-left'}},
    status: {name: 'status', options: {className: 'text-left'}},
  }

  useEffect(() => {
    console.log(loader.response)
  }, [])

  if (loader.isProcessed()) {
    return <>

      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Banners'}]}/>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">
          <div className={``}>

            <ListFilters
              sortBy={[
                {label: 'ID', value: 'id', icon: <HashtagIcon className={'w-5 h-5'}/>},
                {label: 'Name', value: 'name', icon: <BookmarkIcon className={'w-5 h-5'}/>}
              ]}
              create={{url: '/app/banners/create', label: 'Add Banner'}}
            />

            <ListTable
              thead={Object.values(columns)}
              tbody={loader.response.data.map(banner => {
                return [
                  banner.id,
                  banner.title,
                  banner.id,
                  banner.id,
                  banner.updated_at,
                  banner.status === 'active' ? <span className={`font-semibold uppercase text-red-primary`}>Active</span> : <span className={`font-semibold uppercase`}>In-Active</span>,
                  <div className="flex item-center justify-center gap-x-1">
                    <Link to={`/app/banners/${banner.id}/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                      <PencilSquareIcon className={'w-5 h-5'}/>
                    </Link>

                    <Link to={`/app/banners/${banner.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                      <EyeIcon className={'w-5 h-5'}/>
                    </Link>
                    <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                      <TrashIcon className={'w-5 h-5'}/>
                    </button>
                  </div>
                ]
              })}
            />

            <Pagination meta={loader.response.meta}/>
          </div>
        </div>
      </div>
    </>
  }

  return <></>
}
