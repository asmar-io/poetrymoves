import React, { useState, useEffect } from 'react'
import beach_day from '../../assets/images/cherry_blossoms.jpeg'
import left_time from '../../assets/images/left-time.png'
import right_time from '../../assets/images/right-time.png'
import below_time from '../../assets/images/below-time.png'
import dot from '../../assets/images/left-dot.png'
import sui from '../../assets/images/suilogo.svg'
import Image from 'next/image'
import { CSSTransition } from 'react-transition-group'
import { useWallet } from '@suiet/wallet-kit'
import {
  getAllSentences,
  submitPoemContest,
  getContestInfo,
  checkIfPoemSubmitted,
  getAllSubmittedPoems,
  sleep,
} from '../../utils/sui'
import { month } from '../../utils/ipfs'
import { toast } from 'react-toastify'
import Link from 'next/link'

function FirstView({ onSelectPoem }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [showSelectPoem, setShowSelectPoem] = useState(true)
  const handleSelectPoem = () => {
    setShowSelectPoem(!showSelectPoem)
  }

  const handleTimer = async () => {
    // run asynchronous tasks here
    const contest_data = await getContestInfo()
    let contest_end_date = contest_data?.content?.fields?.submission_end_time
    //const targetDate = new Date('2023-12-31T23:59:59').getTime();
    const targetDate = parseInt(contest_end_date)

    const updateTimer = () => {
      const now = new Date().getTime()
      const timeDifference = targetDate - now

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }

    // Update the timer every second
    const timerInterval = setInterval(updateTimer, 1000)
    //return () => {}
    return () => {
      clearInterval(timerInterval)
    }
  }

  useEffect(() => {
    // Set the target date and time for the countdown
    handleTimer()
  }, [])

  return (
    <div className='w-[90%] row grid grid-cols-2 max-md:grid-cols-1 max-md:h-full max-md:w-full shadow-2xl mt-[20px] '>
      <div className='my-[20px] mx-[20px]'>
        <Image src={beach_day} alt='Poem Picture' />

        <div className='flex flex-row justify-between items-center'>
          <Image className='w-auto' src={dot} alt='Poem Picture' />
          <Image className='w-auto' src={left_time} alt='Poem Picture' />

          <h3 className='text-4xl text-center'>TIME LEFT</h3>
          <Image className='w-auto' src={right_time} alt='Poem Picture' />
          <Image className='w-auto' src={dot} alt='Poem Picture' />
        </div>
        <hr />
        <div className='timer flex justify-center gap-5 text-center'>
          <div>
            <p>Days</p>
            <div className='timeline'>
              <span>{timeLeft.days.toString()}</span>
            </div>
          </div>
          <div>
            <p>Hours</p>
            <div className='timeline'>
              <span>{timeLeft.hours < 10 ? `0` : timeLeft.hours.toString().charAt(0)}</span>
              <span>{timeLeft.hours.toString().slice(-1)}</span>
            </div>
          </div>
          <div>
            <p>Minutes</p>
            <div className='timeline'>
              <span>{timeLeft.minutes < 10 ? `0` : timeLeft.minutes.toString().charAt(0)}</span>
              <span>{timeLeft.minutes.toString().slice(-1)}</span>
            </div>
          </div>
          <div>
            <p>Seconds</p>
            <div className='timeline'>
              <span>{timeLeft.seconds < 10 ? `0` : timeLeft.seconds.toString().charAt(0)}</span>
              <span>{timeLeft.seconds.toString().slice(-1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='my-[20px] mx-[20px] flex flex-col items-start justify-around'>
        <h2 className='text-3xl font-bold mt-3'>Suggested Poem Prompts</h2>
        <p>
          If you’re looking for a place to start, you could respond to one of these prompts, but
          it’s not required. <br />
          <br />
          The Digital Landscape: Write a poem that explores the journey through a digital world,
          inspired by the technological marvels of the Sui blockchain. Reflect on how this digital
          evolution mirrors, contrasts, or intertwines with the natural world.
          <br />
          <br />
          The Essence of Connection: Focus on the theme of connectivity in the age of blockchain
          technology. How do platforms like SuiFrens create new forms of community and interaction?
          What does connection mean in this digital era?
          <br />
          <br />
          A Day in the Life of a SuiFren: Personify a SuiFren and narrate a day in its life. Explore
          the digital adventures it might have, the interactions with other SuiFrens, and its
          thoughts about the world it inhabits.
          <br />
          <br />
        </p>

        {showSelectPoem ? (
          <button onClick={onSelectPoem} className='btnweb'>
            SELECT A POEM
          </button>
        ) : (
          // You can add a button to go back to the previous content if needed
          <button onClick={handleSelectPoem} className='btnweb'>
            GO BACK
          </button>
        )}
      </div>
    </div>
  )
}

function SecondView({
  sentences,
  onShowDetails,
  searchWord,
  handleChangeSearchWord,
  handleChangeSelect,
  sortBy,
}) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isButtonVisible, setIsButtonVisible] = useState(false)

  const handlePoemClick = async sentence => {
    let submitted = await checkIfPoemSubmitted(sentence.objectId)
    if (!submitted) {
      setSelectedImage(sentence)
      setIsButtonVisible(true)
    } else {
      toast('Poem already submitted', { type: 'info' })
      setIsButtonVisible(false)
    }
  }

  return (
    <div className='w-[90%] h-[80%] row grid grid-cols-1 max-md:h-full max-md:w-full shadow-2xl mt-[20px]'>
      <div className='my-[20px] mx-[20px]'>
        <div className='flex flex-row max-md:flex-col justify-between mb-3'>
          <div className='flex flex-row justify-between items-center gap-3'>
            <h1> Title Search </h1>
            <input
              onChange={handleChangeSearchWord}
              value={searchWord}
              className='p-2'
              type='text'
              placeholder='Search Poem'
            />
          </div>
          <div className='flex flex-row justify-between items-center gap-3'>
            <h1> Sort by </h1>
            <select
              onChange={handleChangeSelect}
              defaultValue={'none'}
              value={sortBy}
              className='p-2 w-[200px]'
            >
              <option value='none'>Sort by...</option>
              <option value='title'>Title (ASC) </option>
              <option value='titledesc'>Title (DESC)</option>
              <option value='dataCreated'>Data Created (ASC)</option>
              <option value='dataCreateddesc'>Data Created (DESC)</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 max-md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 overflow-y-scroll border-2 border-black scrollable-container p-5'>
          {sentences?.map(sentence =>
            sentence.isNotUsed ? (
              <div
                key={sentence.objectId}
                className={`p-1 hover:border-2 border-black mt-1 ${
                  selectedImage?.objectId === sentence.objectId
                    ? 'shadow-2xl border-2 border-black'
                    : ''
                }`}
                onClick={() => handlePoemClick(sentence)}
              >
                <div className='flex flex-col gap-3'>
                  <Image width={350} height={350} src={sentence.imageUrl} alt={sentence.title} />
                  <div className='flex flex-row justify-between'>
                    <h2>{sentence.title}</h2>
                    <h2>
                      {month[new Date(sentence.createdAt).getMonth()]}{' '}
                      {new Date(sentence.createdAt).getDate()},{' '}
                      {new Date(sentence.createdAt).getFullYear()}
                    </h2>
                  </div>
                </div>
              </div>
            ) : (
              <div key={sentence.objectId} className=' p-1 mt-1 relative'>
                {/* Blue color overlay */}

                <div className='flex flex-col gap-3 relative z-10'>
                  <Image width={350} height={350} src={sentence.imageUrl} alt={sentence.title} />
                  <div className='flex flex-row justify-between'>
                    {/* Text: "Poem already submitted" */}
                    <h2 className='text-black' style={{ textDecoration: 'line-through' }}>
                      {sentence.title}
                    </h2>
                    <h2 className='text-black'>
                      {month[new Date(sentence.createdAt).getMonth()]}{' '}
                      {new Date(sentence.createdAt).getDate()},{' '}
                      {new Date(sentence.createdAt).getFullYear()}
                    </h2>
                  </div>
                </div>
                <div className='absolute  inset-0 flex items-center justify-center z-20'>
                  <div className='absolute overlay inset-0 opacity-75'></div>
                  <p className='text-black text-2xl font-bold z-30'>Poem already submitted</p>
                </div>
              </div>
            ),
          )}
        </div>

        <div className={`flex justify-center ${isButtonVisible ? '' : 'invisible'} `}>
          <button onClick={() => onShowDetails(selectedImage)} className='btnweb mt-5'>
            Select: {selectedImage?.title}
          </button>
        </div>
      </div>
    </div>
  )
}

