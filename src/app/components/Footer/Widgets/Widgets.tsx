import React from 'react'
import Widget1 from '@/app/components/Footer/Widgets/Widget1'
import Widget2 from '@/app/components/Footer/Widgets/Widget2'
import Widget3 from '@/app/components/Footer/Widgets/Widget3'

const Widgets: React.FC = () => {
  return (
    <div className='bg-black px-[30px] pt-[40px] pb-[80px] border-b-[1px] border-b-gray-600'>
      <div className='flex flex-wrap text-white'>
        <Widget1 />
        <Widget2 />
        <Widget3 />
      </div>
    </div>
  )
}

export default Widgets
