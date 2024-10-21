'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/components/Header/Header'
import Footer from '@/app/components/Footer/Footer'
import Container from '@/app/components/Profile/Container'
import { ReadProfilesUseCase } from '@/modules/profile/application/ReadProfileUseCase'
import { ProfileRepository } from '@/modules/profile/infrastructure/ProfileRepository'
import { Profile } from '@/modules/profile/domain/Profile'

type ProfilePageParams = {
  id: number
}

export default function ProfilePage({ params }: { params: ProfilePageParams }) {
  const { id } = params
  const [profile, setProfile] = useState<Profile>()

  const readProfilesUseCase = new ReadProfilesUseCase(new ProfileRepository())

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fetchedProfile = await readProfilesUseCase.execute(id)
        if (fetchedProfile) {
          setProfile(fetchedProfile)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [id])

  return (
    <>
      <Header />
      {profile && <Container profile={profile} />}
      <Footer />
    </>
  )
}
