import React, { useState } from 'react'

interface MenuItem {
  label: string
  href?: string
  target?: '_blank'
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    label: 'OUR WORK',
    href: 'https://afsc.org/our-work',
    children: [
      { label: 'STRATEGIC GOALS', href: 'https://afsc.org/strategic-goals' },
      { label: 'PROGRAMS', href: '/programs' },
      {
        label: 'ISSUES',
        children: [
          { label: 'ECONOMIC JUSTICE', href: '/issue/economic-justice' },
          { label: 'GLOBAL PEACE', href: '/issue/global-peace' },
          {
            label: 'MIGRATION & IMMIGRANT RIGHTS',
            href: '/issue/migration-immigrant-rights',
          },
          { label: 'PRISONS & POLICING', href: '/issue/prisons-policing' },
        ],
      },
    ],
  },
  {
    label: 'ABOUT',
    href: '/about',
    children: [
      { label: 'TEAM', href: 'https://afsc.org/our-team' },
      { label: 'CAREERS', href: 'https://afsc.org/careers' },
      { label: 'HISTORY', href: 'https://afsc.org/history' },
      { label: 'ARCHIVES', href: 'https://afsc.org/archives' },
      {
        label: 'REPORTS & FINANCIALS',
        href: 'https://afsc.org/reports-financials',
      },
      {
        label: 'OFFICE DIRECTORY',
        href: 'https://afsc.org/afsc-office-directory',
      },
    ],
  },
  {
    label: 'NEWS',
    href: 'https://afsc.org/news',
    children: [
      { label: 'PRESS RELEASES', href: 'https://afsc.org/newsroom' },
      {
        label: 'TOPICS',
        children: [
          { label: 'GAZA & ISRAEL', href: '/crisis-gaza' },
          { label: 'SUDAN', href: '/topics/sudan' },
          { label: 'STOP COP CITY', href: '/stop-cop-city-campaign' },
          { label: 'CLIMATE JUSTICE', href: '/topics/climate-justice' },
          { label: 'MIGRANT RIGHTS', href: '/topics/migrant-rights' },
          { label: 'HUMANITARIAN RELIEF', href: '/topics/humanitarian-relief' },
        ],
      },
    ],
  },
  {
    label: 'GET INVOLVED',
    href: 'https://afsc.org/get-involved',
    children: [
      { label: 'TAKE ACTION', href: 'https://afsc.org/take-action' },
      { label: 'EVENTS', href: 'https://afsc.org/events' },
      { label: 'FRIENDS ENGAGE', href: 'https://afsc.org/friends-engage' },
      { label: 'SUBSCRIBE', href: 'https://afsc.org/subscribe' },
    ],
  },
  {
    label: 'DONATE',
    href: 'https://secure.afsc.org/a/24rr_d?ms=WEB25NV',
    target: '_blank',
    children: [
      {
        label: 'Give Once',
        href: 'https://secure.afsc.org/a/25fm_nd?ms=WEB25SN0001FM',
        target: '_blank',
      },
      {
        label: 'Give Monthly',
        href: 'https://secure.afsc.org/a/build-peace-justice-4?ms=WEB25SN',
        target: '_blank',
      },
      { label: 'More Ways to Give', href: '/give' },
    ],
  },
]

const MobileMenu: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const toggleSubmenu = (label: string) => {
    setActiveItem((prev) => (prev === label ? null : label))
  }

  return (
    <nav
      id='mobileMenu'
      className='absolute top-[65px] left-0 w-full bg-white shadow-lg z-[9999]'
    >
      <ul className='flex flex-col'>
        {menuItems.map((item) => (
          <li key={item.label} className='border-gray-300 border-[1px] px-6'>
            <div className='flex justify-between items-center'>
              <a
                href={item.href}
                target={item.target}
                className='font-medium text-gray-800 hover:text-red-600 py-4'
              >
                <span className='text-[40px]'>{item.label}</span>
              </a>
              {item.children && (
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className='text-gray-600 hover:text-red-600'
                >
                  {activeItem === item.label ? '-' : '+'}
                </button>
              )}
            </div>
            {item.children && activeItem === item.label && (
              <ul className='space-y-1 pb-4'>
                {item.children.map((child) =>
                  child.children ? (
                    <li key={child.label}>
                      <div className='flex justify-between items-center'>
                        <a
                          href={child.href}
                          className='text-sm text-gray-700 hover:text-red-600'
                        >
                          <span>{child.label}</span>
                        </a>
                        <button
                          onClick={() => toggleSubmenu(child.label)}
                          className='text-gray-600 hover:text-red-600'
                        >
                          {activeItem === child.label ? '-' : '+'}
                        </button>
                      </div>
                      {child.children && activeItem === child.label && (
                        <ul className='mt-2 space-y-1 pl-4'>
                          {child.children.map((subChild) => (
                            <li key={subChild.label}>
                              <a
                                href={subChild.href}
                                className='text-sm text-gray-600 hover:text-red-600'
                              >
                                <span>{subChild.label}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={child.label}>
                      <a
                        href={child.href}
                        className='text-sm text-gray-700 hover:text-red-600'
                      >
                        <span>{child.label}</span>
                      </a>
                    </li>
                  )
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MobileMenu
