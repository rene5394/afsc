import React from 'react'

const Widget3: React.FC = () => {
  return (
    <div className='md:w-1/4'>
      <nav className='flex flex-col'>
        <ul className='menu flex flex-col justify-start text-base text-white text-opacity-50'>
          <li className='group relative cursor-pointer px-1.5 mb-1'>
            <a className='flex' href='https://afsc.org/news'>
              <span>NEWS</span>
            </a>
          </li>
          <li className='group relative cursor-pointer px-1.5 mb-1'>
            <a className='flex' href='https://afsc.org/get-involved'>
              <span>GET INVOLVED</span>
            </a>
          </li>
          <li className='group relative cursor-pointer px-1.5 mb-1'>
            <a
              className='flex'
              href='https://shop.worxprinting.coop/collections/afsc'
            >
              <span>AFSC STORE</span>
            </a>
          </li>
          <li className='group relative cursor-pointer px-1.5 mb-1'>
            <a className='flex' href='https://afsc.org/careers'>
              <span>CAREERS</span>
            </a>
          </li>
          <li className='group relative cursor-pointer px-1.5'>
            <a className='flex' href='https://afsc.org/contact-us'>
              <span>CONTACT US</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Widget3
