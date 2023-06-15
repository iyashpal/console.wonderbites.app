import { DateTime } from "luxon"
import { useState } from "react"
import Icons from "@/helpers/icons"
import Modal from "@/components/Modal";
import { Table, TableBody, TableDataCell, TableHead, TableHeadCell, TableRow } from "./ResourceList";

type ColumnType = { name: string, value?: any, options: { [key: string]: any } }

type ResourceProps = {
    title: string,
    module: string,
    by?: string,
    date?: string,
    columns?: ColumnType[],
    children: () => any[],
}
export default function ResourceDetail({ title, module, by, date, columns, children }: ResourceProps) {
    const [show, setShow] = useState(false)
    const [headings] = useState(columns ?? [])
    const [showField, setShowField] = useState<{ name: string, value: any }>()

    function toggleModal(field: { name: string, value: any }) {
        setShow(!show)
        setShowField(field)
    }
    return <>
        <div className="overflow-hidden bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
                <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="ml-4 mt-4">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            {title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {module} Details
                        </p>
                    </div>
                    <div className="ml-4 mt-4 flex-shrink-0">
                        {(!!date) && <p className="font-medium flex justify-between gap-x-3"><span className="text-gray-500 font-normal">Created on:</span> {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}</p>}
                        {(!!by) && <p className="font-medium flex justify-between gap-x-3"><span className="text-gray-500 font-normal">By:</span> {by}</p>}
                    </div>
                </div>
            </div>
            <div className="">
                <Table>
                    <TableHead className={`shadow-inner`}>
                        <TableRow>
                            {headings.map((column, key) => (
                                <TableHeadCell className={column.options.className} key={`${column.name}-${key}`}>
                                    {column.value ?? column.name}
                                </TableHeadCell>
                            ))}
                            <TableHeadCell className="text-center">Action</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {children()?.map((value, index) => {
                                let column = headings.find((value, key) => key === index)
                                return (<TableDataCell {...column?.options} key={index}>
                                    {column?.options.onModal ? <span className={'text-red-primary font-semibold cursor-pointer underline inline-block'} onClick={() => toggleModal({ name: column?.name ?? '', value: value })}>View {column?.name}</span> : value}
                                </TableDataCell>)
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>

        <Modal show={show} onClose={() => setShow(false)} className={'max-w-2xl px-4 pt-5 pb-4'}>
            <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Icons.Outline.QueueList className="h-6 w-6 text-red-600" aria-hidden="true" />
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
