import { DateTime } from "luxon";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

type DetailsProps = {
    by: string,
    date: string,
    title: string,
    module: string,
    onClickEdit?: () => void,
    onClickTrash?: () => void,
    fields: { name: string, value: any, textWrap?: boolean }[],
}

export default function Details({ title, module, by, date, fields, onClickTrash, onClickEdit }: DetailsProps) {
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
                                        <th key={index} scope="col" className={`${index === 0 ? 'py-3.5 pl-4 pr-3 sm:pl-6 lg:pl-8' : 'px-3 py-3.5'} text-left text-sm font-semibold text-gray-900`}>
                                            {field.name}
                                        </th>
                                    ))}

                                    <th key={fields.length} scope="col" className="py-3.5 text-right text-sm font-semibold text-gray-900 pl-3 pr-4 sm:pr-6 lg:pr-8">
                                        Action
                                    </th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>

                                    {fields.map((field, index) => (
                                        <td key={index} className={`${index === 0 ? 'py-4 pl-4 pr-3 sm:pl-6 lg:pl-8 font-medium text-gray-900' : 'px-3 py-4 text-gray-500'} ${field.textWrap === undefined ? 'whitespace-nowrap' : 'max-w-sm'} text-left text-sm`}>
                                            {field.value}
                                        </td>
                                    ))}

                                    <td key={fields.length} className="relative whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 lg:pr-8">
                                        <div className="flex item-center justify-end gap-x-1">
                                            <button onClick={onClickEdit} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                                                <PencilSquareIcon className={'w-5 h-5'} />
                                            </button>

                                            <button onClick={onClickTrash} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                                                <TrashIcon className={'w-5 h-5'} />
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
    </>
}
