import React from 'react'

const WelcomeSection: React.FC = () => {
  return (
    <section className='bg-black text-white text-center py-24'>
      <div className='container mx-auto px-6'>
        <img
          className='max-w-[300px] table mx-auto mb-3'
          src='/images/traces.png'
          alt='Logo'
        />
        <p className='max-w-4xl lg:text-xl text-l mx-auto'>
          Migration impacts everyone, regardless of nationality, language, or
          age. Traces follows the journeys of migrants who left their homes,
          sometimes to pursue brighter futures, careers, opportunities, most
          times because they had no other choice. The stories captured show
          people striving to enhance their lives, displaying resilience in the
          face of challenges, and persistently seeking opportunities to thrive
          and demand that their humanity is not up to the discretion of power.
        </p>
      </div>
    </section>
  )
}

export default WelcomeSection
