import React from 'react'

const CopyrightMenu: React.FC = () => {
  return (
    <nav id='copyright-menu' className='flex mt-3'>
      <ul className='menu flex justify-start text-base text-white text-opacity-50'>
        <li className='group relative cursor-pointer pr-1.5'>
          <a
            className='flex'
            href='https://afsc.org/our-work'
          >
            <span>PRIVACY POLICY</span>
          </a>
        </li>
        |
        <li className='group relative cursor-pointer px-1.5'>
          <a
            className='flex'
            href='https://afsc.org/our-work'
          >
            <span>ITES CREDIT</span>
          </a>
        </li>
        |
        <li className='group relative cursor-pointer px-1.5'>
          <a
            className='flex'
            href='https://afsc.org/our-work'
          >
            <span>CREATIVE COMMON LICENSE</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default CopyrightMenu
