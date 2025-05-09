type StatisticsProps = {
  profileCount: number
  tagCount: number
}

const Statistics: React.FC<StatisticsProps> = ({ profileCount, tagCount }) => {
  return (
    <div className='container md:max-w-[800px] max-w-full py-12 px-14'>
      <h1 className='text-5xl mb-8'>STATISTICS</h1>
      <div className='grid md:grid-cols-2 gap-6'>
        <a href='/admin/profiles' className='text-lg'>
          <div className='p-6 bg-gray-100 rounded-xl text-center shadow-md'>
            <p className='text-3xl font-bold'>{profileCount}</p>

            <p className='text-lg'>Profiles</p>
          </div>
        </a>
        <a href='/admin/tags' className='text-lg'>
          <div className='p-6 bg-gray-100 rounded-xl text-center shadow-md'>
            <p className='text-3xl font-bold'>{tagCount}</p>
            <p className='text-lg'>Tags</p>
          </div>
        </a>
      </div>
    </div>
  )
}

export default Statistics
