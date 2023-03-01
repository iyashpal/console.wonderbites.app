import Modal from '@/components/Modal'
import {Category} from '@/types/models'
import {TrashIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {useLayoutEffect, useRef, useState} from 'react'

export default function CuisineCategories({categories}: { categories: Category[] }) {
  const [checked, setChecked] = useState(false)
  const checkbox = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<Category[]>([])
  const [indeterminate, setIndeterminate] = useState(false)
  const [toggleCategoryModal, setToggleCategoryModal] = useState(false)

  useLayoutEffect(() => {
    const isIndeterminate = selected.length > 0 && selected.length < categories.length
    setIndeterminate(isIndeterminate)
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate
    }
    setChecked(selected.length === categories.length)
  }, [selected])

  function toggleAll() {
    setIndeterminate(false)
    setChecked(!checked && !indeterminate)
    setSelected(checked || indeterminate ? [] : categories)
  }

  function onChangeCheckbox(e, category) {
    if (e.target.checked) {
      setSelected([...selected, category])
    } else {
      setSelected(selected.filter(({id}) => id !== category.id))
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
                      <input type="checkbox" ref={checkbox} checked={checked} onChange={toggleAll} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"/>
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
                  {categories.map((category, index) => (
                    <tr key={index} className={selected.includes(category) ? 'bg-gray-50' : undefined}>
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        {selected.includes(category) && (<div className="absolute inset-y-0 left-0 w-0.5 bg-red-600"/>)}
                        <input type="checkbox" value={category.name} checked={selected.includes(category)} onChange={e => onChangeCheckbox(e, category)} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                      </td>
                      <td className={`whitespace-nowrap py-4 pr-3 text-sm font-medium ${selected.includes(category) ? 'text-red-600' : 'text-gray-900'}`}>
                        {category.name}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <div className="flex items-center justify-center">
                          <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                            <TrashIcon className={'w-5 h-5'}/>
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
        <div className="sm:flex sm:items-center p-4 sm:p-6 border-t">
          <button type="button" onClick={() => setToggleCategoryModal(true)} className="inline-flex gap-x-1 items-center justify-center rounded-md border border-transparent bg-red-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Add New
          </button>
        </div>
      </div>
    </div>
    <AddNewCategory show={toggleCategoryModal} onClose={onCloseModal} onSuccess={onSuccessModal}/>
  </>
}

function AddNewCategory({show, onClose = () => {}, onSuccess = () => {}}: { show: boolean, onSuccess: () => void, onClose: () => void }) {
  return <>
    <Modal show={show} onClose={onClose} className={'p-4 text-left max-w-xl'}>
      <div className={'mb-4 flex items-center justify-between'}>
        <h3 className={'text-base font-semibold leading-6 text-gray-900'}>Add New Category</h3>
        <button onClick={onClose} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors ease-in-out duration-300'}>
          <XMarkIcon className={'w-4 h-4'}/>
        </button>
      </div>
      <div className="border-t pt-4">
        This is description...
      </div>
    </Modal>
  </>
}
