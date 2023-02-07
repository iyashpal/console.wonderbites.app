import { PaginationMeta } from '~/types';
import { Product } from '@/types/models';
import { Link, useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type Slider = { first: number[], active: number[], last: number[] }

type ComponentProps = { className?: string, meta: PaginationMeta, url?: string, data?: Product[] }

export default function Pagination({ className, meta, url }: ComponentProps) {

  const location = useLocation()

  const [pages, setPages] = useState<number[]>([] as number[])
  const [slider, setSlider] = useState<Slider>({ first: [], active: [], last: [] })

  useEffect(() => {


    setSlider({ first: [], active: [], last: [] })

    resolvePages().map(page => {


      if (page <= (meta.first_page + 1)) {

        resolveFirstSlider(page)

      }

      if (page >= (meta.last_page - 1) && meta.last_page > 5) {

        resolveLastSlider(page)

      }

      if (page >= (meta.current_page - 1) && page <= (meta.current_page + (meta.current_page < 5 ? 2 : 1))) {

        resolveActiveSlider(page)

      }

    })

  }, [meta, location])

  function firstItem() {
    return (meta.per_page * meta.current_page) - (meta.per_page - 1)
  }

  function lastItem() {
    return meta.per_page * meta.current_page
  }

  function resolvePages(): number[] {
    for (let i = 1; i <= meta.last_page; i++) {
      setPages(stack => {
        !stack.includes(i) ? stack.push(i) : null
        return stack;
      })
    }

    return pages
  }


  function resolveFirstSlider(page: number) {

    setSlider(slide => {

      if (!slide.first.includes(page)) {
        slide.first.push(page)
      }

      return slide
    })

    slider.first.sort()

  }

  function resolveActiveSlider(page: number) {
    setSlider(slide => {

      if ((!slide.first.includes(page) && !slide.active.includes(page) && !slide.last.includes(page))) {
        slide.active.push(page)
      }

      return slide
    })

    slider.active.sort()
  }


  function resolveLastSlider(page: number) {
    setSlider(slide => {

      if (!slide.last.includes(page)) {

        slide.last.push(page)

      }

      return slide
    })

    slider.last.sort()
  }


  function isFirstSeparatorEnabled() {
    return (slider.active[0] - slider.first[1]) > 1
  }

  function isLastSeparatorEnabled() {
    return (slider.last[0] - slider.active[slider.active.length - 1]) > 1
  }

  function items() {
    let links = [...slider.first];

    if (isFirstSeparatorEnabled()) {
      links.push(0)
    }

    links.push(...slider.active)

    if (!isFirstSeparatorEnabled() && !isLastSeparatorEnabled() && slider.active.length === 0 && slider.last.length > 0) {
      links.push(0)
    }

    if (isLastSeparatorEnabled()) {
      links.push(0)
    }

    links.push(...slider.last)

    return links
  }

  function total() {
    return meta.total
  }


  return <>
    <div className={`${className ?? 'px-4 sm:px-6 md:px-8 py-4 shadow border flex items-center justify-between'}`}>

      <div>Showing {firstItem()} to {lastItem()} of {total()} results</div>

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

          {items().map((page, index) => (
            <Fragment key={index}>
              {page === 0 ? (
                <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none">
                  ...
                </button>
              ) : (
                <Link to={{ pathname: url ?? location.pathname, search: `page=${page}` }} className={`rounded-full relative inline-flex w-9 h-9 items-center justify-center text-sm font-medium focus:z-10 focus:border-red-500 focus:outline-none ${meta.current_page === page ? 'bg-red-500 text-white' : 'hover:bg-red-200 hover:text-red-primary text-gray-700'}`}>
                  {page}
                </Link>
              )}
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
