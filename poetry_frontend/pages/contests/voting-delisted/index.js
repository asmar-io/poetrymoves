import React, { useState, useEffect } from 'react'
import beach_day from '../../../assets/images/cherry_blossoms.jpeg'
import left_time from '../../../assets/images/left-time.png'
import right_time from '../../../assets/images/right-time.png'
import below_time from '../../../assets/images/below-time.png'
import arrowright from '../../../assets/images/arrow_right.png'
import arrowleft from '../../../assets/images/arrow_left.png'
import dot from '../../../assets/images/left-dot.png'
import sui from '../../../assets/images/suilogo.svg'
import thumb from '../../../assets/images/thumb.png'
import Image from 'next/image'
import { useWallet } from '@suiet/wallet-kit'
import {
  getContestPoems,
  voteContest,
  getContestInfo,
  formatSuiAddress,
  sleep,
} from '../../../utils/sui'
import { toast } from 'react-toastify'

function FirstView({ onSelectPoem }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [showSelectPoem, setShowSelectPoem] = useState(false)
  const [selectedSentence, setSelectedSentence] = useState(null)
  const [searchWord, setSearchWord] = useState('')
  const wallet = useWallet()
  const [sentences, setSentences] = useState(null)
  const [filteredSentence, setFilteredSentence] = useState(null)
  const [sortBy, setSortBy] = useState('none')
  const [selectedPoemTitle, setSelectedPoemTitle] = useState('')

  const handleSelectPoem = sentence => {
    setShowSelectPoem(true)
    setSelectedPoemTitle(sentence.title)
    setSelectedSentence(sentence.objectId)
    // setShowSelectPoem(!showSelectPoem);
  }

  const handleVote = async () => {
    let success = await voteContest(wallet, selectedSentence)
    if (success == 3) {
      toast('Voted Successfully.', { type: 'success' })
    } else if (success == 1) {
      toast('You have already used all of your votes. You only get 1 vote per SuiFren you own.', {
        type: 'info',
      })
    } else if (success == 2) {
      toast('Sorry, the voting window for this contest has ended', {
        type: 'info',
      })
    }
  }

  const handleTimer = async () => {
    // run asynchronous tasks here
    const contest_data = await getContestInfo()
    let contest_end_date = contest_data?.content?.fields?.voting_end_time
    // const contest_end_date = new Date('2023-12-31T23:59:59').getTime();
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
    handleTimer()
  }, [])

  useEffect(() => {
    if (sentences !== null) {
      const filtered = sentences.filter(item => {
        const title = item.title?.toLowerCase()
        const author = item.author?.toLowerCase()
        const sear = searchWord.toLowerCase()
        if (title?.indexOf(sear) !== -1 || author?.indexOf(sear) !== -1) return 1
        return 0
      })
      if (sortBy === 'title') {
        filtered.sort((a, b) => a.title?.localeCompare(b?.title))
      }
      if (sortBy === 'votesasc') {
        filtered.sort((a, b) => a.votes - b.votes)
      }
      if (sortBy === 'titledesc') {
        filtered.sort((a, b) => b.title?.localeCompare(a?.title))
      }
      if (sortBy === 'votesdesc') {
        filtered.sort((a, b) => b.votes - a.votes)
      }

      setFilteredSentence([...filtered])
    }
  }, [sortBy, searchWord, sentences])

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getSentences()
  }, [wallet])

  const getSentences = async () => {
    if (wallet.connected)
      (async () => {
        sleep(1000)
        const poem_objects = await getContestPoems()
        console.log(poem_objects)
        if ((poem_objects != undefined) & (poem_objects != [])) {
          const sent = poem_objects.map(({ data, index }) => ({
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
            votes: data.content.fields.votes,
          }))
          sent.sort((a, b) => b.votes - a.votes)
          setSentences([...sent])
          setFilteredSentence([...sent])
        }
      })()
  }

  const handleNextPage = () => {
    //if (currentPage < totalPageCount) {
    //setCurrentPage(currentPage + 1);
    // }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageClick = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const handleChangeSearchWord = e => {
    setSearchWord(e.target.value)
  }

  const handleChangeSelect = e => {
    setSortBy(e.target.value)
  }

  return (
    <div className='row grid grid-cols-6 max-md:grid-cols-1 max-md:h-full max-md:w-full'>
      <div className='my-[20px] mt-[100px]'>
        <div className='flex flex-row justify-between items-center'>
          <Image className='w-auto' src={dot} alt='Poem Picture' />
          <Image className='w-auto' src={left_time} alt='Poem Picture' />

          <h3 className='text-4xl text-center'>TIME LEFT</h3>
          <Image className='w-auto' src={right_time} alt='Poem Picture' />
          <Image className='w-auto' src={dot} alt='Poem Picture' />
        </div>
        <hr />

        <div className='timer flex justify-center gap-0 text-center mt-5'>
          <div className='mx-1'>
            <p>&nbsp;Days&nbsp;</p>
            <div className='timeline'>
              <span>{timeLeft.days.toString()}</span>
            </div>
          </div>
          <div className='mx-1'>
            <p>Hours</p>
            <div className='timeline'>
              <span>{timeLeft.hours < 10 ? `0` : timeLeft.hours.toString().charAt(0)}</span>
              <span>{timeLeft.hours.toString().slice(-1)}</span>
            </div>
          </div>
          <div className='mx-1'>
            <p>Minutes</p>
            <div className='timeline'>
              <span>{timeLeft.minutes < 10 ? `0` : timeLeft.minutes.toString().charAt(0)}</span>
              <span>{timeLeft.minutes.toString().slice(-1)}</span>
            </div>
          </div>
          <div className='mx-1'>
            <p>Seconds</p>
            <div className='timeline'>
              <span>{timeLeft.seconds < 10 ? `0` : timeLeft.seconds.toString().charAt(0)}</span>
              <span>{timeLeft.seconds.toString().slice(-1)}</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col max-md:flex-col justify-start my-3'>
          <div className='flex flex-col items-start gap-3'>
            <h1> Title Search </h1>
            <input
              onChange={handleChangeSearchWord}
              value={searchWord}
              className='p-2  w-full'
              type='text'
              placeholder='Search Poem'
            />
          </div>
          <div className='flex flex-col items-start gap-3 mt-3'>
            <h1> Sort by </h1>
            <select
              onChange={handleChangeSelect}
              defaultValue={'none'}
              value={sortBy}
              className='p-2 w-full'
            >
              <option value='none'>Sort poems by...</option>
              <option value='title'>Title (ASC) </option>
              <option value='titledesc'>Title (DESC)</option>
              <option value='votesasc'>Votes (ASC)</option>
              <option value='votesdesc'>Votes (DESC)</option>
            </select>
          </div>
        </div>
      </div>

      <div className='my-[20px] mx-[20px] flex flex-col justify-center col-span-5 items-center'>
        <h3 className='text-5xl my-3'>Cast your vote for the best poem</h3>
        <p className='mb-5'>You must have a SuiFren to vote. Limit 1 vote per SuiFren.</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 max-md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-4 w-full'>
          {filteredSentence?.map(poem => (
            <div
              key={poem.objectId}
              // className="image-container"
              className={`image-container ${
                poem && poem.objectId === selectedSentence ? 'selected' : ''
              }`}
              onClick={() => handleSelectPoem(poem)}
            >
              <div className='image-content'>
                <Image
                  className='w-full'
                  width={400}
                  height={400}
                  src={poem.imageUrl}
                  alt={poem.title}
                />
                <div className='flex flex-row justify-between'>
                  <div>
                    <h2 className='font-bold'>TITLE: {poem.title}</h2>
                    <h2 className='font-bold'>AUTHOR: {formatSuiAddress(poem.author)}</h2>
                    <p className='text-sm'></p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Image src={thumb} />
                    <h2>{poem.votes}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-row items-center gap-5 h-[75px]'>
          <Image onClick={handlePrevPage} disabled={false} src={arrowleft} className='arrowimg' />
          <span
            key={1}
            className={`pagination-number ${1 === 1 ? 'active' : ''}`}
            onClick={() => handlePageClick(1)}
          >
            {1}
          </span>
          <Image onClick={handleNextPage} disabled={true} src={arrowright} className='arrowimg' />
        </div>
      </div>

      {showSelectPoem && (
        <div className='sticky-button-container'>
          <button onClick={handleVote} class='btnweb'>
            VOTE FOR {selectedPoemTitle}
          </button>
          <p>Remember: You only get one vote per SuiFren</p>
        </div>
      )}
    </div>
  )
}

function Voting() {
  const [currentView, setCurrentView] = useState('first') // Initialize with the first view
  const [selectedPoem, setSelectedPoem] = useState(null)

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

  const handleSubmitPoem = () => {
    // Add your logic for submitting the poem
  }

  return (
    <div>
      <div className='firstsec flex items-center justify-center w-full'>
        <h1 className='text-center text-5xl mt-[150px]'>TIME TO VOTE</h1>
      </div>

      <div className='flex flex-col items-center justify-center'>
        <FirstView onSelectPoem={handleSelectPoem} />
      </div>
    </div>
  )
}

export default Voting
