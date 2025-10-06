import { useEffect, useRef } from 'react'
import { clickOutside } from '../utils/DOM'
import { DialogStyled } from './StyledDialog'
import { styled } from 'styled-components'
import CommonButton from './CommonButton'
import GoogleLogo from '../assets/images/google.png'
import Image from 'next/image'
import { auth } from '../hooks/useAuth'
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const CloseButton = styled.button`
  --w: 1.4rem;
  position: relative;
  width: var(--w);
  height: var(--w);

  &::before,
  &::after {
    --h: calc(var(--w) * 0.1);
    content: '';
    width: var(--w);
    height: var(--h);
    background: black;
    border: none;
    border-radius: var(--w);
    position: absolute;
    left: 50%;
    top: 50%;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(45deg);
  }
`

export default function SignInMain({ setModalState, setShowConnect }) {
  const wrapperRef = useRef(null)
  const [user] = useAuthState(auth)
  const [_signInGoogle] = useSignInWithGoogle()

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

  function handleConnect() {
    setModalState('')
    setShowConnect(true)
  }

  function signInWithGoogle() {
    const provider = new GoogleAuthProvider()

    provider.addScope('profile')
    provider.addScope('email')

    signInWithPopup(auth, provider)
      .then(res => {
        localStorage.setItem('user-data', JSON.stringify(res.user))
        setModalState('login')
      })
      .catch(err => {
        console.log('ERROR: ', err)
        localStorage.removeItem('user-data')
      })
  }

  useEffect(() => {
    if (user) {
      setModalState('login')
      return
    }

    wrapperRef.current && wrapperRef.current.showModal()
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <DialogStyled style={{ padding: '1rem 1.2rem' }} ref={wrapperRef}>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl'>Sign in</h2>
        <CloseButton></CloseButton>
      </div>

      <div className='grid justify-center gap-4 mt-8'>
        <CommonButton onClick={() => setModalState('login')} className='border-2 border-black'>
          Sign in with Email
        </CommonButton>
        <CommonButton onClick={signInWithGoogle} className='border-2 border-black flex gap-3'>
          <Image alt='Picture' src={GoogleLogo} className='w-5 h-5' /> Sign in with Google
        </CommonButton>

        <span className='text-center'>OR</span>

        <CommonButton className='border-2 border-black bg-black text-white' onClick={handleConnect}>
          Connect Crypto Wallet
        </CommonButton>

        <p
          style={{ fontSize: '.5rem' }}
          className='max-w-[9.5rem] mx-auto text-center text-gray-500'
        >
          By continuing, you agree to our &nbsp;
          <strong>Terms and Service</strong>&nbsp; and acknolwledge you’ve read our{' '}
          <strong>Privacy Policy</strong>
        </p>
      </div>
    </DialogStyled>
  )
}
