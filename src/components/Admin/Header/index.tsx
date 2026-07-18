import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useEffect, useState } from "react";


const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  isAuthenticated: boolean;  // Add isAuthenticated prop to check if user is logged in

}) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    uniqueVisitors: 0,
    customerOrders: 0,
  });


  useEffect(() => {
    if (props.isAuthenticated) {  // Check if user is logged in

      const fetchStats = async () => {
        try {

          const response = await fetch(`/api/stats`);  // ✅ Fixed API call
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          } else {
            console.error("Failed to fetch stats");
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };

      fetchStats();
    }
  }, []);

  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-4 py-5 shadow-2 md:px-5 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-dark-3 dark:bg-dark-2 lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!w-full delay-300"
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "delay-400 !w-full"
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!w-full delay-500"
                    }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-dark delay-300 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!h-0 !delay-[0]"
                    }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-dark duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!h-0 !delay-200"
                    }`}
                ></span>
              </span>
            </span>
          </button>

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              width={32}
              height={32}
              src={"/images/logo/Logo.png"}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Stats Section */}
        <div className="hidden lg:flex items-center gap-8 w-full justify-between">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-700 dark:text-white">Total Users</h3>
              <p className="text-2xl font-semibold">{stats.totalUsers}</p>
            </div>

            <div className="p-4 bg-green-100 dark:bg-green-800 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-green-700 dark:text-white">Total Orders</h3>
              <p className="text-2xl font-semibold">{stats.totalOrders}</p>
            </div>

            <div className="p-4 bg-yellow-100 dark:bg-yellow-800 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-yellow-700 dark:text-white">Unique Visitors</h3>
              <p className="text-2xl font-semibold">{stats.uniqueVisitors}</p>
            </div>

            <div className="p-4 bg-red-100 dark:bg-red-800 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-red-700 dark:text-white">Confirmed Orders</h3>
              <p className="text-2xl font-semibold">{stats.customerOrders}</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-8 ml-10">
          <ul className="flex items-center gap-4">
            <DarkModeSwitcher />
            <DropdownNotification />
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
