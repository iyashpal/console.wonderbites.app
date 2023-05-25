import React from 'react'
import Icons from '@/helpers/icons'
import { Menu } from '@headlessui/react'

type ActionProps = {
    as?: React.ElementType,
    button?: React.ReactNode,
    children: (item: typeof Menu.Item, style: { iconClassNames: string, itemClassNames: string }) => React.ReactNode | React.ReactNode[]
}
export default function RowActions({ as = 'div', button, children }: ActionProps) {
    return (
        <Menu as={as} className={'inline-flex items-center relative'}>
            <Menu.Button>
                {button ?? <Icons.Solid.EllipsisVertical className='h-6 text-gray-500 hover:text-gray-700' />}
            </Menu.Button>
            <Menu.Items as={'div'} className={'absolute -top-1.5 -right-3 py-2 bg-white px-3 shadow rounded-md overflow-hidden'}>
                <div className="flex items-center divide-x divide-gray-300">
                    <div className='flex items-center gap-x-3 pr-1.5'>
                        {children(Menu.Item, { iconClassNames: 'h-6 w-6', itemClassNames: 'transition-colors ease-in-out duration-200' })}
                    </div>
                    <div className='pl-1.5 flex items-center justify-center'>
                        <Menu.Item as={'button'} title='Close' className={'text-gray-500 hover:text-gray-700 transition-colors ease-in-out duration-200'}>
                            <Icons.Solid.XMark className='h-6 w-6' />
                        </Menu.Item>
                    </div>
                </div>
            </Menu.Items>
        </Menu>
    )
}
