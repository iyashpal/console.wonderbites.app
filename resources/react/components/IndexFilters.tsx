import {Link} from "react-router-dom";
import {Menu, Transition} from '@headlessui/react'
import React, {Fragment, useEffect, useState} from "react";
import {Bars3BottomLeftIcon, CalendarDaysIcon, ChevronDownIcon, CloudArrowDownIcon, CloudArrowUpIcon, MagnifyingGlassIcon, PlusIcon, ChevronUpIcon} from "@heroicons/react/24/outline";

type FilterProps = { sortBy: SortFilter[], create: CreateLink }
type CreateLink = { label: string, url: string, icon?: JSX.Element }
type SortFilter = { label: string, value: string, icon: JSX.Element }

export default function IndexFilters({create, sortBy}: FilterProps) {
  return <>
    <div className={'p-4 shadow border flex flex-col-reverse md:flex-row items-center justify-between'}>
      <div className={'flex items-center gap-x-2 flex-col md:flex-row'}>
        <div className={'border border-gray-300 rounded-md flex items-center text-sm relative'}>
          <SortBy filters={sortBy}/>
          <DateRange/>
        </div>
        <div>
          <div className="relative flex items-center">
            <input type="text" name="search" id="search" placeholder={'Search'} className="block w-full rounded-md border-gray-300 pl-12 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"/>
            <div className="absolute inset-y-0 left-0 flex items-center pl-1.5">
              <kbd className="inline-flex items-center rounded px-2 font-sans text-sm font-medium text-gray-400">
                <MagnifyingGlassIcon className={'w-5 h-5'}/>
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <div className={'flex items-center gap-x-2'}>

        <Link to={create.url} className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
          {create.label}
        </Link>

        <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          <CloudArrowUpIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
          Import
        </button>

        <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          <CloudArrowDownIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
          Export
        </button>

      </div>

    </div>
  </>
}

function SortBy({filters}: { filters: { label: string, value: string, icon: JSX.Element }[] }) {
  const [selected, setSelected] = useState<SortFilter>()
  return <>
    <Menu as={'div'} className={'relative'}>
      <Menu.Button className={''}>
        {({open}) => <>
          <span className={`inline-flex items-center gap-x-1 p-2 rounded-l-md ${open && 'bg-gray-200'}`}>
            <Bars3BottomLeftIcon className={'w-4 h-4'}/>
            <span>Sort by {selected?.value}</span>
            {open ? <ChevronUpIcon className={'w-4 h-4 text-red-primary'}/> : <ChevronDownIcon className={'w-4 h-4 text-red-primary'}/>}
          </span>
        </>}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-1 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="px-1 py-1">
            {filters.map((filter, key) => (
              <Menu.Item key={key}>
                {({active}) => (
                  <button onClick={() => setSelected(filter)} className={`${active ? 'bg-red-primary text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm gap-x-2`}>
                    {filter.icon} {filter.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  </>
}

function DateRange() {
  const [min, setMin] = useState('')
  const [end, setEnd] = useState('')
  const [start, setStart] = useState('')
  const [label, setLabel] = useState('Any Date')

  useEffect(() => {
    setMin(start)
    setEnd(start)
  }, [start])

  function onChangeStart(e) {
    setStart(e.target.value)
  }

  function onChangeEnd(e) {
    setEnd(e.target.value)
  }

  function applyFilter() {
    if ((start && end) && start === end) {
      setLabel(start)
    } else if (start != end) {
      setLabel(`${start} to ${end}`)
    } else {
      setLabel('Any Date')
    }
  }

  return <>
    <Menu as={'div'} className={''}>
      <Menu.Button className={''}>
        {({open}) => <>
          <span className={`inline-flex items-center gap-x-1 p-2 rounded-r-md ${open && 'bg-gray-200'}`}>
            <CalendarDaysIcon className={'w-4 h-4'}/>
            <span>{label}</span>
            {open ? <ChevronUpIcon className={'w-4 h-4 text-red-primary'}/> : <ChevronDownIcon className={'w-4 h-4 text-red-primary'}/>}
          </span>
        </>}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-1 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 p-4">
          <div className="space-y-3">
            <div className="">
              <label htmlFor="start">From</label>
              <input type="date" name={'start'} className={'block w-full rounded-md border-gray-300 shadow-sm focus:border-red-primary focus:ring-red-primary sm:text-sm'} onChange={onChangeStart} value={start}/>
            </div>
            <div className="">
              <label htmlFor="to">To</label>
              <input type="date" name={'to'} className={'block w-full rounded-md border-gray-300 shadow-sm focus:border-red-primary focus:ring-red-primary sm:text-sm'} onChange={onChangeEnd} min={min} value={end}/>
            </div>
            <Menu.Item onClick={applyFilter} as={'button'} className={'w-full inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'}>
              Apply
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  </>
}
