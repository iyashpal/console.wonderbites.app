import Icons from '~/helpers/icons'
import {useSelector} from "@/store/hooks";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {DateTime} from "luxon";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function Dashboard() {
  const {user} = useSelector(state => state.authSlice)
  const [hour, setHour] = useState<number>(0)

  useEffect(() => {
    setHour(DateTime.local().hour)
  }, [])

  function greeting() {
    if (hour > 16) {
      return 'Good Evening'
    }

    if (hour > 11) {
      return 'Good Afternoon'
    }
    return 'Good Morning'
  }

  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Dashboard'}]}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div>
            <h2 className={`text-2xl font-bold text-red-primary`}>
              {greeting()}
            </h2>
            <p className={`mt-1`}>Welcome Back <span className='font-semibold'>{user.id ? user.name : 'User'}</span></p>
          </div>
          <div className={`grid grid-cols-4 gap-4 sm:gap-6 mt-5`}>
            <div className="h-40 rounded-md shadow-md relative bg-white text-gray-400 flex items-center justify-center">
              Coming soon...
            </div>
            <div className="h-40 rounded-md shadow-md relative bg-white text-gray-400 flex items-center justify-center">
              Coming soon...
            </div>
            <div className="h-40 rounded-md shadow-md relative bg-white text-gray-400 flex items-center justify-center">
              Coming soon...
            </div>
            <div className="h-40 rounded-md shadow-md relative bg-white text-gray-400 flex items-center justify-center">
              Coming soon...
            </div>
          </div>
          <div className={`grid grid-cols-4 gap-4 sm:gap-6 mt-5`}>
            <div className="col-span-3 space-y-4 sm:space-y-6">
              <div className={`rounded-md bg-white shadow-md relative p-4 sm:p-6`}>
                <div className="">
                  <h2 className={`text-lg font-semibold`}>Quick Features</h2>
                  <p className={`text-sm`}>Get Started</p>
                </div>
                <div className={`grid grid-cols-3 gap-4 pt-5`}>
                  <div className="flex items-center p-3 sm:p-4 group">
                    <div className="bg-red-primary p-3 sm:p-4 aspect-square rounded-full -m-3 sm:-m-4 z-10 text-white group-hover:bg-gray-600 transition ease-in-out duration-300">
                      <Icons.Outline.BookOpen className={`h-6 w-6`}/>
                    </div>
                    <Link to={`/app/cuisines`} className={`flex-auto border border-red-primary rounded-r-full p-3 text-center font-bold text-sm group-hover:border-gray-600 group-hover:text-gray-600 transition ease-in-out duration-300`}>
                      Manage Cuisines
                    </Link>
                  </div>
                  <div className="flex items-center p-3 sm:p-4 group">
                    <div className="bg-red-primary p-3 sm:p-4 aspect-square rounded-full -m-3 sm:-m-4 z-10 text-white group-hover:bg-gray-600 transition ease-in-out duration-300">
                      <Icons.Outline.Ticket className={`h-6 w-6`}/>
                    </div>
                    <Link to={``} className={`flex-auto border border-red-primary rounded-r-full p-3 text-center font-bold text-sm group-hover:border-gray-600 group-hover:text-gray-600 transition ease-in-out duration-300`}>
                      Add Coupon
                    </Link>
                  </div>
                  <div className="flex items-center p-3 sm:p-4 group">
                    <div className="bg-red-primary p-3 sm:p-4 aspect-square rounded-full -m-3 sm:-m-4 z-10 text-white group-hover:bg-gray-600 transition ease-in-out duration-300">
                      <Icons.Outline.CalendarDays className={`h-6 w-6`}/>
                    </div>
                    <Link to={``} className={`flex-auto border border-red-primary rounded-r-full p-3 text-center font-bold text-sm group-hover:border-gray-600 group-hover:text-gray-600 transition ease-in-out duration-300`}>
                      Add Reservation
                    </Link>
                  </div>
                  <div className="flex items-center p-3 sm:p-4 group">
                    <div className="bg-red-primary p-3 sm:p-4 aspect-square rounded-full -m-3 sm:-m-4 z-10 text-white group-hover:bg-gray-600 transition ease-in-out duration-300">
                      <Icons.Outline.User className={`h-6 w-6`}/>
                    </div>
                    <Link to={`/app/users/create`} className={`flex-auto border border-red-primary rounded-r-full p-3 text-center font-bold text-sm group-hover:border-gray-600 group-hover:text-gray-600 transition ease-in-out duration-300`}>
                      Add User
                    </Link>
                  </div>
                  <div className="flex items-center p-3 sm:p-4 group">
                    <div className="bg-red-primary p-3 sm:p-4 aspect-square rounded-full -m-3 sm:-m-4 z-10 text-white group-hover:bg-gray-600 transition ease-in-out duration-300">
                      <Icons.Iconoir.PageStar className={`h-6 w-6`}/>
                    </div>
                    <Link to={``} className={`flex-auto border border-red-primary rounded-r-full p-3 text-center font-bold text-sm group-hover:border-gray-600 group-hover:text-gray-600 transition ease-in-out duration-300`}>
                      Manage Reviews
                    </Link>
                  </div>
                  <div className="flex items-center p-3 sm:p-4 group">
                    <div className="bg-red-primary p-3 sm:p-4 aspect-square rounded-full -m-3 sm:-m-4 z-10 text-white group-hover:bg-gray-600 transition ease-in-out duration-300">
                      <Icons.Iconoir.BoxIso className={`h-6 w-6`}/>
                    </div>
                    <Link to={`/app/products/create`} className={`flex-auto border border-red-primary rounded-r-full p-3 text-center font-bold text-sm group-hover:border-gray-600 group-hover:text-gray-600 transition ease-in-out duration-300`}>
                      Add Product
                    </Link>
                  </div>
                </div>
              </div>
              <div className={`rounded-md bg-white shadow-md relative p-4 sm:p-6`}>
                <div className="">
                  <h2 className={`text-lg font-semibold`}>General Info</h2>
                  <p className={`text-sm`}>Statistics</p>
                </div>
                <div className="h-40 border-2 border-dashed rounded mt-5 text-gray-400 flex items-center justify-center">
                  Coming soon...
                </div>
              </div>
            </div>
            <div className="rounded-md bg-white shadow-md relative p-4 sm:p-6">
              <div className="">
                <h2 className={`text-lg font-semibold`}>Add Notification</h2>
                <p className={`text-sm`}>Quick action to add notification</p>
              </div>
              <div className="pt-5 space-y-5">
                <div className={`block`}>
                  <input className={`w-full placeholder:font-medium border border-gray-300 focus:border-red-primary focus:ring-red-primary`} type="text" placeholder={`Title`}/>
                </div>
                <div className={`block`}>
                  <textarea className={`w-full placeholder:font-medium border border-gray-300 focus:border-red-primary focus:ring-red-primary`} rows={13} placeholder={`Content`}></textarea>
                </div>
                <div className={`block`}>
                  <button className={`w-full inline-flex items-center justify-center border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}>Publish</button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 pt-5">
            <div className={`col-span-4 rounded-md bg-white shadow-md relative p-4 sm:p-6`}>
              <div className="">
                <h2 className={`text-lg font-semibold`}>Total Users</h2>
                <p className={`text-sm`}>All users on this site</p>
              </div>
              <div className="h-40 border-2 border-dashed rounded mt-5 text-gray-400 flex items-center justify-center">
                Coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}
