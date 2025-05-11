import { forwardRef, InputHTMLAttributes } from 'react'

type Props = {
  label: string
} & InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, ...props },
  ref
) {
  return (
    <div className='flex flex-col'>
      <label className='mb-1 text-sm font-medium'>{label}</label>
      <input
        ref={ref}
        {...props}
        className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
    </div>
  )
})

export default Input
