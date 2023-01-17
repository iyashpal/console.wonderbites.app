import {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {ChatBubbleBottomCenterTextIcon, BookOpenIcon, HomeIcon, QueueListIcon, UsersIcon, XMarkIcon, RectangleGroupIcon, RectangleStackIcon} from "@heroicons/react/24/outline";

const navigation = [
  {name: 'View Site', href: '#', icon: HomeIcon, current: false},
  {name: 'Dashboard', href: '#', icon: RectangleGroupIcon, current: true},
  {name: 'Users', href: '#', icon: UsersIcon, current: false},
  {name: 'Reviews', href: '#', icon: ChatBubbleBottomCenterTextIcon, current: false},
  {name: 'Cuisines', href: '#', icon: BookOpenIcon, current: false},
  {name: 'Subscriptions', href: '#', icon: RectangleStackIcon, current: false},
  {name: 'Orders', href: '#', icon: QueueListIcon, current: false},
]

export default function Sidebar({show, onToggleSidebar}: { show: boolean, onToggleSidebar: () => void }) {

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
                <nav className="space-y-1 px-2">
                  {navigation.map((item) => (
                    <a key={item.name} href={item.href} className={[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'group flex items-center px-2 py-2 text-base font-medium rounded-md'].join(' ')}>
                      <item.icon className={[item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300', 'mr-4 flex-shrink-0 h-6 w-6'].join(' ')} aria-hidden="true"/>
                      {item.name}
                    </a>
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
    <div className="hidden md:flex md:flex-col md:w-64 shadow-md border-2 border-slate-100">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex min-h-0 flex-1 flex-col bg-white">
        <div className="flex flex-1 flex-col max-h-content overflow-y-auto">
          <nav className="flex-1 space-y-1 py-4">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className={[item.current ? 'bg-red-primary text-white' : 'text-slate-900 hover:bg-red-primary hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium gap-x-2'].join(' ')}>
                <item.icon className={[item.current ? 'text-white' : ' group-hover:text-white', 'text-slate-600 mr-3 flex-shrink-0 h-6 w-6'].join('')} aria-hidden="true"/>
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  </>
}
