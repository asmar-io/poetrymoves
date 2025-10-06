import { useWallet } from '@suiet/wallet-kit'
import { Transition } from '@tailwindui/react'
import $ from 'jquery'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { toast } from 'react-toastify'
import BeachDay from '../../assets/images/beach_day.jpeg'
import Blank from '../../assets/images/blank.jpeg'
import Cherryblossoms from '../../assets/images/cherry_blossoms.jpeg'
import DesertNight from '../../assets/images/desert_night.jpg'
import Forest from '../../assets/images/forest.jpeg'
import bg from '../../assets/images/paper_background.jpg'
import Refrigerator from '../../assets/images/refrigerator.jpeg'
import ScifiMoon from '../../assets/images/sci_moon.jpeg'
import Whiteboard from '../../assets/images/whiteboard.jpeg'
import SaveModal from '../../components/saveModal'
import { useCurrentUser } from '../../hooks/useAuth'
import { getAllSentences, load, sleep } from '../../utils/sui'

const pageSize = 100
const createpoems = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sideBarRef = useRef(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const wallet = useWallet()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedBg, setSelectedBG] = useState('blank')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showUsedWord, setShowUsedWord] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showSaveModal, setShowSaveModal] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showSideBar, setShowSideBar] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [words, setWords] = useState(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [updatedWords, setUpdatedWords] = useState(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [usedWords, setUsedWords] = useState(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [searchWord, setSearchWord] = useState('')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [filteredWords, setFilteredWords] = useState(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [wordsInPoem, setWordsInPoem] = useState(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [forceState, setForceState] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [draggableKey, setDraggableKey] = useState(0)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [wordPositions, setWordPositions] = useState([])
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: user } = useCurrentUser()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { action, status } = useRouter().query
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log(action, status)
    if (action === 'fiat-mint-pack' && status === 'success') {
      toast('Your pack has been minted!', { type: 'success' })
    }
  }, [action, status])

  const handleChangeSearchWord = e => {
    setSearchWord(e.target.value)
  }
  const handleCombineAndSave = () => {
    setShowSaveModal(true)
  }

  const handleBackgroundSelect = e => {
    setSelectedBG(e.target.value)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [windowsPos, setWindowsPos] = useState(0)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [page, setPage] = useState(0)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (windowsPos.x === undefined || windowsPos.x !== $('.imageShow').width())
      setWindowsPos({
        x: $('.imageShow').width(),
        y: $('.imageShow').height(),
      })
    const handleResize = () => {
      setWindowsPos({
        x: $('.imageShow').width(),
        y: $('.imageShow').height(),
      })
    }
    window.addEventListener('load', handleResize, false)
    window.addEventListener('resize', handleResize, false)
    return () => window.removeEventListener('resize', handleResize, false)
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!wallet.connected && !user) return

    const walletObj = wallet.connected ? wallet : user.wallet
    ;(async () => {
      sleep(1000)
      const object = await load(walletObj)
      console.log(object)
      const objectPos = object.map((item, index) => ({
        index: index,
        word: item?.data?.content?.fields?.word,
        objectId: item?.data?.objectId,
        owner: item?.data?.owner?.AddressOwner,
        used: false,
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
        dragX: 0,
        dragY: 0,
        background: item?.data?.content?.fields?.background,
      }))
      const mySentences = await getAllSentences(walletObj)
      let usedWordsInSentences = []

      for (var i = 0; i < mySentences.length; i++) {
        usedWordsInSentences = [
          ...usedWordsInSentences,
          ...mySentences[i].data.content.fields.words,
        ]
      }

      let used = usedWordsInSentences.map(item => ({
        word: item,
        used: true,
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
      }))
      // console.log("...used", [...used]);
      setUsedWords([...used])
      const arrayO = [...objectPos]
      setWords([...arrayO])
      setUpdatedWords([...arrayO])
    })()
  }, [wallet, user])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (words !== null) {
      let filteredWords = words?.filter(
        itemA => !wordsInPoem?.some(itemB => itemB.word === itemA.word),
      )

      const newO = filteredWords?.filter(item => item?.word?.search(searchWord) >= 0)
      let used = []
      if (showUsedWord) {
        used = usedWords?.filter(item => item?.word?.search(searchWord) >= 0)
      }
      let sorted = [...newO, ...used]

      sorted.sort((a, b) => {
        let wordA = a.word.toLowerCase()
        let wordB = b.word.toLowerCase()
        if (wordA < wordB) return -1
        else if (wordA > wordB) return 1
        return 0
      })

      let newUpdatedWords
      if (!wordsInPoem) {
        newUpdatedWords = [...sorted]
      } else {
        newUpdatedWords = [...sorted, ...wordsInPoem]
      }

      setUpdatedWords([...newUpdatedWords])
    }
  }, [searchWord, words, showUsedWord, usedWords])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    function handleClickOutside(event) {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        setShowSideBar(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sideBarRef])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (words !== null) {
      let _words = []
      _words = updatedWords.filter(
        item =>
          item.dragY > 0 &&
          item.dragX > 0 &&
          item.dragX < windowsPos.x &&
          item.dragY < windowsPos.y,
      )
      setWordsInPoem([..._words])
    }
  }, [forceState])

  const resetPosition = wordItem => {
    const wordPos = wordPositions?.find(pos => pos.objectId === wordItem.objectId)

    if (wordPos) {
      return {
        ...wordItem,
        dragX: wordPos.dragX,
        dragY: wordPos.dragY,
        x: wordPos.dx,
        y: wordPos.dy,
        startX: wordPos.startX,
        startY: wordPos.startY,
      }
    } else {
      return {
        ...wordItem,
        dragX: 0,
        dragY: 0,
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
      }
    }
  }

  const cleanUnusedwords = () => {
    if (words !== null) {
      const updatedPos = updatedWords?.map(item => resetPosition(item))

      updatedPos?.sort((a, b) => {
        let wordA = a.word.toLowerCase()
        let wordB = b.word.toLowerCase()
        if (wordA < wordB) return -1
        else if (wordA > wordB) return 1
        return 0
      })

      let newUpdatedWords
      newUpdatedWords = [...updatedPos]

      let newWordsInPoem = []
      if (wordsInPoem !== null) {
        newWordsInPoem = updatedPos.filter(item =>
          wordsInPoem.some(itemB => itemB.objectId === item.objectId),
        )
      }

      setWordsInPoem([...newWordsInPoem])
      setUpdatedWords([...newUpdatedWords])
      setDraggableKey(draggableKey + 1)
    }
  }

  const getXYPosition = (item, dx, dy) => {
    let newWord
    let existingWord = wordPositions?.find(w => w.objectId === item.objectId)
    if (existingWord) {
      newWord = wordPositions?.map(w => (w.objectId === item.objectId ? { ...item, dx, dy } : w))
    } else {
      newWord = [...wordPositions, { ...item, dx, dy }]
    }
    setWordPositions([...newWord])
  }

  return (
    <div className='text-center w-full'>
      <Head>
        <title>Poetry in Motion - Create Poems</title>
        <meta
          name='description'
          content='Poetry in Motion is the first creative writing collectible card game in web3. Express your wit and creativity by crafting poetic masterpieces stored on the Sui blockchain.'
        />
      </Head>
      <h1 className='mb-4 text-4xl lg:text-6xl tracking-tight'>Create Poems</h1>
      <div className='flex p-4 mx-auto relative'>
        <div className='lg:hidden'>
          <button
            onClick={() => {
              setShowSideBar(true)
            }}
            type='button'
            className='items-center p-2 ml-3 text-sm text-neutral-900 xl:hidden hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400'
            aria-controls='navbar-default'
            aria-expanded='false'
          >
            <span className='sr-only'>Open Setting menu</span>
            <svg
              className='w-6 h-6'
              aria-hidden='true'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              ></path>
            </svg>
          </button>
        </div>
        <Transition
          show={showSideBar}
          className='bg-gray-600/40 w-full h-full absolute top-0 left-0'
          style={{ zIndex: 9999 }}
        >
          <Transition.Child
            enter='transition ease-linear duration-300'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-linear duration-300'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
            className='h-full'
          >
            <div
              className='text-left h-full p-4 relative transition-transform'
              ref={sideBarRef}
              style={{
                minWidth: '280px',
                maxWidth: '280px',
                backgroundImage: `url(${bg.src})`,
              }}
            >
              <button
                onClick={() => {
                  setShowSideBar(false)
                }}
                type='button'
                className='absolute right-0 top-0 inline-flex items-center p-2 ml-3 text-sm text-neutral-900 xl:hidden hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400'
                aria-controls='navbar-default'
                aria-expanded='false'
              >
                <span className='sr-only'>Open Setting menu</span>
                <svg
                  className='w-6 h-6'
                  aria-hidden='true'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
              <h1 className='mb-4 text-2xl md:text-4xl tracking-tight'>BACKGROUND</h1>
              <div className='flex items-center'>
                <select
                  onChange={handleBackgroundSelect}
                  defaultValue={'blank'}
                  value={selectedBg}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:border-blue-500 block w-11/12 p-2.5 '
                >
                  <option value='blank'>Blank</option>
                  <option value='whiteboard'>Whiteboard</option>
                  <option value='refrigerator'>Refrigerator</option>
                  <option value='forest'>Forest</option>
                  <option value='beach'>Beach</option>
                  <option value='cherryblossoms'>Cherry Blossoms</option>
                  <option value='Desert'>Desert</option>
                  <option value='ScifiMoon'>Sci-fi Moon</option>
                </select>
              </div>
              <div className='mt-6'>
                <button
                  className='hover:bg-red-600/40 bg-white hover:text-white border border-black border-b-2 border-r-2 hover:border-black uppercase text-2xl px-2 py-1 text-center'
                  onClick={() => {
                    setShowSideBar(false)
                    handleCombineAndSave()
                  }}
                >
                  Combine and Save
                </button>
              </div>
            </div>
          </Transition.Child>
        </Transition>

        <div
          className={`mx-auto text-left relative hidden lg:block`}
          style={{ minWidth: '280px', maxWidth: '280px' }}
        >
          <h1 className='mb-4 text-2xl md:text-4xl tracking-tight'>BACKGROUND</h1>
          <div className='flex items-center'>
            <select
              onChange={handleBackgroundSelect}
              defaultValue={'blank'}
              value={selectedBg}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:border-blue-500 block w-5/6 p-2.5 '
            >
              <option value='blank'>Blank</option>
              <option value='whiteboard'>Whiteboard</option>
              <option value='refrigerator'>Refrigerator</option>
              <option value='forest'>Forest</option>
              <option value='beach'>Beach</option>
              <option value='cherryblossoms'>Cherry Blossoms</option>
              <option value='Desert'>Desert</option>
              <option value='ScifiMoon'>Sci-fi Moon</option>
            </select>
          </div>
          <div className='mt-6'>
            <button
              className='hover:bg-[#4abd6a]  bg-white hover:text-white border border-black border-b-2 border-r-2 hover:border-black uppercase text-2xl px-2 py-1 text-center'
              onClick={handleCombineAndSave}
            >
              Combine and Save
            </button>
          </div>
        </div>
        <div className='mx-auto p-2 text-left relative'>
          <Image
            id='droppableDiv'
            priority
            alt='Picture'
            src={
              selectedBg === 'blank'
                ? Blank
                : selectedBg === 'refrigerator'
                  ? Refrigerator
                  : selectedBg === 'forest'
                    ? Forest
                    : selectedBg === 'whiteboard'
                      ? Whiteboard
                      : selectedBg === 'beach'
                        ? BeachDay
                        : selectedBg === 'cherryblossoms'
                          ? Cherryblossoms
                          : selectedBg === 'ScifiMoon'
                            ? ScifiMoon
                            : DesertNight
            }
            className='w-fit border border-black imageShow border-b-2 border-r-2'
          />
          <p className='font-light text-xl mt-4 mb-2'>
            Create your poem, don’t hesitate. A world awaits on this blank slate.
          </p>
          <p className='font-light text-xl mb-2'>
            Drag and place, arrange with care. Your masterpiece has flair to spare.
          </p>
          <div className='flex xl:flex-row flex-col gap-4'>
            <input
              type='text'
              name='text'
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-gray-600 block p-2.5 xl:w-8/12'
              placeholder='Search for words...'
              required=''
              value={searchWord}
              onChange={handleChangeSearchWord}
            />
            <div className='flex items-center xl:w-2/12'>
              <input
                checked={showUsedWord}
                id='checked-checkbox'
                type='checkbox'
                value=''
                className='w-4 h-4 text-lg text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                onChange={() => setShowUsedWord(!showUsedWord)}
              />
              <label htmlFor='checked-checkbox' className='ml-2 text-lg font-medium text-gray-900'>
                Show my words used in other poems
              </label>
            </div>
            <div className='flex items-center xl:w-2/12'>
              <div
                className='bg-black border rounded-lg border-2 w-fit p-3 cursor-pointer'
                onClick={() => cleanUnusedwords()}
              >
                <label className='text-white text-sm cursor-pointer'>clean up unused words</label>
              </div>
            </div>
            <div>
              <p></p>
            </div>
          </div>
          <div className='flex flex-row flex-wrap'>
            {updatedWords !== null &&
              updatedWords.map((item, index) => {
                if (
                  (index >= page * pageSize && index < (page + 1) * pageSize) ||
                  (item.x !== 0 && item.y !== 0)
                )
                  if (!item.used) {
                    return (
                      <div key={draggableKey + item.objectId}>
                        <Draggable
                          defaultPosition={{
                            x: item.x === 0 && item.y === 0 ? 0 : item.x,
                            y: item.x === 0 && item.y === 0 ? 0 : item.y,
                          }}
                          key={item.objectId}
                          onStart={() => {
                            if (item.startX === 0 && item.startY === 0) {
                              item.startX = $(
                                `.${item.word?.split(' ')[0]}-${index}`,
                              ).position().left
                              item.startY = $(
                                `.${item.word?.split(' ')[0]}-${index}`,
                              ).position().top
                            }
                          }}
                          onStop={(e, d) => {
                            let posX = $(`.${item.word?.split(' ')[0]}-${index}`).position().left
                            let posY = $(`.${item.word?.split(' ')[0]}-${index}`).position().top
                            item.x = posX
                            item.y = posY
                            item.dragX = posX
                            item.dragY = posY
                            setForceState(!forceState)
                            if (
                              item.dragY > 0 &&
                              item.dragX > 0 &&
                              item.dragX < windowsPos.x &&
                              item.dragY < windowsPos.y
                            ) {
                              getXYPosition(item, d.x, d.y)
                            } else {
                              setWordPositions(prevPositions =>
                                prevPositions.filter(pos => pos.objectId !== item.objectId),
                              )
                            }
                          }}
                        >
                          <div
                            className={`${item.word?.split(' ')[0]}-${index} ${
                              item.x !== 0 && item.y !== 0 ? 'absolute ' : ''
                            }cursor-move border border-black border-b-2 border-r-2 p-1 bg-white w-fit font-semibold m-1`}
                            style={{
                              backgroundColor:
                                item.background === 'eeeeee' || item.background === 'ffffff'
                                  ? 'white'
                                  : '#acd3fd',
                              left: item.x === 0 && item.y === 0 ? null : item.startX,
                              top: item.x === 0 && item.y === 0 ? null : item.startY,
                              fontFamily: 'Courier New',
                            }}
                          >
                            {item.word}
                          </div>
                        </Draggable>
                      </div>
                    )
                  } else
                    return (
                      <div
                        className={`cursor-pointer border border-black border-b-2 border-r-2 p-1 bg-gray-300 w-fit font-semibold m-1`}
                        style={{ fontFamily: 'Courier New' }}
                      >
                        {item.word}
                      </div>
                    )
              })}
            {(words === null || words.length === 0) &&
            (usedWords === null || usedWords.length === 0) ? (
              <p className='mx-auto md:col-span-12 w-full p-2 text-2xl text-center'>
                You don’t currently own any words
              </p>
            ) : (
              (updatedWords === null || updatedWords.length === 0) && (
                <p className='mx-auto md:col-span-12 w-full p-2 text-2xl text-center'>
                  You don’t have any words that match your filter criteria.
                </p>
              )
            )}
          </div>
          {updatedWords !== null && updatedWords.length > pageSize && (
            <div className='flex flex-col items-center'>
              <span className='text-sm text-gray-700'>
                Showing{' '}
                <span className='font-semibold text-gray-900'>{parseInt(1 + pageSize * page)}</span>{' '}
                to{' '}
                <span className='font-semibold text-gray-900'>
                  {pageSize * (page + 1) < updatedWords.length
                    ? parseInt(pageSize * (page + 1))
                    : updatedWords.length}
                </span>{' '}
                of <span className='font-semibold text-gray-900'>{updatedWords.length}</span> Words
              </span>
              <div className='inline-flex mt-2 xs:mt-0'>
                <button
                  onClick={() => {
                    if (page > 0) setPage(page - 1)
                    else setPage(parseInt(updatedWords.length / pageSize))
                  }}
                  className='px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900'
                >
                  Prev
                </button>
                <button
                  onClick={() => {
                    if (updatedWords.length / pageSize > page + 1) setPage(page + 1)
                    else setPage(0)
                  }}
                  className='px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900'
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showSaveModal && (
        <SaveModal
          background={selectedBg}
          setShowModal={setShowSaveModal}
          words={wordsInPoem}
          windowsPos={windowsPos}
        />
      )}
    </div>
  )
}

export default createpoems
