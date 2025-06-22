import React from 'react';
import { Menu } from '@headlessui/react';
import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="flex items-center justify-between bg-white h-16 px-6 border-b border-gray-200">
      <div />

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-1 right-1 block h-2 w-2 bg-green-500 rounded-full" />
        </button>

        {session?.user && (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex items-center text-gray-800 font-medium hover:text-gray-900 transition">
              {session.user.name
                ?.split(' ')
                .map(n => n[0])
                .join('')}
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => signOut()}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        )}
      </div>
    </header>
  );
}
