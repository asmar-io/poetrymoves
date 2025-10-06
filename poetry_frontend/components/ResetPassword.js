import { useEffect, useRef } from 'react'
import { clickOutside } from '../utils/DOM'
import { DialogStyled } from './StyledDialog'
import CommonButton from './CommonButton'

export default function ResetPassword({ setModalState }) {
  const wrapperRef = useRef(null)

  /**
   *
   * @param {MouseEvent} event
   * @returns
   */
  function handleClickOutside(event) {
    if (wrapperRef.current && clickOutside(event.x, event.y, wrapperRef.current)) {
      wrapperRef.current.close()
      setModalState('')
    }
  }

  /**
   *
   * @param { FormDataEvent } event
   */
  function handleResetPassword(event) {
    event.preventDefault()
  }

  useEffect(() => {
    wrapperRef.current && wrapperRef.current.showModal()

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <DialogStyled style={{ width: 'min(100%, 20rem)' }} ref={wrapperRef}>
      <h2 className='text-xl text-center'>Reset password</h2>

      <form onSubmit={event => handleResetPassword(event)} className='flex flex-col gap-2 mt-4'>
        <span className='text-sm'>Email</span>
        <input type='email' id='user-input' className='bg-gray-200 rounded-md px-2 py-1' />

        <div className='actions flex items-center justify-center mt-6'>
          <CommonButton type='submit' className='bg-black text-white'>
            Send Email
          </CommonButton>
        </div>
      </form>
    </DialogStyled>
  )
}
