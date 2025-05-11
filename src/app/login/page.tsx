import Form from '@/app/components/Login/Form'

export default function Login() {
  return (
    <main className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-lg'>
        <h1 className='text-2xl font-semibold mb-6 text-center'>Login</h1>
        <Form />
      </div>
    </main>
  )
}
