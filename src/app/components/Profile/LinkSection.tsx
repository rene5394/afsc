import React from 'react'
import { ProfileLink } from '@/modules/profile-link/domain/ProfileLink'

interface LinkSectionProps {
  profileLinks: ProfileLink[]
}

const LinkSection: React.FC<LinkSectionProps> = ({ profileLinks }) => {
  return (
    <>
      <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto border border-gray-300 px-10 py-8 mb-8'>
        <div className='flex items-start'>
          <div className='w-full'>
            <h2 className='text-3xl'>LINKS</h2>
            <hr className='border-t border-gray-300 mt-2 mb-4' />
            <div id='link-text'>
              {profileLinks.map((link) => (
                <p key={link.id}>
                  {link.title}.{' '}
                  <a href={link.url} target='_blank' rel='noopener noreferrer'>
                    Click to learn more
                  </a>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LinkSection
