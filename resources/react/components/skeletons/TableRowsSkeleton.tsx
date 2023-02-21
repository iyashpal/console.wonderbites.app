import {useEffect, useState} from "react";

type Cell = {
  label: string,
  align?: 'left' | 'right' | 'center',

  type?: 'circle' | 'rectangle' | 'square' | 'text',

  width?: string
}

type SkeletonProps = {
  columns: Cell[], limit?: number, checkboxes?: boolean, actions?: boolean
}
export default function TableRowsSkeleton({columns, limit = 10, checkboxes = true, actions = true}: SkeletonProps) {
  const [rows, setRows] = useState<number[]>([])

  useEffect(() => {
    // Reset the rows
    setRows([])

    // Generate number of rows based on given limit.
    for (let i = 0; i < limit; i++) {
      setRows(stack => {

        if (!stack.includes(i)) {
          stack.push(i)
        }

        return stack
      })
    }
  }, [])

  return <>
    {rows.map((row, index) => (
      <tr key={index}>
        {/* Checkbox Column */}
        {checkboxes && <>
          <td className={'px-3 py-3.5'}>
            <span className="bg-gray-200 inline-block rounded-md h-5 w-4">
              &nbsp;
            </span>
          </td>
        </>}

        {/* Module Columns */}
        {columns.map((column, index) => {
          let classes = ['px-3 py-3.5 align-middle', column.width ?? '']

          switch (column.align) {
            case 'left':
              classes.push('text-left')
              break;
            case 'right':
              classes.push('text-right')
              break;
            case 'center':
              classes.push('text-center')
              break;
            default:
              classes.push('text-left')
              break;
          }

          switch (column.type) {
            case 'square':
              return <td key={index} className={classes.join(' ')}>
                <span className="inline-block bg-gray-200 aspect-square rounded-md w-8">
                  &nbsp;
                </span>
              </td>

            case 'rectangle':
              return <td key={index} className={classes.join(' ')}>
                <span className="inline-block bg-gray-200 aspect-video rounded-md w-8">
                  &nbsp;
                </span>
              </td>

            case 'circle':
              return <td key={index} className={classes.join(' ')}>
                <span className="inline-block bg-gray-200 aspect-square rounded-full w-8">
                  &nbsp;
                </span>
              </td>

            default:
              return <td key={index} className={classes.join(' ')}>
                <span className="inline-block bg-gray-200 rounded-full w-2/3 h-5 my-auto">
                  &nbsp;
                </span>
              </td>
          }
        })}

        {/* Action Column */}
        {actions && <>
          <td className={'px-3 py-3.5 text-center'}>
            <span className="inline-block bg-gray-200 rounded-md w-3 h-5">
              &nbsp;
            </span>
          </td>
        </>}

      </tr>
    ))}
  </>
}
