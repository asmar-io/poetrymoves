import { useState } from 'react'
import Image from 'next/image'
import PoemModalView from './PoemModalView'
import { month } from '../utils/ipfs'

const PoemCardView = ({ poem, update }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showPoem, setShowPoem] = useState(false)
  const handleShowPoem = () => {
    setShowPoem(true)
  }

  return (
    <div>
      <button className='cursor-pointer p-2 border-meet draw meet' onClick={handleShowPoem}>
        <Image
          priority
          alt='Picture'
          src={poem.imageUrl}
          width={360}
          height={360}
          className='w-full border border-gray-400'
        />
        <p className='font-light sm:text-xl'>TITLE: {poem.title}</p>
        <p className='font-light sm:text-xl'>
          CREATED: {month[new Date(poem.createdAt).getMonth()]} {new Date(poem.createdAt).getDate()}
          , {new Date(poem.createdAt).getFullYear()}
        </p>
      </button>
      {showPoem && (
        <PoemModalView
          setShowPoem={setShowPoem}
          title={poem.title}
          createdAt={poem.createdAt}
          background={poem.background}
          image={poem.imageUrl}
          words={poem.poem}
          poemId={poem.objectId}
          update={update}
          author={poem.author}
        />
      )}
    </div>
  )
}

export default PoemCardView
