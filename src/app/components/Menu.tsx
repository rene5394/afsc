'use client'

import React, { useState } from 'react'

const Menu: React.FC = () => {
  const [issuesClicked, setIssuesClicked] = useState<boolean>(false)
  const [topicClicked, setTopicClicked] = useState<boolean>(false)

  const handleIssuesClick = () => {
    setIssuesClicked(!issuesClicked)
  }

  const handleTopicClick = () => {
    setTopicClicked(!topicClicked)
  }

  const handleOurWorkMouseLeave = () => {
    setIssuesClicked(false)
  }

  const handleNewsMouseLeave = () => {
    setTopicClicked(false)
  }

  return (
    <nav className='main-nav'>
      <ul className='menu flex justify-end'>
        <li className='group relative cursor-pointer px-3.5'>
          <a
            className='flex menu-hover pt-[18px] pb-[18px]'
            href='https://afsc.org/our-work'
            onMouseLeave={handleOurWorkMouseLeave}
          >
            <span>OUR WORK</span>
          </a>
          <div className='w-[320px] bg-white border-gray-300 border-[1px] invisible absolute left-[-16px] z-50 py-5 px-4 group-hover:visible'>
            <ul>
              <li className='group/item'>
                <a
                  className='flex px-8 py-1'
                  href='https://afsc.org/strategic-goals'
                >
                  <span className='group-hover/item:underline'>
                    STRATEGIC GOALS
                  </span>
                </a>
              </li>
              <li className='group/item'>
                <a className='flex px-8 py-1' href='https://afsc.org/programs'>
                  <span className='group-hover/item:underline'>PROGRAMS</span>
                </a>
              </li>
              <li className='group/item'>
                <a className='flex px-8 py-1' onClick={handleIssuesClick}>
                  <span
                    className={`group-hover/item:underline subitem-submenu-icon ${
                      issuesClicked ? 'active' : ''
                    }`}
                  >
                    ISSUES
                  </span>
                </a>
                <div className={`mt-2 ${issuesClicked ? 'block' : 'hidden'}`}>
                  <ul>
                    <li className='group/subitem'>
                      <a className='flex px-8 py-1'>
                        <span className='group-hover/subitem:underline'>
                          ECONOMIC JUSTICE
                        </span>
                      </a>
                    </li>
                    <li className='group/subitem'>
                      <a className='flex px-8 py-1'>
                        <span className='group-hover/subitem:underline'>
                          GLOBAL PEACE
                        </span>
                      </a>
                    </li>
                    <li className='group/subitem'>
                      <a className='flex px-8 py-1'>
                        <span className='group-hover/subitem:underline'>
                          MIGRATION & IMMIGRANT RIGHTS
                        </span>
                      </a>
                    </li>
                    <li className='group/subitem'>
                      <a className='flex px-8 py-1'>
                        <span className='group-hover/subitem:underline'>
                          PRISONS & POLICING
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className='group relative cursor-pointer px-3.5'>
          <a
            className='flex menu-hover pt-[18px] pb-[18px]'
            href='https://afsc.org/about'
          >
            <span>ABOUT</span>
          </a>
          <div className='w-[320px] bg-white border-gray-300 border-[1px] invisible absolute left-[-16px] z-50 py-5 px-4 group-hover:visible'>
            <ul>
              <li className='group/item'>
                <a className='flex px-8 py-1' href='https://afsc.org/our-team'>
                  <span className='group-hover/item:underline'>TEAM</span>
                </a>
              </li>
              <li className='group/item'>
                <a className='flex px-8 py-1' href='https://afsc.org/careers'>
                  <span className='group-hover/item:underline'>CAREERS</span>
                </a>
              </li>
              <li className='group/item'>
                <a className='flex px-8 py-1' href='https://afsc.org/history'>
                  <span className='group-hover/item:underline'>HISTORY</span>
                </a>
              </li>
              <li className='group/item'>
                <a className='flex px-8 py-1' href='https://afsc.org/archives'>
                  <span className='group-hover/item:underline'>ARCHIVES</span>
                </a>
              </li>
              <li className='group/item'>
                <a
                  className='flex px-8 py-1'
                  href='https://afsc.org/reports-financials'
                >
                  <span className='group-hover/item:underline'>
                    REPORTS &amp; FINANCIALS
                  </span>
                </a>
              </li>
              <li className='group/item'>
                <a
                  className='flex px-8 py-1'
                  href='https://afsc.org/afsc-office-directory'
                >
                  <span className='group-hover/item:underline'>
                    OFFICE DIRECTORY
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li className='group relative cursor-pointer px-3.5'>
          <a
            className='flex menu-hover pt-[18px] pb-[18px]'
            href='https://afsc.org/news'
            onMouseLeave={handleNewsMouseLeave}
          >
            <span>NEWS</span>
          </a>
          <div className='w-[320px] bg-white border-gray-300 border-[1px] invisible absolute left-[-16px] z-50 py-5 px-4 group-hover:visible'>
            <ul>
              <li className='group/item'>
                <a className='flex px-8 py-1' href='https://afsc.org/newsroom'>
                  <span className='group-hover/item:underline'>
                    PRESS RELEASES
                  </span>
                </a>
              </li>
              <li className='group/item'>
                <a className='flex px-8 py-1' onClick={handleTopicClick}>
                  <span
                    className={`group-hover/item:underline subitem-submenu-icon ${
                      topicClicked ? 'active' : ''
                    }`}
                  >
                    TOPICS
                  </span>
                </a>
                <div className={`mt-2 ${topicClicked ? 'block' : 'hidden'}`}>
                  <ul>
                    <li className='group/subitem'>
                      <a className='flex px-8 py-1'>
                        <span className='group-hover/subitem:underline'>
                          GAZA & ISRAEL
                        </span>
                      </a>
                    </li>
                    <li className='group/subitem'>
                      <a className='flex px-8 py-1'>
                        <span className='group-hover/subitem:underline'>
                          SUDAN
                        </span>
                      </a>
                    </li>
                    <li className='group/subitem'>
                      <a className='flex px-8 py-1'>
                        <span className='group-hover/subitem:underline'>
                          STOP COP CITY
                        </span>
                      </a>
                    </li>
                    <li className='group/subitem'>
                      <a className='flex px-8 py-1'>
                        <span className='group-hover/subitem:underline'>
                          CLIMATE JUSTICE
                        </span>
                      </a>
                    </li>
                    <li className='group/subitem'>
                      <a className='flex px-8 py-1'>
                        <span className='group-hover/subitem:underline'>
                          MIGRANT RIGHTS
                        </span>
                      </a>
                    </li>
                    <li className='group/subitem'>
                      <a className='flex px-8 py-1'>
                        <span className='group-hover/subitem:underline'>
                          HUMANITARIAN RELIEF
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className='group relative cursor-pointer pl-3.5 pr-8'>
          <a
            className='flex menu-hover pt-[18px] pb-[18px]'
            href='https://afsc.org/get-involved'
          >
            <span>GET INVOLVED</span>
          </a>
          <div className='w-[285px] bg-white border-gray-300 border-[1px] invisible absolute left-[-16px] z-50 py-5 px-4 group-hover:visible'>
            <ul>
              <li className='group/item'>
                <a
                  className='flex px-8 py-1'
                  href='https://afsc.org/take-action'
                >
                  <span className='group-hover/item:underline'>
                    TAKE ACTION
                  </span>
                </a>
              </li>
              <li className='group/item'>
                <a className='flex px-8 py-1' href='https://afsc.org/events'>
                  <span className='group-hover/item:underline'>EVENTS</span>
                </a>
              </li>
              <li className='group/item'>
                <a
                  className='flex px-8 py-1'
                  href='https://afsc.org/friends-engage'
                >
                  <span className='group-hover/item:underline'>
                    FRIENDS ENGAGE
                  </span>
                </a>
              </li>
              <li className='group/item'>
                <a className='flex px-8 py-1' href='https://afsc.org/subscribe'>
                  <span className='group-hover/item:underline'>SUBSCRIBE</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default Menu
