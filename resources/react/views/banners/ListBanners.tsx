import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import ListTable from "@/components/page/ListTable";
import {useDataLoader} from "@/hooks";
import {useEffect} from "react";
import {Banner} from "@/types/models";
import {PaginatorMeta} from "@/types/paginators";
import {Link} from "react-router-dom";
import {EyeIcon, PencilSquareIcon} from "@heroicons/react/24/outline";

export default function ListBanners() {
  const loader = useDataLoader<{ data: Banner[], meta: PaginatorMeta }>(`/banners`)

  const columns = {
    id: {name: 'id', options: {}},
    product_name: {name: 'Product Name', options: {}},
    description: {name: 'Description', options: {}},
    sku: {name: 'Sku', options: {}},
    status: {name: 'status', options: {}},
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
          <ListTable
            thead={Object.values(columns)}
            tbody={loader.response.data.map(banner => {
              return [
                banner.id,
                banner.id,
                banner.id,
                banner.id,
                banner.id,
                <div className="flex item-center justify-center gap-x-1">
                  <Link to={`/app/users/1/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                    <PencilSquareIcon className={'w-5 h-5'}/>
                  </Link>

                  <Link to={`/app/users/1`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                    <EyeIcon className={'w-5 h-5'}/>
                  </Link>
                </div>
              ]
            })}
          />
        </div>
      </div>
    </>
  }

  return <></>
}
