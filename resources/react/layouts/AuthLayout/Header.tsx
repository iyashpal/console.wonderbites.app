import {Fragment} from "react";
import {useAuth} from "@/hooks";
import {Link, useNavigate} from "react-router-dom";
import {Menu, Popover, Transition} from "@headlessui/react";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import {Bars3CenterLeftIcon, BellIcon, EnvelopeIcon} from "@heroicons/react/24/outline";

export default function Header({onToggleSidebar}: { onToggleSidebar: () => void }) {
  const auth = useAuth()
  const navigateTo = useNavigate()

  function logout() {
    auth.logout().then(() => {
      navigateTo('/')
    })
  }
  return <>
    {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
    <Popover as="header" className={({open}) => [open && 'fixed inset-0 z-40 overflow-y-auto', 'bg-white shadow-md lg:static lg:overflow-y-visible'].join(' ')}>
      {() => (
        <>
          <div className="mx-auto px-3 sm:px-6 py-4">
            <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
              <div className="flex xl:col-span-2">
                <div className="flex flex-shrink-0 items-center gap-2">
                  <button onClick={onToggleSidebar} className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-primary">
                    <span className="sr-only">Open menu</span>
                    <Bars3CenterLeftIcon className="block h-6 w-6" aria-hidden="true"/>
                  </button>

                  <Link to="/app/dashboard" className={'uppercase font-bold'}>
                    <span className={'hidden sm:block'}>Management Console</span>
                    <span className={'sm:hidden'}>WMC</span>
                  </Link>

                </div>
              </div>
              <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6 hidden lg:block">
                <div className="flex items-center px-6  md:mx-auto md:max-w-3xl lg:mx-0 xl:px-0">
                  <div className="">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                      </div>
                      <input id="search" name="search" className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-red-primary focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-primary sm:text-sm" placeholder="Search" type="search"/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end xl:col-span-4 bg-white gap-3">
                <button className="flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
                  <span className="sr-only">View messages</span>
                  <EnvelopeIcon className="h-6 w-6" aria-hidden="true"/>
                </button>
                <button className="flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true"/>
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative flex-shrink-0">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-red-primary focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img className="h-8 w-8 rounded-full" src={auth.user('avatar_url')} alt={auth.user('name')}/>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({active}) => (
                          <Link to={'/app/dashboard'} className={[active && 'bg-gray-100', 'block py-2 px-4 text-sm text-gray-700'].join(' ')}>
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({active}) => (
                          <button onClick={logout} className={[active && 'bg-gray-100', 'block w-full text-left py-2 px-4 text-sm text-gray-700'].join(' ')}>
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Popover>
  </>
}
