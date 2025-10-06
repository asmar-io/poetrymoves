import { useWallet } from '@suiet/wallet-kit'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'
import { toast } from 'react-toastify'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import bg from '../assets/images/paper_background.jpg'
import { useCurrentUser } from '../hooks/useAuth'
import { month } from '../utils/ipfs'
import { sentanceToWords } from '../utils/sui'
import { sentenceToWordsCustodial } from '../utils/cutodial'
import CommonButton from './CommonButton'
import Head from 'next/head'

const PoemModal = ({
  title,
  createdAt,
  background,
  image,
  words,
  setShowPoem,
  poemId,
  update,
  owner,
}) => {
  const { data: user } = useCurrentUser()
  const wallet = useWallet()
  const wrapperRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const handleDeletePoem = async () => {
    if (!wallet.connected && !user) {
      toast('Please connect your wallet, or Sign In.', { type: 'warning' })
      return
    }
    setIsLoading(true)
    const success = wallet.connected
      ? // connected wallet flow
        await sentanceToWords(wallet, poemId, owner)
      : // custodial wallet flow
        await sentenceToWordsCustodial(user.user_id, poemId)
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
      <Head>
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={`Check out this poem: ${title}`} />
        <meta name='twitter:description' content='A beautiful poem about...' />
        <meta name='twitter:image' content={`${image}`} />
        <meta property='og:title' content={`Check out this poem: ${title}`} />
        <meta property='og:description' content='A beautiful poem about...' />
        <meta property='og:image' content={`${image}`} />
      </Head>
      <section className='bg-gray-600/40 w-full fixed top-0 left-0' style={{ zIndex: 99 }}>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
          <div
            className='w-full lg:w-4/5 shadow md:mt-0 xl:p-0 relative'
            ref={wrapperRef}
            style={{ backgroundImage: `url(${bg.src})` }}
          >
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8 grid p-4 mx-auto gap-4 md:grid-cols-12'>
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
                <p className='font-light sm:text-xl'>TITLE: {title}</p>
                <p className='font-light sm:text-xl'>
                  CREATED: {month[new Date(createdAt).getMonth()]} {new Date(createdAt).getDate()},{' '}
                  {new Date(createdAt).getFullYear()}
                </p>
                <p className='font-light sm:text-xl'>BACKGROUND: {background}</p>
                <p className='font-light sm:text-xl'>WORDS USED: {words}</p>
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
            <div className='space-y-4 md:space-y-6 grid p-4 mx-auto gap-4 md:grid-cols-12'>
              <div className='flex flex-col md:flex-row	mx-auto md:col-span-6 w-full p-2'>
                <CommonButton
                  isLoading={isLoading}
                  onClick={handleDeletePoem}
                  className={
                    'md:col-span-4 hover:bg-red-600/40 hover:text-white text-red-600 border border-red-600 hover:border-black uppercase text-xl px-3 py-1.5 text-center h-fit min-w-fit m-2'
                  }
                >
                  Delete Poem
                </CommonButton>
                <p className='font-light text-sm text-left'>
                  Deleting a poem breaks apart the group, but you will still keep the individual
                  words. You can always regroup them for a new poem.
                </p>
              </div>

              {/* <div>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox='0 0 24 24' data-name="Layer 1" id="facebook"><path d="M20.9,2H3.1A1.1,1.1,0,0,0,2,3.1V20.9A1.1,1.1,0,0,0,3.1,22h9.58V14.25h-2.6v-3h2.6V9a3.64,3.64,0,0,1,3.88-4,20.26,20.26,0,0,1,2.33.12v2.7H17.3c-1.26,0-1.5.6-1.5,1.47v1.93h3l-.39,3H15.8V22h5.1A1.1,1.1,0,0,0,22,20.9V3.1A1.1,1.1,0,0,0,20.9,2Z"></path></svg>
              </a>
            </div>
            <div>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox='0 0 24 24' data-name="Layer 1" id="instagram"><path d="M17.34,5.46h0a1.2,1.2,0,1,0,1.2,1.2A1.2,1.2,0,0,0,17.34,5.46Zm4.6,2.42a7.59,7.59,0,0,0-.46-2.43,4.94,4.94,0,0,0-1.16-1.77,4.7,4.7,0,0,0-1.77-1.15,7.3,7.3,0,0,0-2.43-.47C15.06,2,14.72,2,12,2s-3.06,0-4.12.06a7.3,7.3,0,0,0-2.43.47A4.78,4.78,0,0,0,3.68,3.68,4.7,4.7,0,0,0,2.53,5.45a7.3,7.3,0,0,0-.47,2.43C2,8.94,2,9.28,2,12s0,3.06.06,4.12a7.3,7.3,0,0,0,.47,2.43,4.7,4.7,0,0,0,1.15,1.77,4.78,4.78,0,0,0,1.77,1.15,7.3,7.3,0,0,0,2.43.47C8.94,22,9.28,22,12,22s3.06,0,4.12-.06a7.3,7.3,0,0,0,2.43-.47,4.7,4.7,0,0,0,1.77-1.15,4.85,4.85,0,0,0,1.16-1.77,7.59,7.59,0,0,0,.46-2.43c0-1.06.06-1.4.06-4.12S22,8.94,21.94,7.88ZM20.14,16a5.61,5.61,0,0,1-.34,1.86,3.06,3.06,0,0,1-.75,1.15,3.19,3.19,0,0,1-1.15.75,5.61,5.61,0,0,1-1.86.34c-1,.05-1.37.06-4,.06s-3,0-4-.06A5.73,5.73,0,0,1,6.1,19.8,3.27,3.27,0,0,1,5,19.05a3,3,0,0,1-.74-1.15A5.54,5.54,0,0,1,3.86,16c0-1-.06-1.37-.06-4s0-3,.06-4A5.54,5.54,0,0,1,4.21,6.1,3,3,0,0,1,5,5,3.14,3.14,0,0,1,6.1,4.2,5.73,5.73,0,0,1,8,3.86c1,0,1.37-.06,4-.06s3,0,4,.06a5.61,5.61,0,0,1,1.86.34A3.06,3.06,0,0,1,19.05,5,3.06,3.06,0,0,1,19.8,6.1,5.61,5.61,0,0,1,20.14,8c.05,1,.06,1.37.06,4S20.19,15,20.14,16ZM12,6.87A5.13,5.13,0,1,0,17.14,12,5.12,5.12,0,0,0,12,6.87Zm0,8.46A3.33,3.33,0,1,1,15.33,12,3.33,3.33,0,0,1,12,15.33Z"></path></svg>
              </a>
            </div>
            <div>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox='0 0 24 24' data-name="Layer 1" id="twitter"><path d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z"></path></svg>
              </a>
            </div>
            <div>
              <a href="https://discord.com" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox='0 0 24 24' id="discord-alt"><path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"></path></svg>
              </a>
            </div>
            <div>
              <a href="https://telegram.org" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox='0 0 24 24' data-name="Layer 1" id="telegram"><path d="M11.99432,2a10,10,0,1,0,10,10A9.99917,9.99917,0,0,0,11.99432,2Zm3.17951,15.15247a.70547.70547,0,0,1-1.002.3515l-2.71467-2.10938L9.71484,17.002a.29969.29969,0,0,1-.285.03894l.334-2.98846.01069.00848.00683-.059s4.885-4.44751,5.084-4.637c.20147-.189.135-.23.135-.23.01147-.23053-.36152,0-.36152,0L8.16632,13.299l-2.69549-.918s-.414-.1485-.453-.475c-.041-.324.46649-.5.46649-.5l10.717-4.25751s.881-.39252.881.25751Z"></path></svg>
              </a>
            </div> */}
              {/* <div className='col-span-5 bg-red-900'>
              <p>testung text</p>
            </div> */}

              <div className='col-span-6 flex justify-end pr-4 gap-3'>
                {/*<div className="mx-auto md:col-span-6 w-full p-2 md:absolute md:bottom-0 md:right-4" style={{ width: "auto" }}>*/}
                {/* <h1 className='uppercase text-3xl'>Share your Poem</h1> */}
                {/* <div className='flex mt-4 gap-4'> */}
                <div>
                  <TwitterShareButton
                    url={`${window.location.href}/poem/${poemId}`}
                    title={`Check out my poem on the Sui blockchain built with Poetry In Motion @poetrymovesus:  ${title}`}
                  >
                    <TwitterIcon size={42} round />
                  </TwitterShareButton>
                </div>

                <div>
                  <FacebookShareButton
                    url={`${window.location.href}/mypoems/${poemId}`} // Concatenate the paths without the leading slash
                    quote={`Check out my poem on the Sui blockchain built with Poetry In Motion @poetrymovesus: ${title}`}
                  >
                    <FacebookIcon size={42} round />
                  </FacebookShareButton>
                </div>
                <div>
                  <svg
                    id='download-cursor'
                    className='cursor-pointer'
                    xmlns='http://www.w3.org/2000/svg'
                    width='36'
                    height='36'
                    viewBox='0 0 24 24'
                    onClick={downloadImage}
                  >
                    <path d='M16 11h5l-9 10-9-10h5v-11h8v11zm1 11h-10v2h10v-2z' />
                  </svg>
                  <ReactTooltip anchorId='download-cursor' place='top' content='Download Poem' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PoemModal
