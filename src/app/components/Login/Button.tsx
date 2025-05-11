import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className='w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-red-500 transition-colors'
    >
      {children}
    </button>
  )
}
