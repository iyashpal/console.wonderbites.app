import { Fragment } from "react";
import { usePagination } from '@/hooks';
import { PaginationMeta } from '~/types';
import { Link, useLocation } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type ComponentProps = {
  className?: string,

  meta: PaginationMeta,

  url?: string,
}

export default function Pagination({ className, meta, url }: ComponentProps) {

  const location = useLocation()

  const paginator = usePagination({ meta })


  return <>
    <div className={`${className ?? 'px-4 sm:px-6 md:px-8 py-4 shadow border flex items-center justify-between'}`}>
      <div>Showing {paginator.page.firstItem()} to {paginator.page.lastItem()} of {paginator.total()} results first Seperator : {paginator.isFirstSeparatorEnabled() ? 'true' : 'false'} & Last separtor {paginator.isLastSeparatorEnabled() ? 'true' : 'false'}</div>
      <div className={'flex items-center justify-end gap-x-3'}>

        {meta.current_page === meta.first_page ? <>
          <button className={'rounded-full relative inline-flex items-center bg-gray-100 p-2 text-sm font-medium text-gray-400 focus:z-10 focus:border-red-500 focus:outline-none cursor-not-allowed'}>
            <ChevronLeftIcon className={'w-5 h-5'} />
          </button>
        </> : <>
          <Link to={{ pathname: url ?? location.pathname, search: meta.previous_page_url?.replace('/?', '') }} className={'rounded-full relative inline-flex items-center bg-gray-100 text-red-primary hover:bg-red-primary hover:text-white p-2 text-sm font-medium focus:z-10 focus:border-red-500 focus:outline-none'}>
            <ChevronLeftIcon className={'w-5 h-5'} />
          </Link>
        </>}

        <span className="isolate inline-flex rounded-full shadow-sm overflow-hidden bg-gray-100">

          {paginator.items().map((page, index) => (
            <Fragment key={index}>

              <button type="button" className="rounded-full relative inline-flex items-center hover:bg-red-primary hover:text-white px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-red-500 focus:outline-none">
                {page ? page : '...'}
              </button>

            </Fragment>
          ))}
        </span>

        {meta.current_page === meta.last_page ? <>
          <button className={'rounded-full relative inline-flex items-center bg-gray-100 p-2 text-sm font-medium text-gray-400 focus:z-10 focus:border-red-500 focus:outline-none cursor-not-allowed'}>
            <ChevronRightIcon className={'w-5 h-5'} />
          </button>
        </> : <>
          <Link to={{ pathname: url ?? location.pathname, search: meta.next_page_url?.replace('/?', '') }} className={'rounded-full relative inline-flex items-center bg-gray-100 text-red-primary hover:bg-red-primary hover:text-white p-2 text-sm font-medium focus:z-10 focus:border-red-500 focus:outline-none'}>
            <ChevronRightIcon className={'w-5 h-5'} />
          </Link>
        </>}

      </div>
    </div>
  </>
}
