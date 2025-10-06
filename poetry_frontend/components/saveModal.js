import { useWallet } from '@suiet/wallet-kit'
import domtoimage from 'dom-to-image'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import BeachDay from '../assets/images/beach_day.jpeg'
import Blank from '../assets/images/blank.jpeg'
import Cherryblossoms from '../assets/images/cherry_blossoms.jpeg'
import DesertNight from '../assets/images/desert_night.jpg'
import Forest from '../assets/images/forest.jpeg'
import bg from '../assets/images/paper_background.jpg'
import Refrigerator from '../assets/images/refrigerator.jpeg'
import ScifiMoon from '../assets/images/sci_moon.jpeg'
import Whiteboard from '../assets/images/whiteboard.jpeg'
import { useCurrentUser } from '../hooks/useAuth'
import { pinFileToIPFS } from '../utils/ipfs'
import { mintSentence } from '../utils/sui'
import { mintSentenceCustodial } from '../utils/cutodial'
import CommonButton from './CommonButton'

const SaveModal = ({ background, setShowModal, words, windowsPos }) => {
  const { data: user } = useCurrentUser()
  const wallet = useWallet()
  const wrapperRef = useRef(null)
  const exportRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowModal(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setShowModal, wrapperRef])

  const handleCancel = () => {
    setShowModal(false)
  }

  const handleChangeTitle = e => {
    setTitle(e.target.value)
  }

  const domToImage = async () => {
    var scale = 2
    const options = {
      width: exportRef.current.clientWidth * scale,
      height: exportRef.current.clientHeight * scale,
      style: {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
      },
    }

    try {
      const dataURL = await domtoimage.toPng(exportRef.current, options)
      return dataURL
    } catch (error) {
      console.error('Error converting div to data URL:', error)
      return null
    }
  }

  const handleSavePoem = async () => {
    setIsLoading(true)
    if (!wallet.connected && !user) {
      setIsLoading(false)
      toast('Please connect your wallet, or Sign In.', { type: 'warning' })
      return
    }
    if (title === '') {
      setIsLoading(false)
      toast('Please write your title.', { type: 'error' })
      return
    }
    // const usedWords = words.filter(
    // 	(item) =>
    // 		item.y > 0 &&
    // 		item.x > 0 &&
    // 		item.x < windowsPos.x &&
    // 		item.y < windowsPos.y
    // );
    const usedWords = words
    let image = await domToImage()
    const res = await pinFileToIPFS(image, title)
    console.log(res)
    if (!res.success) {
      setIsLoading(false)
      toast('Something went wrong while uploading your poem picture.', {
        type: 'error',
      })
      return
    }
    const success = wallet.connected
      ? // connected wallet flow
        await mintSentence(wallet, usedWords, res.pinataUrl, background, title, wallet?.address)
      : // custodial wallet flow
        await mintSentenceCustodial(
          user.user_id,
          usedWords,
          res.pinataUrl,
          background,
          title,
          user.wallet.address,
        )
    console.log(success)
    if (success) {
      toast('Poem created successfully. You can find it in the My Poems page', {
        type: 'success',
      })
      setShowModal(false)
      setTimeout(function () {
        window.location.reload()
      }, 5000)
    } else {
      toast('Something went wrong.', { type: 'error' })
    }
    setIsLoading(false)
  }
  return (
    <section className='bg-gray-600/40 w-full fixed top-0 left-0'>
      <div className='flex flex-col items-center justify-center mx-auto md:h-screen'>
        <div
          className='shadow p-2 md:mt-0'
          ref={wrapperRef}
          style={{
            backgroundImage: `url(${bg.src})`,
            transform: 'scale(0.90)',
          }}
        >
          <div className='relative canvasShow' ref={exportRef}>
            <Image
              priority
              alt='Picture'
              style={{ width: windowsPos.x + 4, height: windowsPos.y + 4 }}
              src={
                background === 'blank'
                  ? Blank
                  : background === 'refrigerator'
                    ? Refrigerator
                    : background === 'forest'
                      ? Forest
                      : background === 'whiteboard'
                        ? Whiteboard
                        : background === 'beach'
                          ? BeachDay
                          : background === 'cherryblossoms'
                            ? Cherryblossoms
                            : background === 'ScifiMoon'
                              ? ScifiMoon
                              : DesertNight
              }
              className='w-fit border border-gray-400'
            />
            {words !== null &&
              words.map((item, index) => {
                // if (item.dragY > 0 && item.dragX > 0 && item.dragX < windowsPos.x && item.dragY < windowsPos.y )
                return (
                  <p
                    key={index}
                    className={`absolute border border-black border-b-2 border-r-2 p-1 w-fit font-semibold`}
                    style={{
                      // backgroundColor: item.background === "eeeeee" ? "white" : "#acd3fd",
                      backgroundColor:
                        item.background === 'eeeeee' || item.background === 'ffffff'
                          ? 'white'
                          : '#acd3fd',
                      left: item.dragX,
                      top: item.dragY,
                      fontFamily: 'Courier New',
                    }}
                  >
                    {item.word}
                  </p>
                )
              })}
          </div>
          <h1 className='mb-4 text-4xl md:text-6xl tracking-tight'>Poem Title</h1>
          <input
            type='text'
            name='text'
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-gray-600 block w-full p-2.5'
            placeholder='Title your poem...'
            onChange={handleChangeTitle}
            value={title}
            required=''
          />
          <p
            className={`hidden ${
              title !== '' && 'block'
            } font-light text-sm m-2 text-red-700 text-left`}
          >
            Please insert your title for this poem.
          </p>
          <p className='font-light text-sm m-2 text-left'>
            Saving your poem will conbine these words into a new object. <br /> You can always split
            poems apart into individual words using the My Poems page.
          </p>
          <div className='flex justify-between'>
            <button
              className='hover:bg-red-600/40 hover:text-white border-black border-b-2 border-r-2 bg-white text-black border hover:border-black uppercase text-2xl px-5 py-2.5 text-center h-fit min-w-fit m-2'
              onClick={handleCancel}
            >
              Cancel
            </button>
            <CommonButton
              isLoading={isLoading}
              onClick={handleSavePoem}
              className={
                'border-black border-b-2 border-r-2 bg-white text-black hover:bg-red-600/40 hover:text-white text-black border hover:border-black uppercase text-2xl px-5 py-2.5 text-center h-fit min-w-fit m-2'
              }
              style={{
                backgroundColor: '#4abd6a',
              }}
            >
              Save Poem
            </CommonButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SaveModal
