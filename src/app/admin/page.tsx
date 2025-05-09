import Statistics from '@/app/components/Admin/Home/Statistics'

export default async function Admin() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_V1_URL}/stats/`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch statistics')
  }

  const stats = await res.json()

  return (
    <Statistics
      profileCount={stats.data.profileCount}
      tagCount={stats.data.tagCount}
    />
  )
}
