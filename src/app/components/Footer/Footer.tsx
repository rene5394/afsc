import React from 'react'
import Subscribe from '@/app/components/Footer/Subscribe'
import Widgets from '@/app/components/Footer/Widgets/Widgets'
import Copyright from '@/app/components/Footer/Copyright/Copyright'

const Footer: React.FC = () => {
  return (
    <footer>
      <Subscribe />
      <Widgets />
      <Copyright />
    </footer>
  )
}

export default Footer
