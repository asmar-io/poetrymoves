import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const WordsFadeIn = ({ ImagesDataSet, background }) => {
  const [isShow, setIsShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsShow(false), 1000)
    return () => clearTimeout(timer)
  })
  return (
    <div className=''>
      {isShow ? (
        <></>
      ) : (
        <div className='flex justify-center'>
          <div
            className='absolute flex flex-wrap justify-center items-start absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            style={{ width: '40%' }}
          >
            {ImagesDataSet?.map((item, index) => {
              let widthClass
              if (ImagesDataSet.length === 10) {
                if (index < 3 || (index >= 7 && index < 10)) {
                  widthClass = 'w-1/3'
                } else {
                  widthClass = 'w-1/4'
                }
              } else {
                widthClass = 'w-1/3'
              }
              return (
                <div
                  className={`sliderWord ${widthClass} p-1`}
                  key={index}
                  style={{
                    transform: `rotate(${Math.random() * (20 - -20) + -20}deg) matrix(1, ${
                      (Math.random() * (8 + 8) - 8) / 100
                    }, 0, 1, 0, 0)`,
                    animationDelay: `${0.3 * index}s`,
                  }}
                >
                  <Image alt='wordItem' src={item.image} className='' />
                </div>
              )
            })}
          </div>
        </div>
      )}
      <Image alt='backgroundImage' src={background} />
    </div>
  )
}

export default WordsFadeIn
