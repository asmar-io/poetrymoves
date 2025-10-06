import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import bg from '../assets/images/paper_background.jpg'
import CommonButton from './CommonButton'
import { sentanceToWords, sleep } from '../utils/sui'
import { useWallet } from '@suiet/wallet-kit'
import { toast } from 'react-toastify'
import { month } from '../utils/ipfs'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FacebookShareButton, TwitterShareButton, TwitterIcon, FacebookIcon } from 'react-share'

const PoemModalView = ({
  title,
  createdAt,
  background,
  image,
  words,
  setShowPoem,
  poemId,
  update,
  author,
}) => {
  const wallet = useWallet()
  const wrapperRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const handleDeletePoem = async () => {
    if (!wallet.connected) {
      toast('Please connect your wallet.', { type: 'warning' })
      return
    }
    setIsLoading(true)
    const success = await sentanceToWords(wallet, poemId, owner)
    if (success) {
      toast('Successfully Deleted', { type: 'success' })
      update(poemId)
      setShowPoem(false)
    } else toast('Something went wrong.', { type: 'error' })
    setIsLoading(false)
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowPoem(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  const downloadImage = () => {
    fetch(image, {
      method: 'GET',
      headers: {},
    })
      .then(response => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${title}.png`) //or any other extension
          document.body.appendChild(link)
          link.click()
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <>
      <head>
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={`Check out this poem: ${title}`} />
        <meta name='twitter:description' content='A beautiful poem about...' />
        <meta name='twitter:image' content={`${image}`} />
        <meta property='og:title' content={`Check out this poem: ${title}`} />
        <meta property='og:description' content='A beautiful poem about...' />
        <meta property='og:image' content={`${image}`} />
      </head>

      <section className='bg-gray-600/40 w-full fixed top-0 left-0' style={{ zIndex: 99 }}>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
          <div
            className='w-full lg:w-3/5 shadow md:mt-0 xl:p-0 relative'
            ref={wrapperRef}
            style={{ backgroundImage: `url(${bg.src})` }}
          >
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8 p-4 mx-auto gap-4 md:grid-cols-12'>
              <div className='mx-auto md:col-span-6 w-full'>
                <Image
                  priority
                  alt='Picture'
                  src={image}
                  width={720}
                  height={720}
                  className='w-full border border-gray-400'
                />
              </div>
              <div className='mx-auto md:col-span-6 w-full text-left'>
                <p className='font-light sm:text-l'>TITLE: {title}</p>
                <p className='font-light sm:text-l'>AUTHOR: {author}</p>
                <p className='font-light sm:text-l'>
                  CREATED: {month[new Date(createdAt).getMonth()]} {new Date(createdAt).getDate()},{' '}
                  {new Date(createdAt).getFullYear()}
                </p>
                <p className='font-light sm:text-l'>BACKGROUND: {background}</p>
                <p className='font-light sm:text-l'>WORDS USED: {words}</p>
              </div>
              <button
                onClick={() => setShowPoem(false)}
                className='absolute top-3 right-4 bg-white rounded-full p-2 inline-flex items-center justify-center hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
              >
                <span className='sr-only'>Close menu</span>
                <svg
                  className='h-8 w-8'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PoemModalView
