'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <aside className='w-64 bg-gray-100 p-4 h-full flex flex-col'>
      <img
        className='hidden lg:block max-w-[150px] mb-8'
        src='https://afsc.org/sites/default/files/2022-08/logo.svg'
        alt='AFSC Logo'
      />
      <img
        className='block lg:hidden h-[55px] my-[1px]'
        src='https://afsc.org/sites/default/files/2022-08/logo-compressed.svg'
        alt='AFSC Logo Mobile'
      />

      <nav>
        <ul className='space-y-2'>
          <li>
            <Link
              href='/admin'
              className={`block px-2 py-1 rounded hover:text-red-600 ${
                isActive('/admin')
                  ? 'font-semibold text-red-600'
                  : 'text-gray-700'
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href='/admin/tags'
              className={`block px-2 py-1 rounded hover:text-red-600 ${
                isActive('/admin/tags')
                  ? 'font-semibold text-red-600'
                  : 'text-gray-600'
              }`}
            >
              Tags
            </Link>
          </li>
          <li>
            <Link
              href='/admin/profiles'
              className={`block px-2 py-1 rounded hover:text-red-600 ${
                isActive('/admin/profiles')
                  ? 'font-semibold text-red-700'
                  : 'text-gray-700'
              }`}
            >
              Profiles
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
