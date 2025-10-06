import Image from 'next/image'
import Jumbo from '../../assets/images/Jumbo_pack.png'
import Colossal from '../../assets/images/Colossal_pack.png'
import Starter from '../../assets/images/Starter_pack.png'
import { useEffect, useState } from 'react'
import BuyWordPack from '../../components/BuyWordPack'
import { useWallet } from '@suiet/wallet-kit'
import { load, mintPack } from '../../utils/sui'
import CommonButton from '../../components/CommonButton'
import { toast } from 'react-toastify'
import SUILogo from '../../assets/images/sui_drop.png'
import Head from 'next/head'

const buypoems = () => {
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

  const handleStarter = async () => {
    if (!wallet.connected) {
      toast('Please connect your wallet.', { type: 'warning' })
      return
    }
    setIsLoading(true)
    setSelectedBG('starter')
    const newW = await mintPack('Basic', wallet)
    setNewWords([...newW])
    setIsLoading(false)
  }
  const handleJumbo = async () => {
    if (!wallet.connected) {
      toast('Please connect your wallet.', { type: 'warning' })
      return
    }
    setIsLoading(true)
    setSelectedBG('jumbo')
    const newW = await mintPack('Black Turtleneck', wallet)
    console.log(newW)
    setNewWords([...newW])
    setIsLoading(false)
  }
  const handleColossal = async () => {
    if (!wallet.connected) {
      toast('Please connect your wallet.', { type: 'warning' })
      return
    }
    setIsLoading(true)
    setSelectedBG('colossal')
    const newW = await mintPack('Open Mic Night', wallet)
    setNewWords([...newW])
    setIsLoading(false)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (newWords.length > 0) setShowPoem(true)
  }, [newWords])
  return (
    <div className='text-center w-full'>
      <Head>
        <title>Poetry in Motion - Buy Poems</title>
        <meta
          name='description'
          content='Poetry in Motion is the first creative writing collectible card game in web3. Express your wit and creativity by crafting poetic masterpieces stored on the Sui blockchain.'
        />
      </Head>
      {/*<h1 className="text-4xl md:text-6xl tracking-tight">Buy Poems</h1>*/}

      <div className='mx-auto'>
        <label htmlFor='title' className='align-middle font-medium text-gray-900'>
          Marketplace coming soon
        </label>
      </div>

      {/*
      <div className="grid mx-auto gap-4 lg:grid-cols-12 p-6 m-2">
        <div className="mx-auto lg:col-span-3 w-full p-2">
          <div>
            <label
              htmlFor="title"
              className="block mb-2 mt-4 text-xl font-medium text-gray-900"
            >
              Title Searchs
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-gray-600 block w-full p-2.5"
              placeholder="Search poems by title..."
              required=""
            />
          </div>
          <div>
            <label
              htmlFor="sortby"
              className="block mb-2 mt-4 text-xl font-medium text-gray-900"
            >
              Max Price (SUI)
            </label>
            <select
              id="sortby"
              defaultValue={"none"}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-blue-500 block w-full p-2.5 "
            >
              <option value="none">Sort poems by...</option>
              <option value="title">Title</option>
              <option value="dataCreated">Data Created</option>
            </select>
          </div>
        </div>
        <div className="mx-auto lg:col-span-9 w-full p-6">
          <div className="grid py-4 mx-auto gap-8 md:grid-cols-12">
            <div className="mx-auto md:col-span-4 w-full p-6">
              <Image
                priority
                alt="Picture"
                src={Colossal}
                className="w-full border border-gray-400"
              />
              <p className="font-light sm:text-xl">10 SUI <Image className="inline" height={20} src={SUILogo} alt="" /></p>
              <CommonButton
                onClick={handleColossal}
                className={
                  "hover:bg-[#4abd6a] hover:text-white border border-black border-b-2 border-r-2 bg-white hover:border-black uppercase text-2xl px-5 py-2.5 text-center h-fit min-w-fit m-2"
                }
                isLoading={isLoading && selectedBG === "colossal"}
              >
                Buy Pack
              </CommonButton>
            </div>
          </div>
        </div>
      </div>
      {showPoem && (
        <BuyWordPack
          setShowPoem={setShowPoem}
          words={newWords}
          background={selectedBG}
        />
      )}
    */}
    </div>
  )
}

export default buypoems
