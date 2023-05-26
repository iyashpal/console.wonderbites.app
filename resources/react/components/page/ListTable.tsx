import {classNames} from "@/helpers";
import {useState, ChangeEvent, forwardRef, ForwardedRef} from "react";

export default function ListTable(props: TableProps) {
  const [headings] = useState(props.thead ?? [])

  return <>
    <Table>
      <TableHead className={`shadow-inner`}>
        <TableRow>

          <TableHeadCheckboxCell/>

          {headings.map((column, key) => (
            <TableHeadCell className={column.options.className} key={`${column.name}-${key}`}>
              {column.value ?? column.name}
            </TableHeadCell>
          ))}

          <TableHeadCell>Action</TableHeadCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {props.tbody?.map((row, key) => (
          <TableRow key={key}>

            <TableDataCheckboxCell/>

            {row.map((data, index) => {
              let column = props.thead?.find((value, key) => key === index)
              return (<TableDataCell {...column?.options} key={`${column?.name}-${index}`}>{data ?? '-'}</TableDataCell>)
            })}

          </TableRow>
        ))}

        {props.tbody?.length === 0 && <>
          <TableRow>
            <TableDataCell colSpan={headings.length + 2}>
              {props.empty ?? 'No data available.'}
            </TableDataCell>
          </TableRow>
        </>}
      </TableBody>

    </Table>
  </>
}


export function Table(props: { className?: string, children?: any }) {
  return <>
    <div className="inline-block min-w-full align-middle">

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
    <input type="checkbox" ref={forwardedRef} defaultChecked={props.checked} onChange={props.onChange} value={props.value} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6"/>
  </th>
))

export const TableDataCheckboxCell = forwardRef((props: CheckPropsType, forwardedRef: ForwardedRef<HTMLInputElement>) => {

  return (
    <td className={classNames('relative w-12 px-6 sm:w-16 sm:px-8', props.className)}>
      {props.checked && (<div className="absolute inset-y-0 left-0 w-0.5 bg-red-600"/>)}
      <input ref={forwardedRef} defaultChecked={props.checked} type="checkbox" onChange={props.onChange} value={props.value} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6"/>
    </td>
  )
})


type TableProps = {
  thead?: { name: string, value?: any, options: { [key: string]: string } }[],
  tbody?: any[][],
  empty?: any,
}

type CheckPropsType = {
  value?: number,
  checked?: boolean,
  className?: string,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
}
