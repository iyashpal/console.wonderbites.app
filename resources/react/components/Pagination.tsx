import { PaginationMeta } from '~/types';
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type ComponentProps = {
  className?: string,

  meta: PaginationMeta,

  url?: string,
}

export default function Pagination({ className, meta, url }: ComponentProps) {

  const location = useLocation()

  let links: number[] = []

  const [lastItem, setLastItem] = useState<number>(meta.per_page * meta.current_page)

  const [firstItem, setFirstItem] = useState<number>((meta.per_page * meta.current_page) - (meta.per_page - 1))

  useEffect(() => {
    resetLinks()
    setLastItem(meta.per_page * meta.current_page)
    setFirstItem((meta.per_page * meta.current_page) - (meta.per_page - 1))
  }, [meta])


  function resetLinks() {
    links = []

    for (let i = 1; i <= meta.last_page; i++) {
      links.push(i)
    }
  }


  return <>
    <div className={`${className ?? 'px-4 sm:px-6 md:px-8 py-4 shadow border flex items-center justify-between'}`}>
      <div>Showing {firstItem} to {lastItem} of {meta.total} results</div>
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

          <button type="button" className="rounded-full relative inline-flex items-center hover:bg-red-primary hover:text-white px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-red-500 focus:outline-none">
            1
          </button>
          <button type="button" className="rounded-full relative inline-flex items-center hover:bg-red-primary hover:text-white px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-red-500 focus:outline-none">
            2
          </button>
          <button type="button" className="rounded-full relative inline-flex items-center hover:bg-red-primary hover:text-white px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-red-500 focus:outline-none">
            3
          </button>
          <button type="button" className="rounded-full relative inline-flex items-center hover:bg-red-primary hover:text-white px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-red-500 focus:outline-none">
            4
          </button>
          <button type="button" className="rounded-full relative inline-flex items-center hover:bg-red-primary hover:text-white px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-red-500 focus:outline-none">
            5
          </button>
          <button type="button" className="rounded-full relative inline-flex items-center hover:bg-red-primary hover:text-white px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-red-500 focus:outline-none">
            6
          </button>
          <button type="button" className="rounded-full relative inline-flex items-center hover:bg-red-primary hover:text-white px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-red-500 focus:outline-none">
            7
          </button>
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
