import {DateTime} from "luxon";
import {PencilSquareIcon, QueueListIcon, TrashIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import Modal from "@/components/Modal";

type DetailsProps = {
  by: string,
  date: string,
  title: string,
  module: string,
  onClickEdit?: () => void,
  onClickTrash?: () => void,
  fields: { name: string, value: any, textWrap?: boolean, onModal?: boolean }[],
}

export default function Details({title, module, by, date, fields, onClickTrash, onClickEdit}: DetailsProps) {
  const [show, setShow] = useState(false)
  const [showField, setShowField] = useState<{ name: string, value: any }>()

  function toggleModal(field: {name: string, value: any}) {
    setShow(!show)
    setShowField(field)
  }

  return <>
    <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 shadow">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </h1>
          <p className="mt-4 font-medium text-sm text-gray-700">
            {module} Details
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none text-sm">
          {(!!date) && <p>Created on: {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}</p>}
          {(!!by) && <p>By: {by}</p>}
        </div>
      </div>
      <div className="mt-3 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
              <tr className='bg-gray-100 border-gray-300 border-t'>

                {fields.map((field, index) => (
                  <th key={index} scope="col" className={`${index === 0 ? 'py-3.5 pl-4 pr-3 sm:pl-6 lg:pl-8' : 'px-3 py-3.5'} text-left text-sm font-semibold text-gray-900 uppercase`}>
                    {field.name}
                  </th>
                ))}

                <th key={fields.length} scope="col" className="py-3.5 text-right text-sm font-semibold text-gray-900 pl-3 pr-4 sm:pr-6 lg:pr-8 uppercase">
                  Action
                </th>

              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              <tr>

                {fields.map((field, index) => (
                  <td key={index} className={`${index === 0 ? 'py-4 pl-4 pr-3 sm:pl-6 lg:pl-8 font-medium text-gray-900' : 'px-3 py-4 text-gray-500'} ${field.textWrap === undefined ? 'whitespace-nowrap' : 'max-w-sm'} text-left text-sm`}>
                    {field.onModal ? <span className={'text-red-primary font-semibold cursor-pointer underline inline-block'} onClick={() => toggleModal(field)}>View {field.name}</span> : field.value}
                  </td>
                ))}

                <td key={fields.length} className="relative whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 lg:pr-8">
                  <div className="flex item-center justify-end gap-x-1">
                    <button onClick={onClickEdit} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                      <PencilSquareIcon className={'w-5 h-5'}/>
                    </button>

                    <button onClick={onClickTrash} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                      <TrashIcon className={'w-5 h-5'}/>
                    </button>
                  </div>
                </td>

              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <Modal show={show} onClose={() => setShow(false)} className={'max-w-2xl px-4 pt-5 pb-4'}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
          <QueueListIcon className="h-6 w-6 text-blue-600" aria-hidden="true"/>
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {showField?.name}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {showField?.value}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:justify-end sm:pl-4">
        <button type="button" onClick={() => setShow(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto">
          Close
        </button>
      </div>
    </Modal>
  </>
}
