import TypewriterComponent from 'typewriter-effect'
import CommonButton from './CommonButton'
import Link from 'next/link'

const PoetryTypeWrite = () => {
  return (
    <div className='text-center w-full my-6'>
      <div className='w-fit typewriter my-3 mx-auto text-2xl' style={{ minHeight: '220px' }}>
        <h1 className='mb-4 text-4xl md:text-6xl tracking-tight mb-5'>Poetry in Motion</h1>
        <h1 className='mb-4 text-3xl md:text-5xl mb-14'>Compose. Share. Inspire!</h1>

        <p className='font-light text-2xl px-2'>
          Whether you’re a seasoned wordsmith or just a bard in training, Poetry in Motion
        </p>
        <p className='font-light text-2xl px-2'>
          provides a unique platform to craft, experiment, and share your creativity.
        </p>
      </div>
    </div>
  )
}

export default PoetryTypeWrite
