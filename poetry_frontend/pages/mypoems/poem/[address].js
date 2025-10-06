import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useWallet } from '@suiet/wallet-kit'
import fetch from 'node-fetch'
import Head from 'next/head'
import PoemCard from '../../../components/PoemCard'
import { getPoem } from '../../../utils/sui'
import Image from 'next/image'
import { month } from '../../../utils/ipfs'

const Poem = () => {
  const wallet = useWallet()
  const [poem, setPoem] = useState(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { address } = router.query

  useEffect(() => {
    if (address) {
      // Define your logic to fetch the poem by its address here
      fetchPoemByAddress(address)
        .then(fetchedPoem => {
          setPoem(fetchedPoem)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching poem:', error)
          setLoading(false)
        })
    }
  }, [address, wallet.connected])
  function formatTimestamp(timestamp) {
    if (timestamp) {
      const date = new Date(parseInt(timestamp))
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    }
    return ''
  }

  // Render the poem content here
  return (
    <div className='text-center w-full flex justify-center'>
      <Head>
        <title>Poetry in Motion - Poem</title>
        <meta
          name='description'
          content='Poetry in Motion is the first creative writing collectible card game in web3. Express your wit and creativity by crafting poetic masterpieces stored on the Sui blockchain.'
        />
      </Head>
      <div className='flex flex-col items-center w-3/4'>
        <h1 className='mb-4 text-4xl md:text-6xl tracking-tight'>{poem?.content?.fields?.title}</h1>
        {poem?.content?.fields?.image_url ? (
          <Image
            priority
            alt='Picture'
            src={poem?.content?.fields?.image_url}
            width={50}
            height={50}
            className='w-full border border-gray-400'
          />
        ) : null}
        {loading ? <p>Loading...</p> : null}
        {poem ? (
          <div className='my-5' style={{ textAlign: 'left' }}>
            <p>
              <span className='font-bold'>Words:</span> {poem?.content?.fields?.sentence}
            </p>
            <p>
              <span className='font-bold'>Author:</span> {poem?.content?.fields?.author}
            </p>
            <p>
              <span className='font-bold'>Created:</span>{' '}
              {formatTimestamp(poem?.content?.fields?.created_at)}
            </p>
            {/* Render other poem details as needed */}
          </div>
        ) : null}
        {!loading && !poem ? <p>No poem found for this address.</p> : null}
      </div>
    </div>
  )
}

export default Poem

// Define a function to fetch the poem by its address
async function fetchPoemByAddress(address) {
  try {
    console.log(address)
    // Use your logic to fetch the poem by its address from the blockchain
    const poem = await getPoem(address)
    console.log(poem)
    if (!poem) {
      throw new Error('Failed to fetch poem.')
    }
    return poem
  } catch (error) {
    throw error
  }
}
