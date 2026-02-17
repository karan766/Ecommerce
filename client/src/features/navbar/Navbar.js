

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectItems } from "../cart/cartSlice";
import { selectUserInfo } from "../user/userSlice";

const navigation = [
  { name: "Products", link: "/", role: "user" },
  { name: "Products", link: "/admin", role: "admin" },
  { name: "Orders", link: "/admin/orders", role: "admin" },
];
const userNavigation = [
  { name: "My Profile", link: "/profile" },
  { name: "My Orders", link: "/orders" },
  { name: "Sign out", link: "/logout" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavBar({ children }) {
  const items = useSelector(selectItems);
  const userInfo = useSelector(selectUserInfo);

  return userInfo && (
    <div>
      <Disclosure as="nav" className="bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 sticky z-10 top-0 shadow-md">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link to="/">
                      <img
                        className="h-10 w-16 shadow-md hover:scale-105 transition-transform"
                        src="../../../logo.png"
                        alt="Your Company"
                      />
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map(
                        (item, index) =>
                          item.role === userInfo.role && (
                            <Link
                              key={index}
                              to={item.link}
                              className={classNames(
                                "text-gray-800 hover:bg-gray-300 hover:text-gray-900 transition ease-in-out duration-300 rounded-md px-3 py-2 text-sm font-medium"
                              )}
                            >
                              {item.name}
                            </Link>
                          )
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <Link to="/cart">
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-300 p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
                      >
                        <ShoppingCartIcon
                          className="h-8 w-8"
                          aria-hidden="true"
                        />
                        {items.length > 0 && (
                          <span className="absolute top-0 right-0 inline-flex items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white px-2 py-1">
                            {items.length}
                          </span>
                        )}
                      </button>
                    </Link>
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex items-center rounded-full bg-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full ring-2 ring-gray-400"
                            src={userInfo.imageUrl || "../../../user.png"}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  to={item.link}
                                  className={classNames(
                                    active ? "bg-gray-200 text-gray-800" : "text-gray-700",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-300 p-2 text-gray-700 hover:bg-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map(
                  (item, index) =>
                    item.role === userInfo.role && (
                      <Link
                        key={index}
                        to={item.link}
                        className={classNames(
                          "block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-400 hover:text-gray-900"
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                )}
              </div>
              <div className="border-t border-gray-400 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={userInfo.imageUrl}
                    alt=""
                  />
                  <div className="ml-3 w-full">
                    <div className="text-base font-medium leading-none text-gray-800 my-2">
                      {userInfo.name}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-600">
                      {userInfo.email}
                    </div>
                  </div>
                  <Link to="/cart">
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-gray-300 p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                      <ShoppingCartIcon className="h-8 w-8" aria-hidden="true" />
                    </button>
                  </Link>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.link}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-400 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <header className="bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome to  E-Cart Store!
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

export default NavBar;
