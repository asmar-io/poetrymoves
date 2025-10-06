import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Jumbo from '../assets/images/Jumbo_Pack.gif'
import Colossal from '../assets/images/Colossal_Pack.gif'
import Starter from '../assets/images/Starter_pack.gif'
import BullShark from '../assets/images/Bullshark_pack.gif'
import Degen from '../assets/images/Degen_pack.gif'

const BuyWordPack = ({ setShowPoem, words, background }) => {
  const [isMinting, setIsMinting] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsMinting(false), 5500)
    return () => clearTimeout(timer)
  })

  return (
    <section className='bg-gray-600/70 w-full fixed top-0 left-0'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-full'>
        <div className='p-2 md:mt-0 xl:p-4 transparent text-white w-full h-full m-6'>
          {isMinting ? (
            <Image
              priority
              alt='Picture'
              src={
                background === 'starter'
                  ? Starter
                  : background === 'jumbo'
                    ? Jumbo
                    : background === 'colossal'
                      ? Colossal
                      : background === 'bullshark'
                        ? BullShark
                        : Degen
              }
              className='w-full'
            />
          ) : (
            <div className='m-8'>
              <div className='flex items-start justify-between p-4'>
                <h1 className='mb-4 text-4xl md:text-6xl tracking-tight uppercase text-center w-full'>
                  New Words Available
                </h1>
                <button
                  onClick={() => setShowPoem(false)}
                  type='button'
                  className='bg-transparent hover:text-gray-300 p-1.5 ml-auto inline-flex items-center'
                  data-modal-hide='defaultModal'
                >
                  <svg
                    className='w-16 h-16'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    ></path>
                  </svg>
                  <span className='sr-only'>Close modal</span>
                </button>
              </div>
              <div className='flex flex-row flex-wrap'>
                {words.map(
                  (item, index) =>
                    // eslint-disable-next-line react/jsx-key
                    item?.data?.display?.data?.word && (
                      <div
                        key={index}
                        style={{
                          marginLeft: `${Math.floor(Math.random() * (80 - 16) + 16)}px`,
                          transform: `matrix(1, ${
                            (Math.random() * (8 + 8) - 8) / 100
                          }, 0, 1, 0, 0)`,
                          animationDelay: `${0.1 * index}s`,
                        }}
                        className='card drop-shadow-lg border border-gray-300 px-2 py-1 bg-white text-lg font-semibold text-black m-3'
                      >
                        {item?.data?.display?.data?.word}
                      </div>
                    ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BuyWordPack
