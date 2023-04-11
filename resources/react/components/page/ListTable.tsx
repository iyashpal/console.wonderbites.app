import {classNames} from "@/helpers";
import {useState} from "react";

export default function ListTable(props: TableProps) {
  const [headings] = useState(props.thead ?? [])

  return <>
    <Table>
      {headings.length > 0 && (
        <TableHead className={`shadow-inner`}>
          <TableRow>
            <TableHeadColumn>
              <input type={"checkbox"}/>
            </TableHeadColumn>

            {headings.map((column, key) => (
              <TableHeadColumn key={`${column.name}-${key}`}>
                {column.value ?? column.name}
              </TableHeadColumn>
            ))}

            <TableHeadColumn>
              Action
            </TableHeadColumn>
          </TableRow>
        </TableHead>
      )}

      <TableBody>
        {props.tbody?.map((row, key) => (
          <TableRow key={key}>
            <TableDataColumn>
              <input type={"checkbox"}/>
            </TableDataColumn>

            {row.map((data, index) => {
              let column = props.thead ? props.thead[index] : {name: ''}
              return (
                <TableDataColumn key={`${column?.name}-${index}`}>
                  {data ?? '-'}
                </TableDataColumn>
              )
            })}
          </TableRow>
        ))}
      </TableBody>

    </Table>
  </>
}

type TableProps = {
  thead?: { name: string, value?: any, options: { [key: string]: string } }[],
  tbody?: any[][]
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
  return <thead {...classNames(`bg-gray-50`, props.className)}>
  {props.children}
  </thead>
}

export function TableBody(props: { className?: string, children?: any }) {
  return <tbody {...classNames(`divide-y divide-gray-200 bg-white`, props.className)}>{props.children}</tbody>
}

export function TableRow(props: { className?: string, children?: any }) {
  return <tr className={props.className}>
    {props.children}
  </tr>
}

export function TableHeadColumn(props: { className?: string, colSpan?: number, children?: any }) {
  return <th colSpan={props.colSpan} {...classNames('py-3.5 px-3 text-sm font-semibold text-gray-900 uppercase', props.className)}>
    {props.children}
  </th>
}

export function TableDataColumn(props: { className?: string, colSpan?: number, children?: any }) {
  return <td colSpan={props.colSpan} {...classNames('whitespace-nowrap py-3 px-3 text-sm font-medium', props.className)}>
    {props.children}
  </td>
}
