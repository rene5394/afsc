import Sidebar from '../components/Admin/Sidebar'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex h-screen'>
      <Sidebar />
      <div className='content'>{children}</div>
    </main>
  )
}
