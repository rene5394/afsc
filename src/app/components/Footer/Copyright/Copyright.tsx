import React from 'react'
import MenuCopyright from '@/app/components/Footer/Copyright/CopyrightMenu'
import IconsCopyright from '@/app/components/Footer/Copyright/CopyrightIcons'

const Copyright: React.FC = () => {
  return (
    <div className='bg-black'>
      <div className='flex justify-between px-[30px] py-4'>
        <div>
          <p className='text-[15px] text-white text-opacity-50'>©AFSC 2024</p>
          <MenuCopyright />
        </div>
        <div>
          <IconsCopyright />
        </div>
      </div>
    </div>
  )
}

export default Copyright
