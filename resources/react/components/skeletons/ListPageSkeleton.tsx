import {useEffect, useState} from 'react';
import {BreadcrumbSkeleton} from '@/components/skeletons/index';

type Cell = {
  label: string,
  align?: 'left' | 'right' | 'center',

  type?: 'circle' | 'rectangle' | 'square' | 'text',

  width?: string
}

type SkeletonProps = {
  columns: Cell[], limit?: number, checkboxes?: boolean, actions?: boolean
}

export default function ListPageSkeleton({columns, limit = 10, checkboxes = true, actions = true}: SkeletonProps) {
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
    <div className="py-6">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <BreadcrumbSkeleton pages={[1, 2, 3]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">

        <div className={'border shadow-md divide-y'}>

          <div className={'p-4 flex justify-between items-center animate-pulse'}>
            <div className={'flex items-center gap-x-2'}>
              <div className={'p-4 w-40 bg-gray-200 rounded-md'}></div>
              <div className={'p-4 w-40 bg-gray-200 rounded-md'}></div>
            </div>
            <div className={'flex items-center gap-x-2'}>
              <div className={'p-4 w-28 bg-gray-200 rounded-md'}></div>
              <div className={'p-4 w-24 bg-gray-200 rounded-md'}></div>
              <div className={'p-4 w-24 bg-gray-200 rounded-md'}></div>
            </div>
          </div>
          <div className="">
            <table className={'table-auto w-full divide-y divide-gray-300 border'}>
              <thead className={'bg-gray-50'}>
              <tr>
                {/* Checkbox Column */}
                {checkboxes && <>
                  <th className={'px-3 py-3.5 w-10'}>
                    <span className="bg-gray-200 inline-block rounded-md h-4 w-4 animate-pulse">&nbsp;</span>
                  </th>
                </>}

                {/* Module Columns */}
                {columns.map((column, index) => {
                  let classes = ['px-3 py-3.5 uppercase font-semibold text-sm', column.width ?? '']

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

                  return (
                    <th key={index} className={classes.join(' ')}>
                      {column.label}
                    </th>
                  )
                })}

                {/* Action Column */}
                {actions && <>
                  <th className={'w-10 px-3 py-3.5 text-center uppercase font-semibold text-sm'}>
                    Action
                  </th>
                </>}

              </tr>
              </thead>

              <tbody className={'animate-pulse divide-y divide-gray-200 bg-white'}>

              {rows.map((row, index) => (
                <tr key={index}>
                  {/* Checkbox Column */}
                  {checkboxes && <>
                    <td className={'px-3 py-3.5'}>
                      <span className="bg-gray-200 inline-block rounded-md h-4 w-4">
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
                          <span className="inline-block bg-gray-200 rounded-full w-2/3 h-4 my-auto">
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

              </tbody>
            </table>
          </div>

          <div className={'px-4 sm:px-6 md:px-8 py-4 shadow border flex items-center justify-between animate-pulse'}>
            <div className={'h-4 bg-gray-200 w-40 rounded-lg'}></div>
            <div className={'flex items-center justify-end gap-x-3'}>
              <span className={'rounded-full bg-gray-200 p-4'}></span>
              <span className="isolate inline-flex rounded-full shadow-sm overflow-hidden bg-gray-200">
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
                  <span className="rounded-full p-4"></span>
              </span>
              <span className={'rounded-full bg-gray-200 p-4'}></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  </>
}
