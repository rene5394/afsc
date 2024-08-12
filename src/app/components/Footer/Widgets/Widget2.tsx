import React from 'react'

const Widget2: React.FC = () => {
  return (
    <div className='md:w-1/4'>
      <nav className='flex flex-col'>
        <ul className='menu flex flex-col justify-start text-base text-white text-opacity-50'>
          <li className='group relative cursor-pointer px-1.5 mb-1'>
            <a className='flex' href='https://afsc.org/our-work'>
              <span>OUR WORK</span>
            </a>
          </li>
          <li className='group relative cursor-pointer px-1.5 mb-1'>
            <a className='flex' href='https://afsc.org/strategic-goals'>
              <span>OUR APPROACH</span>
            </a>
          </li>
          <li className='group relative cursor-pointer px-1.5 mb-1'>
            <a className='flex' href='https://afsc.org/about'>
              <span>ABOUT AFSC</span>
            </a>
          </li>
          <li className='group relative cursor-pointer px-1.5 mb-1'>
            <a className='flex' href='https://afsc.org/history'>
              <span>HISTORY</span>
            </a>
          </li>
          <li className='group relative cursor-pointer px-1.5'>
            <a className='flex' href='https://afsc.org/programs'>
              <span>ALL PROGRAMS</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Widget2
