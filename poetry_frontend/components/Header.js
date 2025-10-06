import { ConnectButton, useAccountBalance, useWallet } from '@suiet/wallet-kit'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'
import { useCurrentUser } from '../hooks/useAuth'

const Header = ({ setModalState }) => {
  const router = useRouter()
  const wallet = useWallet()
  const { balance } = useAccountBalance()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const user = useCurrentUser()
  const address = user.isSuccess && user.data ? user.data.wallet.address : ''

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  return (
    <div className='p-6 z-index2'>
      <nav className='space-x-2 m-auto rounded-xl mt-1 container'>
        <div className='max-w-screen-xl flex flex-wrap items-center justify-between xl:justify-center mx-auto p-3 relative'>
          <button
            onClick={handleMobileMenuToggle}
            type='button'
            className='absolute right-0 top-0 inline-flex items-center p-2 ml-3 text-sm text-neutral-900 xl:hidden hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400'
            aria-controls='navbar-default'
            aria-expanded='false'
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='w-6 h-6'
              aria-hidden='true'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              ></path>
            </svg>
          </button>
          <div
            className={`${
              isMobileMenuOpen ? '' : 'hidden'
            } w-full xl:block xl:w-auto flex flex-col xl:flex-row xl:space-x-4 xl:mt-0 xl:border-0`}
            id='navbar-default'
          >
            {[
              ['Home', '/'],
              ['My Poems', '/mypoems'],
              ['Create Poems', '/createpoems'],
              ['Buy Word Packs', '/buywordpacks'],
              ['Gallery', '/poems'],
              ['Contests', '/contests'],
            ].map(([title, url]) => (
              <Link
                href={url}
                key={url}
                className={`${
                  url === router.pathname && 'underline decoration-dotted '
                }cursor-pointer uppercase font-semibold text-neutral-900 hover:underline underline-offset-4 hover:decoration-dotted p-2 w-full text-center text-2xl`}
              >
                {title}
              </Link>
            ))}

            {address}

            {wallet.connected ? (
              <div className='inline-block'>
                <ConnectButton />
              </div>
            ) : (
              <button
                onClick={() => setModalState('login-main')}
                type='button'
                className='w-fit self-center text-center text-xl teinline-flex items-center outline px-6 py-2 ml-3 border border-gray border-b-2 border-r-2 uppercase font-bold  text-neutral-900 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400'
                aria-controls='navbar-default'
                aria-expanded='false'
              >
                LogIn
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header
