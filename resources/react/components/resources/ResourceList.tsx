import Icons from "@/helpers/icons";
import { classNames } from "@/helpers";
import { Link } from "react-router-dom";
import * as Alert from '@/components/alerts'
import Pagination from "~/components/Pagination";
import { MetaData } from "@/contracts/pagination";
import { Menu, MenuIcon, MenuTransition } from "~/components/Menu";
import { useState, ChangeEvent, forwardRef, ForwardedRef, useEffect } from "react";


type CreateLinkType = { href: string, label: string }
type SortFilterType = { label: string, value: string }
type ColumnType = { name: string, value?: any, options: { [key: string]: string } }
type CheckPropsType = { value?: number, checked?: boolean, className?: string, onChange?: (e: ChangeEvent<HTMLInputElement>) => void }
type ResourceProps = { empty?: any, data: any[], rows?: any[][], metadata?: MetaData, sorting?: SortFilterType[], columns?: ColumnType[], createLink?: CreateLinkType, children: (props: { data: any[] }) => any[] }


export default function ResourceList(props: ResourceProps) {
    const [headings] = useState(props.columns ?? [])
    return (
        <div className="divide-y divide-gray-200 bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
                <ActionBar createLink={props.createLink} sorting={props.sorting} />
            </div>
            <div className="">
                <Table>
                    <TableHead className={`shadow-inner`}>
                        <TableRow>

                            <TableHeadCheckboxCell />

                            {headings.map((column, key) => (
                                <TableHeadCell className={column.options.className} key={`${column.name}-${key}`}>
                                    {column.value ?? column.name}
                                </TableHeadCell>
                            ))}

                            <TableHeadCell>Action</TableHeadCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {props.children({ data: props.data })?.map((column, key) => (
                            <TableRow key={key}>

                                <TableDataCheckboxCell />

                                {column.map((data, index) => {
                                    let column = props.columns?.find((value, key) => key === index)
                                    return (<TableDataCell {...column?.options} key={`${column?.name}-${index}`}>{data ?? '-'}</TableDataCell>)
                                })}

                            </TableRow>
                        ))}

                        {props.data?.length === 0 && <>
                            <TableRow>
                                <TableDataCell colSpan={headings.length + 2}>
                                    <Alert.Warning>
                                        No data available.{' '}
                                        {(!!props.createLink?.href) && (
                                            <Link to={props.createLink?.href} className="font-medium text-yellow-700 underline hover:text-yellow-600">
                                                Click here to add data.
                                            </Link>
                                        )}
                                    </Alert.Warning>
                                </TableDataCell>
                            </TableRow>
                        </>}
                    </TableBody>

                </Table>

                {!!props.metadata && <Pagination meta={props.metadata} />}
            </div>
        </div>
    )
}

export function Table(props: { className?: string, children?: any }) {
    return <>
        <div className="inline-block min-w-full align-middle bg-white">

            <div className="overflow-x-auto overflow-y-hidden">

                <table className="min-w-full table-fixed divide-y divide-gray-300 border">
                    {props.children}
                </table>
            </div>
        </div>
    </>
}

export function TableHead(props: { className?: string, children?: any }) {
    return <thead className={classNames(`bg-gray-50`, props.className)}>
        {props.children}
    </thead>
}

export function TableBody(props: { className?: string, children?: any }) {
    return <tbody className={classNames(`divide-y divide-gray-200 bg-white`, props.className)}>{props.children}</tbody>
}

export function TableRow(props: { className?: string, children?: any }) {
    return <tr className={props.className}>
        {props.children}
    </tr>
}

export function TableHeadCell(props: { className?: string, colSpan?: number, children?: any }) {
    return <th colSpan={props.colSpan} className={classNames('py-3.5 px-3 text-sm font-semibold text-gray-900 uppercase', props.className)}>
        {props.children}
    </th>
}

export function TableDataCell(props: { className?: string, colSpan?: number, children?: any }) {
    return <td colSpan={props.colSpan} className={classNames('whitespace-nowrap py-3 px-3 text-sm font-medium', props.className)}>
        {props.children}
    </td>
}

export const TableHeadCheckboxCell = forwardRef((props: CheckPropsType, forwardedRef: ForwardedRef<HTMLInputElement>) => (
    <th scope="col" className={classNames("relative w-12 px-6 sm:w-16 sm:px-8", props.className)}>
        <input type="checkbox" ref={forwardedRef} defaultChecked={props.checked} onChange={props.onChange} value={props.value} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" />
    </th>
))

