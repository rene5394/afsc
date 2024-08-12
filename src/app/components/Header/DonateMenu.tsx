import React from 'react'

const DonateMenu: React.FC = () => {
  return (
    <ul id='donate-menu' className='flex'>
      <li className='group relative cursor-pointer bg-red text-white px-3.5'>
        <a
          className='flex menu-hover px-4 pt-[16px] pb-[16px]'
          href='https://afsc.org/donate'
        >
          DONATE
        </a>
        <div className='w-[320px] bg-white text-black border-gray-300 border-[1px] invisible absolute left-[-220px] z-50 py-5 px-4 group-hover:visible'>
          <ul>
            <li className='group/item'>
              <a
                className='flex menu-hover px-8 py-1'
                href='https://secure.afsc.org/Niu36r7Oj0K1qaHah9xTFg2?ms=WEB24SN0001RR'
              >
                <span className='group-hover/item:underline'>GIVE ONCE</span>
              </a>
            </li>
            <li className='group/item'>
              <a
                className='flex menu-hover px-8 py-1'
                href='https://secure.afsc.org/a/build-peace-justice-4?ms=WEB24SN'
              >
                <span className='group-hover/item:underline'>GIVE MONTHLY</span>
              </a>
            </li> 
            <li className='group/item'>
              <a
                className='flex menu-hover px-8 py-1'
                href='https://afsc.org/give'
              >
                <span className='group-hover/item:underline'>
                  MORE WAYS TO GIVE
                </span>
              </a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  )
}

export default DonateMenu
