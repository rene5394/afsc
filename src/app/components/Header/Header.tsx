'use client'

import React, { useState } from 'react'
import MainMenu from '@/app/components/Header/MainMenu'
import DonateMenu from '@/app/components/Header/DonateMenu'
import MobileMenu from '@/app/components/Header/MobileMenu'

interface HeaderProps {
  showBottomBorder?: boolean
}

const Header: React.FC<HeaderProps> = ({ showBottomBorder = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    console.log('JAJAJA', isMobileMenuOpen)
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header
      className={`${
        showBottomBorder ? 'border-b-gray-300 border-b-[1px]' : ''
      }`}
    >
      <div className='flex'>
        <div className='flex-none w-[210px] px-[15px] py-1 lg:px-[30px] lg:py-4'>
          <img
            className='hidden lg:block'
            src='https://afsc.org/sites/default/files/2022-08/logo.svg'
            alt='AFSC Logo'
          />
          <img
            className='block lg:hidden h-[55px] my-[1px]'
            src='https://afsc.org/sites/default/files/2022-08/logo-compressed.svg'
            alt='AFSC Logo Mobile'
          />
        </div>
        <div className='hidden lg:block lg:flex-auto border-l-gray-300 border-l-[1px]'>
          <div className='flex pl-[30px] pt-[14px] pb-[14px] border-b-gray-300 border-b-[1px]'>
            <p>Quaker action for a just world</p>
          </div>
          <div className='flex'>
            <div className='flex-1 pl-[30px]'>
              <MainMenu />
            </div>
            <div className='flex-none'>
              <DonateMenu />
            </div>
          </div>
        </div>
        <button
          className='block lg:hidden bg-red-600 px-[15px] ml-auto'
          onClick={toggleMobileMenu}
          aria-label='Toggle menu'
        >
          <div>
            <span className='block w-[36px] h-[1px] bg-white my-[6px]'></span>
            <span className='block w-[36px] h-[1px] bg-white my-[6px]'></span>
            <span className='block w-[36px] h-[1px] bg-white my-[6px]'></span>
          </div>
        </button>
        {isMobileMenuOpen && (
          <div className='lg:hidden border-t-gray-300 border-t-[1px] bg-white'>
            <MobileMenu />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
