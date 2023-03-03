import { Category, Cuisine } from '@/types/models'
import { Combobox, Transition } from '@headlessui/react'
import { FolderOpenIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useLayoutEffect, useRef, useState, Fragment } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

export default function CuisineCategories({ categories, cuisine }: { cuisine: Cuisine, categories: Category[] }) {
  const [checked, setChecked] = useState(false)
  const checkbox = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<Category[]>([])
  const [indeterminate, setIndeterminate] = useState(false)
  const [toggleCategoryModal, setToggleCategoryModal] = useState(false)

  useLayoutEffect(() => {
    const isIndeterminate = selected.length > 0 && selected.length < (cuisine.categories ?? []).length
    setIndeterminate(isIndeterminate)
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate
    }
    setChecked(selected.length === (cuisine.categories ?? []).length)
  }, [selected])

  function toggleAll() {
    setIndeterminate(false)
    setChecked(!checked && !indeterminate)
    setSelected(checked || indeterminate ? [] : (cuisine.categories ?? []))
  }

  function onChangeCheckbox(e, category) {
    if (e.target.checked) {
      setSelected([...selected, category])
    } else {
      setSelected(selected.filter(({ id }) => id !== category.id))
    }
  }

  function onCloseModal() {
    setToggleCategoryModal(false)
  }

  function onSuccessModal() {

  }

  return <>
    <div className={'mx-auto max-w-7xl px-4 sm:px-6 md:px-8'}>
      <div className="shadow">
        <div className="sm:flex sm:items-center p-4 sm:p-6">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Categories</h1>
          </div>
        </div>
        <div className="flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="relative">

                {selected.length > 0 && <>
                  <div className="absolute top-1 left-14 flex h-10 w-1/3 items-center space-x-3 bg-gray-50 sm:left-12">
                    <button type="button" className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">
                      Delete all
                    </button>
                  </div>
                </>}

                <table className="min-w-full table-fixed">
                  <thead>
                    <tr className={'bg-gray-50 border-y'}>
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                        <input type="checkbox" ref={checkbox} checked={checked} onChange={toggleAll} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                      </th>
                      <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                        List Of Categories
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3 w-16 text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {(cuisine.categories ?? []).map((category, index) => (
                      <tr key={index} className={selected.includes(category) ? 'bg-gray-50' : undefined}>
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selected.includes(category) && (<div className="absolute inset-y-0 left-0 w-0.5 bg-red-600" />)}
                          <input type="checkbox" value={category.name} checked={selected.includes(category)} onChange={e => onChangeCheckbox(e, category)} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                        </td>
                        <td className={`whitespace-nowrap py-4 pr-3 text-sm font-medium ${selected.includes(category) ? 'text-red-600' : 'text-gray-900'}`}>
                          {category.name}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                          <div className="flex items-center justify-center">
                            <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                              <TrashIcon className={'w-5 h-5'} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <AddNewCategory cuisine={cuisine} categories={categories.filter((category) => !cuisine.categories?.map(({ id }) => id).includes(category.id))} show={toggleCategoryModal} onClose={onCloseModal} onSuccess={onSuccessModal} />

        <div className="sm:flex sm:items-center p-4 sm:p-6 border-t">
          <button type="button" onClick={() => setToggleCategoryModal(true)} className="inline-flex gap-x-1 items-center justify-center rounded-md border border-transparent bg-red-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Add New
          </button>
        </div>
      </div>
    </div>

  </>
}


type AddNewCategoryProps = { show: boolean, onSuccess: () => void, onClose: () => void, cuisine: Cuisine, categories: Category[] }

function AddNewCategory({ show, onClose = () => { }, onSuccess = () => { }, cuisine, categories }: AddNewCategoryProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Category>({} as Category)
  const filtered = query === '' ? categories : categories.filter(category => category.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')))

  function onClickClose() {
    onClose()
    setSelected({} as Category)
  }

  return <>
    {show && <>
      <div className='border-t flex items-center justify-between px-3 sm:px-4 py-3'>

        <div className={`flex-auto text-sm font-medium text-gray-900`}>
          <div className="max-w-md">
            <Combobox value={selected} onChange={setSelected}>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-md bg-white text-left border focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <Combobox.Input placeholder='i.e. Burger' displayValue={(category: Category) => category.name} onChange={(event) => setQuery(event.target.value)} className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 placeholder:text-gray-300" />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Combobox.Button>
                </div>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery('')}>

                  <Combobox.Options className="absolute bottom-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">

                    {filtered.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filtered.map((category) => (
                        <Combobox.Option key={category.id} value={category} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-red-primary text-white' : 'text-gray-900'}`} >
                          {({ selected, active }) => (
                            <>
                              <span className={`block truncate ${selected ? `font-medium ${(!active) && 'text-red-primary'}` : 'font-normal'}`}> {category.name} </span>

                              <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : ((!!selected) && 'text-red-primary')}`}>
                                {(!!selected) ? <CheckIcon className="h-5 w-5" aria-hidden="true"/> : <FolderOpenIcon className="h-5 w-5" aria-hidden="true" />}
                              </span>
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
        </div>

        <div className="text-sm font-medium">
          <div className="flex items-center justify-center gap-x-2">
            {selected?.id !== undefined && (
              <button className={'bg-green-100 border border-green-400 text-green-500 rounded-lg p-1 hover:border-green-700 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                <CheckIcon className={'w-5 h-5'} />
              </button>
            )}

            <button onClick={onClickClose} className={'bg-red-100 border border-red-400 text-red-500 rounded-lg p-1 hover:border-red-700 hover:text-red-700 transition-colors ease-in-out duration-300'}>
              <XMarkIcon className={'w-5 h-5'} />
            </button>
          </div>
        </div>
      </div>
    </>}
  </>
}
