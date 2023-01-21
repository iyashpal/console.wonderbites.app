import {Menu, Transition} from '@headlessui/react'
import {useLayoutEffect, useRef, useState} from 'react'
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {
  EllipsisVerticalIcon, PlusIcon, CloudArrowUpIcon, CloudArrowDownIcon, MagnifyingGlassIcon, Bars3BottomLeftIcon, CalendarDaysIcon, ChevronDownIcon,
  ChevronRightIcon, ChevronLeftIcon
} from "@heroicons/react/24/outline"
import {className} from "~/helpers";
import {Link} from "react-router-dom";

const people = [
  {id: '', name: 'PIZZA CARBONARA', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'BURRITO', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'CHIPS', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'CARBONARA', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'BOSCAIOLA', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'MODENESE', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'RUSTICA', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'DELICATA', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'PARTENOPEA', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'SAPORITA', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'DELIZIOSA', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'BUONA', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'ITALIA', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'VEGGIE BURGER', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'TRUFFLE BURGER', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'CAESAR SALAD', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
  {id: '', name: 'SUPER BOWL', price: '500 L', description: 'Corn fed beef topped with cheddar ...', image: '', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
]

export default function ListProducts() {

  const checkbox = useRef<HTMLInputElement>(null)
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState<{ name: string, title: string, email: string, role: string }[]>([])

  useLayoutEffect(() => {
    const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people.length
    setChecked(selectedPeople.length === people.length)
    setIndeterminate(isIndeterminate)
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate
    }
  }, [selectedPeople])

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : people)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }


  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Products'}]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <div className={'p-4 shadow border flex flex-col md:flex-row items-center justify-between flex-col-reverse'}>
          <div className={'flex items-center gap-x-2 flex-col md:flex-row'}>
            <div className={'border border-gray-300 p-2 rounded-md flex items-center gap-x-3 text-sm'}>
              <div className={'inline-flex items-center gap-x-1'}>
                <Bars3BottomLeftIcon className={'w-4 h-4'}/>
                <span>Sort by date</span>
                <ChevronDownIcon className={'w-4 h-4 text-red-primary'}/>
              </div>
              <div className={'inline-flex items-center gap-x-1'}>
                <CalendarDaysIcon className={'w-4 h-4'}/>
                <span>Any Date</span>
                <ChevronDownIcon className={'w-4 h-4 text-red-primary'}/>
              </div>
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

            <Link to="/app/products/create" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
              Add Product
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
        <div className="">
          <div className="inline-block min-w-full py-2 align-middle">

            <div className="overflow-x-auto overflow-y-hidden">

              <table className="min-w-full table-fixed divide-y divide-gray-300 border">
                <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" ref={checkbox} checked={checked} onChange={toggleAll}/>
                  </th>
                  <th scope="col" className="max-w-[12rem] py-3.5 pr-3 text-center text-sm font-semibold text-gray-900 uppercase">
                    ID
                  </th>
                  <th scope="col" className="min-w-[12rem] py-3.5 px-3 text-left text-sm font-semibold text-gray-900 uppercase">
                    Product Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 uppercase">
                    Image
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center w-10 text-sm font-semibold text-gray-900 uppercase">
                    Action
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {people.map((person, index) => (
                  <tr key={index} className={selectedPeople.includes(person) ? 'bg-gray-50' : undefined}>
                    <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                      {selectedPeople.includes(person) && (<div className="absolute inset-y-0 left-0 w-0.5 bg-red-600"/>)}
                      <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" value={person.email} checked={selectedPeople.includes(person)} onChange={(e) => setSelectedPeople(
                        e.target.checked ? [...selectedPeople, person] : selectedPeople.filter((p) => p !== person)
                      )}
                      />
                    </td>
                    <td {...className('whitespace-nowrap py-3 pr-3 text-sm font-medium text-center', selectedPeople.includes(person) ? 'text-red-600' : 'text-gray-900')}>
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">{person.name}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">{person.price}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">{person.description}</td>
                    <td className="whitespace-nowrap text-center">
                      <div className={'rounded-full overflow-hidden group w-9 h-9 mx-auto relative cursor-pointer z-0'}>
                        <img className={'w-9 h-9 rounded-full'} src="/images/placeholder/square.svg" alt="Product Name"/>
                        <span className="hidden group-hover:flex items-center justify-center font-semibold text-xs absolute inset-0 text-white bg-gray-900/30">+4</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Menu>
                        <Menu.Button>
                          <EllipsisVerticalIcon {...className('h-5 w-5 text-red-800')}/>
                        </Menu.Button>
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Menu.Items className="fixed right-0 mt-2 w-28 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                            <Menu.Item>
                              {({active}) => (
                                <button className={`${active ? 'bg-red-primary text-white' : 'text-gray-900'} group flex w-full items-center px-2 py-2 text-sm`}>
                                  Edit
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({active}) => (
                                <button className={`${active ? 'bg-red-primary text-white' : 'text-gray-900'} group flex w-full items-center px-2 py-2 text-sm`}>
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({active}) => (
                                <button className={`${active ? 'bg-red-primary text-white' : 'text-gray-900'} group flex w-full items-center px-2 py-2 text-sm`}>
                                  Disable
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
        <div className={'px-4 sm:px-6 md:px-8 py-4 shadow border flex items-center justify-between'}>
          <div>Showing 25 of 100 entries</div>
          <div className={'flex items-center justify-end gap-x-3'}>
            <button className={'rounded-full relative inline-flex items-center bg-gray-100 text-red-primary hover:bg-red-primary hover:text-white p-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-red-500 focus:outline-none'}>
              <ChevronLeftIcon className={'w-5 h-5'}/>
            </button>
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
            <button className={'rounded-full relative inline-flex items-center bg-gray-100 text-red-primary hover:bg-red-primary hover:text-white p-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-red-500 focus:outline-none'}>
              <ChevronRightIcon className={'w-5 h-5'}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
}
