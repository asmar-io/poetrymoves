import { useWallet } from '@suiet/wallet-kit'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import PoemCard from '../../components/PoemCard'
import { useCurrentUser } from '../../hooks/useAuth'
import { getAllSentences, sleep } from '../../utils/sui'

const mypoems = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const wallet = useWallet()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [sentences, setSentences] = useState(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [sortBy, setSortBy] = useState('none')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [searchWord, setSearchWord] = useState('')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [filteredSentence, setFilteredSentence] = useState(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: user } = useCurrentUser()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!wallet.connected && !user) return

    getSentences()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, user])

  const getSentences = async () => {
    if (wallet.connected || user) {
      const walletObj = wallet.connected ? wallet : user.wallet
      ;(async () => {
        sleep(1000)
        const object = await getAllSentences(walletObj)
        const sent = object.map(({ data }) => ({
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
        }))
        setSentences([...sent])
        setFilteredSentence([...sent])
      })()
    }
  }

  const updateSentences = poemId => {
    const filtered = sentences.filter(item => item.objectId !== poemId)
    setSentences([...filtered])
  }

  const handleChangeSearchWord = e => {
    setSearchWord(e.target.value)
  }

  const handleChangeSelect = e => {
    setSortBy(e.target.value)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  return (
    <div className='text-center w-full'>
      <Head>
        <title>Poetry in Motion - My Poems</title>
        <meta
          name='description'
          content='Poetry in Motion is the first creative writing collectible card game in web3. Express your wit and creativity by crafting poetic masterpieces stored on the Sui blockchain.'
        />
      </Head>
      <h1 className='mb-4 text-4xl md:text-6xl tracking-tight'>My Poems</h1>
      <p className='font-light text-2xl'>
        Here lies your art in stanzas and lines, ready to share or redefine.
      </p>
      <p className='font-light text-2xl'>
        Share them wide or break for fun, the poetry game is never done.
      </p>

      <div className='grid p-4 mx-auto md:grid-cols-12 py-6 m-6'>
        <div className='mx-auto md:col-span-2 w-full p-2'>
          <div>
            <label htmlFor='title' className='block mb-2 text-xl font-medium text-gray-900'>
              Title Search
            </label>
            <input
              onChange={handleChangeSearchWord}
              value={searchWord}
              type='text'
              name='title'
              id='title'
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-gray-600 block w-full p-2.5'
              placeholder='Search poems by title...'
              required=''
            />
          </div>
          <div>
            <label htmlFor='sortby' className='block mb-2 text-xl font-medium text-gray-900'>
              Sort By
            </label>
            <select
              onChange={handleChangeSelect}
              defaultValue={'none'}
              value={sortBy}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:border-blue-500 block w-full p-2.5 '
            >
              <option value='none'>Sort poems by...</option>
              <option value='title'>Title (ASC) </option>
              <option value='titledesc'>Title (DESC)</option>
              <option value='dataCreated'>Data Created (ASC)</option>
              <option value='dataCreateddesc'>Data Created (DESC)</option>
            </select>
          </div>
        </div>
        <div className='mx-auto md:col-span-10 w-full gap-4 p-2 md:ml-10'>
          <div className='grid py-4 mx-auto gap-4 md:grid-cols-12'>
            {filteredSentence !== null && filteredSentence.length > 0 ? (
              filteredSentence.map((item, index) => (
                <div key={index} className='mx-auto md:col-span-4 w-full p-2'>
                  <PoemCard poem={item} update={updateSentences} />
                </div>
                // eslint-disable-next-line react/no-unescaped-entities
              ))
            ) : searchWord !== '' ? (
              <p className='mx-auto md:col-span-12 w-full p-2 text-2xl text-center'>
                You don’t have any poems that match your filter criteria.
              </p>
            ) : (
              <p className='mx-auto md:col-span-12 w-full p-2 text-2xl text-start'>
                You don’t have any poems! Head to the{' '}
                <Link
                  href='/createpoems'
                  className='underline underline-offset-4 decoration-dotted'
                >
                  Create Poems
                </Link>{' '}
                page to write your first poem.
              </p>
            )}

            {!(wallet.connected || user) && (
              <p className='text-2xl text-center mx-auto md:col-span-12 w-full p-2'>
                Please connect your wallet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default mypoems
