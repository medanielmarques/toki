export default function Pomodoro() {
  return (
    <div className='mt-52 flex justify-center'>
      <div className='flex flex-col content-center items-center justify-between gap-12 rounded-2xl bg-[#312e45] py-8 px-16'>
        <div className='flex items-center gap-4'>
          <ActivityButton label='Pomodoro' current />
          <ActivityButton label='Short Break' />
          <ActivityButton label='Long Break' />
        </div>

        <h1 className='text-9xl font-bold'>20:00</h1>

        <button className='w-3/6 rounded-lg bg-white px-8 py-4 text-2xl font-bold text-sky-500'>
          START
        </button>
      </div>
    </div>
  )
}

const ActivityButton = (props: { label: string; current?: boolean }) => (
  <button
    className={`rounded-2xl py-3 px-6 ${
      !!props.current ? 'bg-sky-900 ' : 'hover:bg-gray-700'
    }`}
  >
    {props.label}
  </button>
)
