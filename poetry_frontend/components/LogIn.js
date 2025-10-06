import { useEffect, useRef } from 'react'
import { useCurrentUser, auth } from '../hooks/useAuth'
import { useSignInWithEmailAndPassword, useAuthState } from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth'
import CommonButton from './CommonButton'
import { clickOutside } from '../utils/DOM'
import { DialogStyled } from './StyledDialog'

const LogIn = ({ setModalState, firebaseApp }) => {
  const wrapperRef = useRef(null)

  const [user, authLoading, authError] = useAuthState(auth)
  const [signInWithEmailAndPassword, _user, loading, error] = useSignInWithEmailAndPassword(auth)

  const userInfo = useCurrentUser() || 'error'

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

  function signUp() {
    setModalState('signup')
    wrapperRef.current && wrapperRef.current.close()
  }

  function resetPassword(ev) {
    ev.preventDefault()
    setModalState('reset-password')
  }

  useEffect(() => {
    wrapperRef.current && wrapperRef.current.showModal()

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignIn = event => {
    event.preventDefault()
    const user = event.target.querySelector('#user-input').value
    const password = event.target.querySelector('#password-input').value

    signInWithEmailAndPassword(user, password)
      .then(res => {
        localStorage.setItem('user-data', JSON.parse(res.user))
      })
      .catch(err => {
        console.log('ERROR: ', err)
        localStorage.removeItem('user-data')
      })
  }

  return (
    <DialogStyled style={{ width: 'min(100%, 20rem)' }} open={false} ref={wrapperRef}>
      {user ? (
        <div className='grid gap-2'>
          <p>Signed in as {user.email}</p>
          <CommonButton onClick={() => signOut(auth)} className='bg-black text-white'>
            Sign out
          </CommonButton>
        </div>
      ) : (
        <>
          <h2 className='text-center text-xl'>Log in</h2>

          <form onSubmit={event => handleSignIn(event)} className='flex flex-col gap-2'>
            <span className='text-sm'>Email</span>
            <input type='email' id='user-input' className='bg-gray-200 rounded-md px-2 py-1' />

            <span className='text-sm'>Password</span>
            <input
              type='password'
              id='password-input'
              className='bg-gray-200 rounded-md px-2 py-1'
            />

            <span role='button' className='text-xs font-semibold' onClick={resetPassword}>
              Forgot password?
            </span>

            <div className='actions flex items-center justify-between'>
              <a className='text-sm mr-4' href='#' onClick={signUp}>
                Click here to sign up
              </a>
              <CommonButton
                isLoading={loading || authLoading}
                type='submit'
                className='bg-black text-white'
              >
                Sign in
              </CommonButton>
            </div>

            {(error || authError) && (
              <span className='text-red-600 text-xs text-center font-semibold'>
                {error.code === 'auth/network-request-failed'
                  ? 'Connection error. Please retry'
                  : error.code === 'auth/invalid-login-credentials'
                    ? 'Invalid email or password'
                    : 'Authentication error. Please retry'}
              </span>
            )}
          </form>
        </>
      )}
    </DialogStyled>
  )
}

export default LogIn
