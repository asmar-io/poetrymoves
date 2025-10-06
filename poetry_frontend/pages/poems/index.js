import { useEffect, useState } from 'react'
import { useWallet } from '@suiet/wallet-kit'
import { getPoems, sleep } from '../../utils/sui'
import PoemCardView from '../../components/PoemCardView'
import Link from 'next/link'
import Head from 'next/head'

const poems = () => {
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
  useEffect(() => {
    getAllPoems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet])

  const getAllPoems = async () => {
    ;(async () => {
      sleep(1000)
      const object = await getPoems()
      if (object != []) {
        const sent = object?.map(({ data }) => ({
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
      }
    })()
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
        <title>Poetry in Motion - Poems</title>
        <meta
          name='description'
          content='Poetry in Motion is the first creative writing collectible card game in web3. Express your wit and creativity by crafting poetic masterpieces stored on the Sui blockchain.'
        />
      </Head>
      <h1 className='mb-4 text-4xl md:text-6xl tracking-tight'>Recent Poems</h1>
      <p className='font-light text-2xl'></p>
      <p className='font-light text-2xl'></p>

      <div className='grid p-4 mx-auto md:grid-cols-12 py-6 m-6'>
        <div className='mx-auto md:col-span-12 w-full gap-4 p-2 '>
          <div className='grid py-4 mx-auto gap-4 md:grid-cols-12'>
            {filteredSentence !== null && filteredSentence.length > 0 ? (
              filteredSentence.map((item, index) => (
                <div key={index} className='mx-auto md:col-span-4 w-full p-2'>
                  <PoemCardView poem={item} />
                </div>
                // eslint-disable-next-line react/no-unescaped-entities
              ))
            ) : searchWord !== '' ? (
              <p className='mx-auto md:col-span-12 w-full p-2 text-2xl text-center'>
                You don’t have any poems that match your filter criteria.
              </p>
            ) : (
              <p className='mx-auto md:col-span-12 w-full p-2 text-2xl text-start'></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default poems
