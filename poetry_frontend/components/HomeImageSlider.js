import React, { useEffect, useState } from 'react'
import catBackground from '../assets/images/cat.png'
import beachBackground from '../assets/images/beach.png'
import cowsBackground from '../assets/images/cows.png'
import desertBackground from '../assets/images/desert.png'
import Image from 'next/image'
import arrowLeft from '../assets/images/arrow_left.png'
import arrowRight from '../assets/images/arrow_right.png'
import { Fade } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'
import Link from 'next/link'
import CommonButton from './CommonButton'
import WordsFadeIn from './WordsFadeIn'
import { BeachDataSet, CowDataSet, DesertDataSet, CatDataSet } from '../utils/wordSets'

const HomeImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNextSlideChange = (oldIndex, newIndex) => {
    setCurrentSlide(newIndex)
  }
  return (
    <div className='flex items-center justify-center flex-col mt-12'>
      <div className='w-full' style={{ width: '75%' }}>
        <Fade
          {...properties}
          autoplay={false}
          infinite={true}
          indicators={true}
          onStartChange={handleNextSlideChange}
        >
          <div className='each-slide'>
            {currentSlide === 0 && (
              <WordsFadeIn background={beachBackground} ImagesDataSet={BeachDataSet} />
            )}
          </div>
          <div className='each-slide'>
            {currentSlide === 1 && (
              <WordsFadeIn background={cowsBackground} ImagesDataSet={CowDataSet} />
            )}
          </div>
          <div className='each-slide'>
            {currentSlide === 2 && (
              <WordsFadeIn background={desertBackground} ImagesDataSet={DesertDataSet} />
            )}
          </div>
          <div className='each-slide'>
            {currentSlide === 3 && (
              <WordsFadeIn background={catBackground} ImagesDataSet={CatDataSet} />
            )}
          </div>
        </Fade>
      </div>

      <div className='text-center w-full mt-6'>
        <p className='font-light text-3xl'>Buy a pack and start playing today!</p>
      </div>

      <Link href='/buywordpacks'>
        <CommonButton
          onClick={() => {}}
          className={
            'border border-1 border-b-2 border-black w-fit self-center text-center text-3xl teinline-flex items-center py-4 px-12 m-6 uppercase font-bold text-neutral-900 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400'
          }
          style={{
            backgroundColor: '#4abd6a',
          }}
        >
          Get Words
        </CommonButton>
      </Link>
    </div>
  )
}

const properties = {
  prevArrow: (
    <div className='arrowStyleLeft'>
      <Image alt='arrowLeft' src={arrowLeft} />
    </div>
  ),
  nextArrow: (
    <div className='arrowStyleRight'>
      <Image alt='arrowRight' src={arrowRight} />
    </div>
  ),
}

export default HomeImageSlider