function ThirdView({ poem, onSelectAnotherPoem, onSubmitPoem }) {
  const GoBack = () => {
    onSelectAnotherPoem()
  }
  return (
    <div className='max-md:h-full max-md:w-full row shadow-2xl mt-[20px] '>
      <div className='grid grid-cols-2 max-md:grid-cols-1 m'>
        <div className='my-[20px] mx-[20px]'>
          <Image width={400} height={400} src={poem.imageUrl} alt='Poem Picture' />
        </div>

        <div className='my-[20px] mx-[20px] flex flex-col items-start justify-around'>
          <h2>Title: {poem.title}</h2>
          <h2>
            CREATED: {month[new Date(poem.createdAt).getMonth()]}{' '}
            {new Date(poem.createdAt).getDate()}, {new Date(poem.createdAt).getFullYear()}
          </h2>
          <h2>BACKGROUND: {poem.background}</h2>
          <h2>WORDS USED: {poem.poem}</h2>
        </div>
      </div>

      <div className='flex justify-center mt-5 mb-2'>
        <button onClick={() => GoBack()} className='btnweb1'>
          Select a Different Poem
        </button>
      </div>
    </div>
  )
}

function Contests() {
  const [currentView, setCurrentView] = useState('first')
  const [selectedPoem, setSelectedPoem] = useState(null)
  const [sentences, setSentences] = useState(null)
  const [filteredSentence, setFilteredSentence] = useState(null)
  const wallet = useWallet()
  const [searchWord, setSearchWord] = useState('')
  const [sortBy, setSortBy] = useState('none')

  useEffect(() => {
    if (wallet.connected) getSentences()
  }, [wallet])

  useEffect(() => {
    if (sentences !== null) {
      const filtered = sentences.filter(item => {
        const title = item.title?.toLowerCase()
        const sear = searchWord.toLowerCase()
        if (title?.indexOf(sear) !== -1) return 1
        return 0
      })
      if (sortBy === 'title') {
        filtered.sort((a, b) => a.title?.localeCompare(b?.title))
      }
      if (sortBy === 'dataCreated') {
        filtered.sort((a, b) => a.createdAt - b.createdAt)
      }
      if (sortBy === 'titledesc') {
        filtered.sort((a, b) => b.title?.localeCompare(a?.title))
      }
      if (sortBy === 'dataCreateddesc') {
        filtered.sort((a, b) => b.createdAt - a.createdAt)
      }

      setFilteredSentence([...filtered])
    }
  }, [sortBy, searchWord, sentences])

  const getSentences = async () => {
    if (wallet.connected)
      (async () => {
        sleep(1000)
        const object = await getAllSentences(wallet)
        if (object !== []) {
          const used_ids = await getAllSubmittedPoems(object.map(item => item.data.objectId))
          let sent = object.map(({ data }) => ({
            objectId: data.objectId,
            // background: data.display.data.background,
            background: data.content.fields.background_image,
            description: data.display.data.description,
            imageUrl: data.display.data.image_url,
            name: data.display.data.name,
            poem: data.display.data.poem,
            title: data.display.data.title,
            author: data.display.data.author,
            createdAt: parseInt(data.content.fields.created_at),
            owner: data?.owner?.AddressOwner,
            isNotUsed: used_ids.indexOf(data.objectId) === -1,
          }))
          setSentences([...sent])
          setFilteredSentence([...sent])
        }
      })()
  }

  const handleSelectPoem = () => {
    setCurrentView('second')
  }

  const handleShowDetails = poem => {
    setSelectedPoem(poem)
    setCurrentView('third')
  }

  const handleSelectAnotherPoem = () => {
    setSelectedPoem(null)
    setCurrentView('second')
  }

  const handleSubmitPoem = async () => {
    // Add your logic for submitting the poem
    if (!wallet.connected) return
    let success = await submitPoemContest(wallet, selectedPoem.objectId, selectedPoem.owner)
    if (success == 1) {
      toast('Poem Submitted Successfully. This page will refresh', {
        type: 'success',
      })
      setTimeout(function () {
        window.location.reload()
      }, 5000)
    } else if (success == 2) {
      toast('Sorry, the submission window for this contest has ended', {
        type: 'error',
      })
    } else if (success == 3) {
      toast('Something went wrong.', { type: 'error' })
    }
  }

  const handleChangeSearchWord = e => {
    setSearchWord(e.target.value)
  }

  const handleChangeSelect = e => {
    setSortBy(e.target.value)
  }
  const scrollToPoemSubmission = () => {
    const poemSubmissionElement = document.getElementById('poem-submission')

    if (poemSubmissionElement) {
      poemSubmissionElement.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <div>
      <div className='firstsec flex items-center justify-center w-full'>
        <h1 className='text-center text-4xl  max-md:text-xs max-md:mt-[40px] mt-[150px]'>
          ANNIVERSARY POEM CONTEST
        </h1>
      </div>

      <div className='flex justify-center'>
        <p className='w-[70%] text-xl text-center mt-2'>
          We are thrilled to announce a special poetry contest to celebrate the one-year anniversary
          of SuiFrens! To mark this momentous occasion, Poetry in Motion is inviting all poets and
          blockchain enthusiasts to weave their magic!
        </p>
      </div>
      <div className='w-full flex justify-center'>
        <button
          onClick={scrollToPoemSubmission}
          className='btnweb mt-5'
          style={{ display: 'flex', alignItems: 'center' }}
        >
          Submit Poem Below
        </button>
      </div>

      <div className='flex flex-col flex-wrap content-center items-start  my-[50px] mx-[250px] max-md:m-8'>
        <h2 className='text-3xl font-bold'>Entry Requirements:</h2>
        <p>
          Entrance Fee: 1 SUI per poem submission. <br />
          Eligibility: The contest is open to all, but only SuiFren owners can vote.
          <br />
          Submission Period: December 5th 1200 UTC - December 10th 1200 UTC
          <br />
          Voting Period: December 10th 1700 UTC - December 13th 1700 UTC
          <br />
          Winners Announced: December 14th
          <br />
          *Your poem must be a live object (deleted poems will not qualify)
          <br />
        </p>

        <h2 className='text-3xl font-bold mt-3'>Voting and Prizes:</h2>
        <ul className='relative left-[2%]'>
          <li>Each SuiFren owner gets one vote.</li>
          <li>
            The top 20 poems receiving the most community votes will win exclusive SuiFrens
            accessories.
          </li>
          <li>
            The top 3 poems receiving the most community votes will be awarded a cash prize in SUI.
          </li>
          <li>
            Poetry in Motion reserves the right to award an additional winner chosen by our crack
            team of poetic degens.
          </li>
        </ul>

        <h2 className='text-3xl font-bold mt-3'>How to Enter:</h2>
        <ol className='relative left-[2%]'>
          <li>
            Visit{' '}
            <Link href='/buywordpacks' className='font-bold'>
              Buy Word Packs
            </Link>{' '}
            and purchase one or more word packs.
          </li>
          <li>
            Head to{' '}
            <Link href='/createpoems' className='font-bold'>
              Create Poems
            </Link>{' '}
            to craft your poem using the words from your packs.
          </li>
          <li>Submit your poem with the 1 SUI fee. You may submit as many poems as you like.</li>
          <li>Share your entry and encourage SuiFrens owners to vote!</li>
        </ol>
      </div>
      <div id='poem-submission' className='flex flex-col items-center justify-center my-[50px]'>
        <h2 className='text-5xl text-center'>Submit your Poem</h2>

        {currentView === 'first' && <FirstView onSelectPoem={handleSelectPoem} />}
        {currentView === 'second' && (
          <SecondView
            sentences={filteredSentence}
            onShowDetails={handleShowDetails}
            searchWord={searchWord}
            handleChangeSearchWord={handleChangeSearchWord}
            handleChangeSelect={handleChangeSelect}
            sortBy={sortBy}
          />
        )}
        {currentView === 'third' && (
          <ThirdView
            poem={selectedPoem}
            onSelectAnotherPoem={handleSelectAnotherPoem}
            onSubmitPoem={handleSubmitPoem}
          />
        )}

        {currentView === 'third' && (
          <button
            onClick={handleSubmitPoem}
            className='btnweb mt-5'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            Submit Poem{' '}
            <span style={{ marginLeft: '10px' }} className='price'>
              1
            </span>
            <Image src={sui} height={15} alt='Logo' style={{ marginLeft: '3px' }} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Contests
