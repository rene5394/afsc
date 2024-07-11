import React from 'react'
import Menu from '@/app/components/Menu'
import DonateMenu from './DonateMenu'

const Header: React.FC = () => {
  return (
    <header>
      <div className='flex'>
        <div className='flex-none w-[210px] px-[30px] py-4'>
          <img
            src='https://afsc.org/sites/default/files/2022-08/logo.svg'
            alt='AFSC Logo'
          />
        </div>
        <div className='flex-auto border-l-gray-300 border-l-[1px]'>
          <div className='flex pl-[30px] pt-[14px] pb-[14px] border-b-gray-300 border-b-[1px]'>
            <p>Quaker action for a just world</p>
          </div>
          <div className='flex'>
            <div className='flex-1 pl-[30px]'>
              <Menu />
            </div>
            <div className='flex-none w-[115px]'>
              <DonateMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
