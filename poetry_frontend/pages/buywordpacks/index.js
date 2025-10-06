import Image from 'next/image'
import Jumbo from '../../assets/images/Jumbo_pack.png'
import Colossal from '../../assets/images/Colossal_pack.png'
import Starter from '../../assets/images/Starter_pack.png'
import Bullshark from '../../assets/images/Bullshark_pack.png'
import Crypto from '../../assets/images/crypto_pack.png'
import { useEffect, useState } from 'react'
import BuyWordPack from '../../components/BuyWordPack'
import { useWallet } from '@suiet/wallet-kit'
import { mintPack } from '../../utils/sui'
import { toast } from 'react-toastify'
import SUILogo from '../../assets/images/sui_drop.png'
import SingleWordPack from '../../components/SingleWordPack'
import Head from 'next/head'
import { useCurrentUser } from '../../hooks/useAuth'
import axios from '../../utils/axios'
import { mintPackCustodial } from '../../utils/cutodial'

const buywordpacks = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showPoem, setShowPoem] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedBG, setSelectedBG] = useState('starter')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [newWords, setNewWords] = useState([])
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const wallet = useWallet()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [maxPriceSui, setMaxPriceSui] = useState(0)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [searchWord, setSearchWord] = useState('')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [filteredPacks, setFilteredPacks] = useState(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: user } = useCurrentUser()

  const packs = [
    { id: 1, title: 'SUI PACK', image: Bullshark, sui: 3, type: 'suipack' },
    { id: 2, title: 'STARTER PACK', image: Starter, sui: 3, type: 'starter' },
    { id: 3, title: 'JUMBO PACK', image: Jumbo, sui: 5, type: 'jumbo' },
    {
      id: 4,
      title: 'COLOSSAL PACK',
      image: Colossal,
      sui: 7,
      type: 'colossal',
    },
    { id: 5, title: 'DEGEN PACK', image: Crypto, sui: 10, type: 'degen' },
  ]

  const packMap = {
    starter: { name: 'Starter', price: 3 },
    jumbo: { name: 'Jumbo', price: 5 },
    colossal: { name: 'Colossal', price: 7 },
    degen: { name: 'Degen Pack', price: 10 },
    test: { name: 'Test Pack', price: 1 },
    bullshark: { name: 'Sui Pack', price: 3 },
    suipack: { name: 'Sui Pack', price: 3 },
  }

  // mint pack logic wrapper
  const mintPackWrapper = async packName => {
    const packObj = packMap[packName]
    const price = process.env.NEXT_PUBLIC_SUI_NETWORK === 'testnet' ? 1 : packObj.price

    // connected wallet flow
    if (wallet.connected) {
      setIsLoading(true)
      setSelectedBG(packName)
      const newW = await mintPack(packObj.name, price, wallet)
      setNewWords([...newW])
      setIsLoading(false)
    }
    // stripe flow
    else if (user) {
      const contractData = await mintPackCustodial(packObj.name, price, user.wallet)

      // set success url
      const currentBaseUrl = `${window.location.protocol}//${window.location.host}`
      const returnUrl = `${currentBaseUrl}/createpoems?action=fiat-mint-pack&status=success`
      const cancelUrl = `${currentBaseUrl}/buywordpacks`

      // enter checkout flow
      axios
        .post('/fiat/checkout', {
          currency_listed: 'SUI',
          currency_to_charge: 'USD',
          items: [
            {
              name: packObj.name,
              price: packObj.price,
              quantity: 1,
            },
          ],
          success_url: returnUrl,
          cancel_url: cancelUrl,
          metadata: contractData,
        })
        .then(res => {
          window.location.href = res.data.url
        })
    } else {
      toast('Please connect your wallet, or Sign In', { type: 'warning' })
      return
    }
  }

  const handleClickBuyPack = item => {
    if (item.type === 'starter') {
      mintPackWrapper('starter')
    } else if (item.type === 'jumbo') {
      mintPackWrapper('jumbo')
    } else if (item.type === 'colossal') {
      mintPackWrapper('colossal')
    } else if (item.type === 'degen') {
      mintPackWrapper('degen')
    } else if (item.type === 'test') {
      mintPackWrapper('test')
    } else {
      mintPackWrapper('bullshark')
    }
  }

  const handleChangeSearchWord = e => {
    setSearchWord(e.target.value)
  }

  const handleChangeMaxPrice = e => {
    setMaxPriceSui(e.target.value)
  }

  const getPacksInfo = async () => {
    setFilteredPacks(packs)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getPacksInfo()
  }, [])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (packs !== null) {
      let filtered = packs

      if (searchWord || maxPriceSui) {
        filtered = filtered.filter(item => {
          const title = item.title.toLowerCase()
          const keyword = searchWord.toLowerCase()
          const maxPrice = parseInt(maxPriceSui)

          const titleMatches = searchWord ? title.includes(keyword) : true
          const priceMatches = maxPriceSui ? parseInt(item.sui) <= maxPrice : true

          return titleMatches && priceMatches
        })
      }
      setFilteredPacks(filtered)
    }
  }, [searchWord, maxPriceSui])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (newWords.length > 0) setShowPoem(true)
  }, [newWords])

  return (
    <div className='text-center w-full'>
      <Head>
        <title>Poetry in Motion - Buy Word Packs</title>
        <meta
          name='description'
          content='Poetry in Motion is the first creative writing collectible card game in web3. Express your wit and creativity by crafting poetic masterpieces stored on the Sui blockchain.'
        />
      </Head>
      <h1 className='text-4xl md:text-6xl tracking-tight'>Buy Word Packs</h1>
      <p className='font-light text-2xl px-2 pt-4'>
        Need new words to fuel your creation? Here’s the place, no hesitation!
      </p>
      <p className='font-light text-2xl px-2'>
        Buy what you need, let your words unfold. A poet’s treasure, more precious than gold.
      </p>

      <div className='grid mx-auto lg:grid-cols-12 py-6 m-2'>
        <div className='mx-auto lg:col-span-2 w-full p-6 md:p-2'>
          <div>
            <label
              htmlFor='title'
              className='block mb-2 mt-4 text-xl font-medium text-gray-900 flex self-start'
            >
              Theme Search
            </label>
            <input
              type='text'
              name='title'
              id='title'
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-gray-600 block w-full p-2.5'
              placeholder='Search for themes...'
              required=''
              onChange={handleChangeSearchWord}
              value={searchWord}
            />
          </div>
          <div>
            <label
              htmlFor='sortby'
              className='block mb-2 mt-4 text-xl font-medium text-gray-900 flex self-start'
            >
              Max Price (SUI)
            </label>
            <div className='flex flex-row'>
              <input
                type='number'
                name='title'
                id='title'
                className='text-right bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-gray-600 block p-2.5 w-11/12'
                placeholder='100'
                required=''
                onChange={handleChangeMaxPrice}
                // value={maxPriceSui}
              />
              <div className='w-1/12 flex justify-center'>
                <Image className='inline self-center' height={25} src={SUILogo} alt='' />
              </div>
            </div>
          </div>
          <div>
            <p className='font-light text-1xl mt-7 text-left'>
              Basic packs (Starter, Jumbo, and Colossal) are randomly selected from a word bank of
              over 4,000 common words and contain all the parts of speech necessary to create a
              poem. Themed expansion packs are collections of additional words centered around a
              particular topic or theme.
            </p>
          </div>
        </div>
        <div className='mx-auto lg:col-span-10 w-full p-6 md:ml-10'>
          <div className='grid py-4 mx-auto gap-8 md:grid-cols-12'>
            {filteredPacks !== null && filteredPacks.length > 0 ? (
              filteredPacks?.map((item, index) => (
                <div key={index} className='mx-auto md:col-span-3 w-full p-6'>
                  <SingleWordPack
                    pack={item}
                    onClick={() => handleClickBuyPack(item)}
                    isLoading={isLoading}
                    selectedBG={selectedBG}
                  />
                </div>

                // eslint-disable-next-line react/no-unescaped-entities
              ))
            ) : (
              <p className='mx-auto md:col-span-12 w-full p-2 text-2xl text-center'>
                {filteredPacks?.length === 0 &&
                  'We don’t have any word packs that match your filter criteria.'}
              </p>
            )}
          </div>
        </div>
      </div>
      {showPoem && (
        <BuyWordPack setShowPoem={setShowPoem} words={newWords} background={selectedBG} />
      )}
    </div>
  )
}

export default buywordpacks
