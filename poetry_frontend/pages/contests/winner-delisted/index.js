import React from 'react'
import winner_1 from '../../../assets/images/Layer_1.png'
import thumb from '../../../assets/images/thumb.png'
import winner_2 from '../../../assets/images/winner-2.png'
import winner_23 from '../../../assets/images/winner-23.png'
import winner_3 from '../../../assets/images//framebg.png'
import Image from 'next/image'
import beach_day from '../../../assets/images/cherry_blossoms.jpeg'

function Winner() {
  const images = [
    {
      id: 1,
      src: beach_day,
      alt: 'Poem Picture',
      title: 'Hello World',
      author: 'Jimmy Neutron',
      likes: '23',
      address: '0x123...',
    },
    {
      id: 2,
      src: beach_day,
      alt: 'Poem Picture 2',
      title: 'Hello World 2',
      author: 'Jimmy Neutron',
      likes: '23',
      address: '0x123...',
    },
    {
      id: 3,
      src: beach_day,
      alt: 'Poem Picture 3',
      title: 'Hello World 3',
      author: 'Jimmy Neutron',
      likes: '23',
      address: '0x123...',
    },
    {
      id: 4,
      src: beach_day,
      alt: 'Poem Picture 4',
      title: 'Hello World 4',
      author: 'Jimmy Neutron',
      likes: '23',
      address: '0x123...',
    },
    {
      id: 5,
      src: beach_day,
      alt: 'Poem Picture 5',
      title: 'Hello World 5',
      author: 'Jimmy Neutron',
      likes: '23',
      address: '0x123...',
    },
    {
      id: 6,
      src: beach_day,
      alt: 'Poem Picture 6',
      title: 'Hello World 6',
      author: 'Jimmy Neutron',
      likes: '23',
      address: '0x123...',
    },
    {
      id: 7,
      src: beach_day,
      alt: 'Poem Picture 7',
      title: 'Hello World 7',
      author: 'Jimmy Neutron',
      likes: '23',
      address: '0x123...',
    },
    {
      id: 8,
      src: beach_day,
      alt: 'Poem Picture 8',
      title: 'Hello World 8',
      author: 'Jimmy Neutron',
      likes: '23',
      address: '0x123...',
    },
    {
      id: 9,
      src: beach_day,
      alt: 'Poem Picture 9',
      title: 'Hello World 9',
      author: 'Jimmy Neutron',
      likes: '23',
      address: '0x123...',
    },
  ]
  return (
    <div>
      <div className='firstsec flex items-center justify-center w-full'>
        <h1 className='text-center text-5xl mt-[150px] p-3 bg-white'>WINNER</h1>
      </div>

      <div className='flex flex-col items-center justify-center my-[50px]'>
        <div className='text-center'>
          <h2 className='text-7xl'> COMMUNITY WINNER</h2>
          <Image className='w-full h-full' src={winner_1} />
        </div>

        <div className='bg-white p-5 text-center shadow-2xl'>
          <h3 className='text-3xl py-2'>Silent Trees </h3>

          <div className='flex items-center gap-2'>
            <h3 className='text-xl'>Author: 0xwqnuwJ</h3>
            <div className='flex items-center gap-2'>
              <Image src={thumb} />
              <h2>23</h2>
            </div>
          </div>
        </div>

        <div className='flex felx-row items-center justify-center gap-9 mt-9'>
          <div className='bgframe w-[37%]'>
            <Image src={images[0].src} alt={images[0].alt} />
            <div className='flex flex-row justify-between'>
              <div>
                <h2 className='font-bold'>TITLE: {images[0].title}</h2>
                <h2 className='font-bold'>AUTHOR: {images[0].author}</h2>
                <p className='text-sm'>{images[0].address}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Image src={thumb} />
                <h2>{images[0].likes}</h2>
              </div>
            </div>
          </div>
          <div className='bgframe w-[37%]'>
            <Image src={images[1].src} alt={images[1].alt} />
            <div className='flex flex-row justify-between'>
              <div>
                <h2 className='font-bold'>TITLE: {images[1].title}</h2>
                <h2 className='font-bold'>AUTHOR: {images[1].author}</h2>
                <p className='text-sm'>{images[1].address}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Image src={thumb} />
                <h2>{images[1].likes}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center justify-center my-[50px]'>
        <div className='text-center'>
          <h2 className='text-7xl'> EXPERT COMMITTEE WINNER</h2>
          <Image className='w-full h-full' src={winner_1} />
        </div>

        <div className='bg-white p-5 text-center shadow-2xl'>
          <h3 className='text-3xl py-2'>Silent Trees </h3>

          <div className='flex items-center gap-2'>
            <h3 className='text-xl'>Author: 0xwqnuwJ</h3>
            <div className='flex items-center gap-2'>
              <Image src={thumb} />
              <h2>23</h2>
            </div>
          </div>
        </div>

        <h2 className='text-3xl mt-[40px]'>Honorable Mentions</h2>

        <div className='flex felx-row items-center justify-center gap-9 mt-9'>
          <div className='bgframe w-[37%]'>
            <Image src={images[0].src} alt={images[0].alt} />
            <div className='flex flex-row justify-between'>
              <div>
                <h2 className='font-bold'>TITLE: {images[0].title}</h2>
                <h2 className='font-bold'>AUTHOR: {images[0].author}</h2>
                <p className='text-sm'>{images[0].address}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Image src={thumb} />
                <h2>{images[0].likes}</h2>
              </div>
            </div>
          </div>
          <div className='bgframe w-[37%]'>
            <Image src={images[1].src} alt={images[1].alt} />
            <div className='flex flex-row justify-between'>
              <div>
                <h2 className='font-bold'>TITLE: {images[1].title}</h2>
                <h2 className='font-bold'>AUTHOR: {images[1].author}</h2>
                <p className='text-sm'>{images[1].address}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Image src={thumb} />
                <h2>{images[1].likes}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Winner
