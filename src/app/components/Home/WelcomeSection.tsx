import React from 'react'

const WelcomeSection: React.FC = () => {
  return (
    <section className='bg-black text-white text-center py-24'>
      <div className='container mx-auto px-6'>
        <h1 className='lg:text-[104px] md:text-[80px] text-[50px] leading-none'>
          WELCOME TO TRACES
        </h1>
        <p className='max-w-4xl lg:text-xl text-l mx-auto'>
          Discover the narratives of migrants globally, individuals who have
          pursued a brighter future for themselves and their loved ones.
          Regardless of nationality, language, or age, migration touches us all.
          It&apos;s about people striving to enhance their lives, displaying
          resilience in the face of challenges, and persistently seeking
          opportunities to thrive and express their humanity.
        </p>
      </div>
    </section>
  )
}

export default WelcomeSection
