import { useState } from 'react'
import { useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import CommonButton from './CommonButton'
import { clickOutside } from '../utils/DOM'
import { checkEmail, checkPassword } from '../utils/string'
import { DialogStyled } from './StyledDialog'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../hooks/useAuth'

const InputStyled = styled.input`
  &.error {
    background-color: #c91c1c69;
  }
`

const SignUp = ({ setModalState }) => {
  const wrapperRef = useRef(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState({
    username: false,
    email: false,
    password1: false,
    password2: false,
  })

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

  function logIn() {
    setModalState('login')
    wrapperRef.current && wrapperRef.current.close()
  }

  function udpateValue(handler, key, trim) {
    return ev => {
      let v = ev.target.value

      handler(trim ? v.trim() : v)

      let obj = {}
      obj[key] = false

      setFieldError(() => {
        let newV = Object.assign({}, fieldError, obj)
        return newV
      })
    }
  }

  function signUp() {
    setLoading(true)

    let fError = {
      username: username.trim() === '',
      email: !checkEmail(email),
      password1: !!checkPassword(password1),
      password2: password1 != password2,
    }

    setFieldError(fError)

    if (fError.username || fError.email || fError.password1 || fError.password2) {
      setLoading(false)
    }

    if (fError.username) {
      setError('Username is required')
    } else if (fError.email) {
      setError('Invalid or missing email')
    } else if (fError.password1) {
      setError(checkPassword(password1))
    } else if (fError.password2) {
      setError("Password don't match")
    } else {
      setError('')
      createUserWithEmailAndPassword(auth, email, password1)
        .then(res => {
          console.log('RESULT: ', res)
        })
        .catch(err => {
          let { code } = err

          if (code === 'auth/email-already-in-use') {
            setError('Email already in use')
          } else if (code === 'auth/invalid-email') {
            setError('Invalid email')
          }

          console.log('ERROR: ', process.env.NEXT_PUBLIC_FB_API_KEY)
          console.log('ERROR: ', process.env.FB_API_KEY)
          console.dir(code)
        })
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    wrapperRef.current && wrapperRef.current.showModal()

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <DialogStyled open={false} ref={wrapperRef}>
      <h2 className='text-center text-xl'>Sign Up</h2>

      <form onSubmit={e => e.preventDefault()} className='flex flex-col gap-2'>
        <span className='text-sm'>Username</span>

        <InputStyled
          value={username}
          onChange={udpateValue(setUsername, 'username', true)}
          type='text'
          className={'bg-gray-200 rounded-md px-2 py-1 ' + (fieldError.username ? 'error' : '')}
        />

        <span className='text-sm'>Email</span>
        <InputStyled
          value={email}
          onChange={udpateValue(setEmail, 'email', true)}
          type='email'
          className={'bg-gray-200 rounded-md px-2 py-1 ' + (fieldError.email ? 'error' : '')}
        />

        <span className={'text-sm ' + (fieldError.password1 ? 'text-red-600' : '')}>Password</span>
        <InputStyled
          value={password1}
          onChange={udpateValue(setPassword1, 'password1')}
          type='password'
          className={'bg-gray-200 rounded-md px-2 py-1 ' + (fieldError.password1 ? 'error' : '')}
        />
        <span className='text-xs -mt-2 ml-2'>Password must be at least 8 characters</span>

        <span className={'text-sm ' + (fieldError.password2 ? 'text-red-600' : '')}>
          Re-enter password
        </span>
        <InputStyled
          value={password2}
          onChange={udpateValue(setPassword2, 'password2')}
          type='password'
          className={'bg-gray-200 rounded-md px-2 py-1 ' + (fieldError.password2 ? 'error' : '')}
        />

        <div className='actions flex flex-col items-center justify-between mt-2'>
          <CommonButton
            isLoading={loading}
            type='submit'
            onClick={signUp}
            className='bg-black text-white hover:shadow-lg'
          >
            Sign Up
          </CommonButton>
          <a className='text-xs mt-1' href='#' onClick={logIn}>
            Go back to <strong>Log in</strong>
          </a>
        </div>

        {error && (
          <span className='text-red-500 -mt-1 text-xs text-center font-semibold'> {error} </span>
        )}
      </form>
    </DialogStyled>
  )
}

export default SignUp