export const TableDataCheckboxCell = forwardRef((props: CheckPropsType, forwardedRef: ForwardedRef<HTMLInputElement>) => {
    return (
        <td className={classNames('relative w-12 px-6 sm:w-16 sm:px-8', props.className)}>
            {props.checked && (<div className="absolute inset-y-0 left-0 w-0.5 bg-red-600" />)}
            <input ref={forwardedRef} defaultChecked={props.checked} type="checkbox" onChange={props.onChange} value={props.value} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" />
        </td>
    )
})


export function ActionBar({ createLink, sorting }: { createLink?: CreateLinkType, sorting?: SortFilterType[] }) {
    return (
        <div className={classNames(`flex flex-col-reverse md:flex-row items-center justify-between bg-white`)}>
            <div className={'flex items-center gap-x-2 flex-col md:flex-row'}>
                <div className={'border border-gray-300 rounded-md flex items-center text-sm relative'}>
                    <SortByFilter filters={(sorting?.length ? sorting : [])} />
                    <RangeFilter />
                </div>
                <div>
                    <SearchInput />
                </div>
            </div>

            <div className={'flex items-center gap-x-2'}>
                {!!createLink && (
                    <Link to={createLink.href} className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        <Icons.Outline.Plus className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" /> {createLink.label}
                    </Link>
                )}

                <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    <Icons.Outline.CloudArrowUp className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" /> Import
                </button>

                <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    <Icons.Outline.CloudArrowDown className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" /> Export
                </button>

            </div>

        </div>
    )
}

export function SearchInput() {
    return (
        <div className="relative flex items-center">
            <input type="text" name="search" id="search" placeholder={'Search'} className="block w-full rounded-md border-gray-300 pl-12 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            <div className="absolute inset-y-0 left-0 flex items-center pl-1.5">
                <kbd className="inline-flex items-center rounded px-2 font-sans text-sm font-medium text-gray-400">
                    <Icons.Outline.MagnifyingGlass className={'w-5 h-5'} />
                </kbd>
            </div>
        </div>
    )
}

export function SortByFilter({ filters }: { filters: SortFilterType[] }) {
    const [selected, setSelected] = useState<SortFilterType>()
    return (
        <Menu as={'div'}>
            <Menu.Button className={''}>
                {({ open }) => (
                    <span className={`inline-flex items-center gap-x-1 p-2 rounded-l-md ${open && 'bg-gray-200'}`}>
                        <Icons.Outline.Bars3BottomLeft className={'w-4 h-4'} />
                        <span>Sort by {selected?.value}</span>
                        <MenuIcon open={open} className={'w-4 h-4 text-red-primary'} />
                    </span>
                )}
            </Menu.Button>
            <MenuTransition>
                <Menu.Items className="absolute left-0 mt-1 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="px-1 py-1">
                        {filters.map((filter, key) => (
                            <Menu.Item key={key}>
                                {({ active }) => (
                                    <button onClick={() => setSelected(filter)} className={`${active ? 'bg-red-primary text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm gap-x-2`}>
                                        {filter.label} <span className={active ? 'text-red-200' : 'text-gray-400'}>({filter.value})</span>
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </MenuTransition>
        </Menu >
    )
}

export function RangeFilter() {
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

    return (
        <Menu as={'div'} className={''}>
            <Menu.Button className={''}>
                {({ open }) => <>
                    <span className={`inline-flex items-center gap-x-1 p-2 rounded-r-md ${open && 'bg-gray-200'}`}>
                        <Icons.Outline.CalendarDays className={'w-4 h-4'} />
                        <span>{label}</span>
                        <MenuIcon open={open} className={'w-4 h-4 text-red-primary'} />
                    </span>
                </>}
            </Menu.Button>
            <MenuTransition>
                <Menu.Items className="absolute right-0 mt-1 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 p-4">
                    <div className="space-y-3">
                        <div className="">
                            <label htmlFor="start">From</label>
                            <input type="date" name={'start'} className={'block w-full rounded-md border-gray-300 shadow-sm focus:border-red-primary focus:ring-red-primary sm:text-sm'} onChange={onChangeStart} value={start} />
                        </div>
                        <div className="">
                            <label htmlFor="to">To</label>
                            <input type="date" name={'to'} className={'block w-full rounded-md border-gray-300 shadow-sm focus:border-red-primary focus:ring-red-primary sm:text-sm'} onChange={onChangeEnd} min={min} value={end} />
                        </div>
                        <Menu.Item onClick={applyFilter} as={'button'} className={'w-full inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'}>
                            Apply
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </MenuTransition>
        </Menu>
    )
}
