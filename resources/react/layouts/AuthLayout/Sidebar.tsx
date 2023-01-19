import {Fragment} from 'react';
import {Link, useMatches} from 'react-router-dom';
import {Dialog, Transition} from '@headlessui/react';
import {Vegan, BoxIso, PageStar, NumberedListLeft} from 'iconoir-react'
import {WonderPointsIcon, FeedbackIcon, DashboardIcon} from '~/components/icons'
import {
  BookOpenIcon, HomeIcon, UsersIcon, XMarkIcon, RectangleStackIcon, CogIcon, ChevronRightIcon,
  PhotoIcon, UserGroupIcon, ChatBubbleOvalLeftEllipsisIcon, TicketIcon, FolderIcon, DocumentTextIcon,
  CalendarDaysIcon, ClockIcon, ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

const navigation = [
  {name: 'Dashboard', href: '/app/dashboard', icon: DashboardIcon},
  {name: 'Users', href: '/app/users', icon: UsersIcon},
  {name: 'Categories', href: '/app/categories', icon: FolderIcon},
  {name: 'Reviews', href: '/app/reviews', icon: PageStar},
  {name: 'Ingredients', href: '/app/ingredients', icon: Vegan},
  {name: 'Cuisines', href: '/app/cuisines', icon: BookOpenIcon},
  {name: 'Subscriptions', href: '/app/subscriptions', icon: RectangleStackIcon},
  {name: 'Orders', href: '/app/orders', icon: NumberedListLeft},
  {name: 'Chat', href: '/app/chats', icon: ChatBubbleOvalLeftEllipsisIcon},
  {name: 'Products', href: '/app/products', icon: BoxIso},
  {name: 'Clients', href: '/app/clients', icon: UserGroupIcon},
  {name: 'Banners', href: '/app/banners', icon: PhotoIcon},
  {name: 'Pages', href: '/app/pages', icon: DocumentTextIcon},
  {name: 'Feedback', href: '/app/feedbacks', icon: FeedbackIcon},
  {name: 'Wonderpoints', href: '/app/wonderpoints', icon: WonderPointsIcon},
  {name: 'Coupons', href: '/app/coupons', icon: TicketIcon},
  {name: 'Reservations', href: '/app/reservations', icon: CalendarDaysIcon},
  {name: 'Waitlist', href: '/app/waitlist', icon: ClockIcon},
  {name: 'Settings', href: '/app/settings', icon: CogIcon},
]

export default function Sidebar({show, onToggleSidebar}: { show: boolean, onToggleSidebar: () => void }) {
  let matches = useMatches()

  function isMatchWithCurrent(uri) {
    return matches.some(({pathname}) => pathname === uri)
  }

  return <>
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-40 md:hidden" onClose={onToggleSidebar}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"/>
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button type="button" className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={onToggleSidebar}>
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                  </button>
                </div>
              </Transition.Child>
              <div className="flex flex-shrink-0 items-center px-4 font-bold uppercase">
                Management Console
              </div>
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="space-y-1">
                  <a onClick={onToggleSidebar} target={'_blank'} href={'https://next.wonderbites.app'} className={'text-slate-900 hover:text-red-primary group flex items-center justify-between px-4 py-2 text-base font-medium gap-x-2'}>
                    <span className={'inline-flex items-center gap-x-2'}>
                      <HomeIcon className={'flex-shrink-0 h-4 w-4'} aria-hidden="true"/>
                      Visit Site
                    </span>
                    <ArrowTopRightOnSquareIcon className={'w-4 h-4'} aria-hidden="true"/>
                  </a>
                  {navigation.map((item) => (
                    <Link onClick={onToggleSidebar} key={item.name} to={item.href} className={[isMatchWithCurrent(item.href) ? 'bg-red-primary text-white' : 'text-slate-900 hover:bg-red-primary hover:text-white', 'group flex items-center justify-between px-4 py-2 text-base font-medium gap-x-2'].join(' ')}>
                      <span className={'inline-flex items-center gap-x-2'} aria-hidden="true">
                        <item.icon className={[isMatchWithCurrent(item.href) ? 'text-white' : 'text-slate-900 group-hover:text-white', 'flex-shrink-0 h-4 w-4'].join(' ')} aria-hidden="true"/>
                        {item.name}
                      </span>
                      <ChevronRightIcon className={'w-4 h-4'}/>
                    </Link>
                  ))}
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </Dialog>
    </Transition.Root>

    {/* Static sidebar for desktop */}
    <div className="hidden md:flex md:flex-col md:w-64 shadow-md border-2 border-slate-100 z-10">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex min-h-0 flex-1 flex-col bg-white">
        <div className="flex flex-1 flex-col max-h-content overflow-y-auto">
          <nav className="flex-1 space-y-1 py-4">
            <a onClick={onToggleSidebar} target={'_blank'} href={'https://next.wonderbites.app'} className={'text-slate-900 hover:text-red-primary group flex items-center justify-between pl-3 sm:pl-6 pr-2 sm:pr-4 py-2 text-sm font-medium gap-x-2'}>
              <span className={'inline-flex items-center gap-x-2'}>
                <HomeIcon className={'h-4 w-4'}/>
                Visit Site
              </span>
              <ArrowTopRightOnSquareIcon className={'w-4 h-4'}/>
            </a>
            {navigation.map((item) => (
              <Link onClick={onToggleSidebar} key={item.name} to={item.href} className={[isMatchWithCurrent(item.href) ? 'bg-red-primary text-white' : 'text-slate-900 hover:bg-red-primary hover:text-white', 'group flex items-center justify-between pl-4 sm:pl-6 pr-2 sm:pr-4 py-2 text-sm font-medium gap-x-2'].join(' ')}>
                <span className={'inline-flex gap-x-2 items-center'}>
                  <item.icon className={[isMatchWithCurrent(item.href) ? 'text-white' : 'text-slate-900 group-hover:text-white', 'flex-shrink-0 h-4 w-4'].join(' ')} aria-hidden="true"/>
                  {item.name}
                </span>
                <ChevronRightIcon className={'w-4 h-4'}/>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  </>
}
