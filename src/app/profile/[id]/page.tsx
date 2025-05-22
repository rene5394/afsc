'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/components/Header/Header'
import Footer from '@/app/components/Footer/Footer'
import Container from '@/app/components/Profile/Container'
import { ReadProfilesUseCase } from '@/modules/profile/application/ReadProfileUseCase'
import { ProfileRepositoryClient } from '@/modules/profile/infrastructure/ProfileRepositoryClient'
import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'

type ProfilePageParams = {
  id: number
}

export default function ProfilePage({ params }: { params: ProfilePageParams }) {
  const { id } = params
  const [profile, setProfile] = useState<Profile>()

  const readProfilesUseCase = new ReadProfilesUseCase(
    new ProfileRepositoryClient()
  )

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const ProfileResponseDTO: ProfileResponseDTO | null =
          await readProfilesUseCase.execute(id)
        if (ProfileResponseDTO) {
          const fetchedProfile = {
            id: ProfileResponseDTO.id,
            name: ProfileResponseDTO.name,
            author: ProfileResponseDTO.author,
            story: ProfileResponseDTO.story,
            photo: ProfileResponseDTO.photo,
            tags: ProfileResponseDTO.tags,
            assets: ProfileResponseDTO.assets,
            routes: ProfileResponseDTO.routes,
            links: ProfileResponseDTO.links,
            active: ProfileResponseDTO.active,
            createdAt: ProfileResponseDTO.createdAt,
            updatedAt: ProfileResponseDTO.updatedAt,
          } as Profile
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
