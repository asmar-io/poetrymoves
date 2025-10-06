import Image from 'next/image'
import SUILogo from '../assets/images/sui_drop.png'
import CommonButton from '../components/CommonButton'

const SingleWordPack = ({ pack, onClick, isLoading, selectedBG }) => {
  return (
    <>
      <Image priority alt='Picture' src={pack.image} className='w-full border border-gray-400' />
      <p className='font-light sm:text-xl'>
        {pack.sui} SUI <Image className='inline' height={20} src={SUILogo} alt='' />
      </p>
      <CommonButton
        onClick={onClick}
        className={
          'hover:bg-[#4abd6a] hover:text-white border border-black border-b-2 border-r-2 bg-white hover:border-black uppercase text-1xl px-5 py-2.5 text-center h-fit min-w-fit m-2'
        }
        isLoading={isLoading && selectedBG === pack.packType}
      >
        Buy Pack
      </CommonButton>
    </>
  )
}

export default SingleWordPack
