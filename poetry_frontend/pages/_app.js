import { ConnectModal, WalletProvider } from '@suiet/wallet-kit'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-tooltip/dist/react-tooltip.css'
import Footer from '../components/Footer'
import Header from '../components/Header'
import LogIn from '../components/LogIn'
import ResetPassword from '../components/ResetPassword'
import SignInMain from '../components/SignInMain'
import SignUp from '../components/SignUp'
import '../styles/Home.module.css'
import '../styles/global.css'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [modalState, setModalState] = useState('')
  const [showConnect, setShowConnect] = useState(false)

  function handleModalState(s) {
    const states = ['', 'login-main', 'login', 'signup', 'reset-password']

    if (states.indexOf(s) < 0) return

    setModalState(s)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Head>
        <title>Poetry in Motion</title>
        <meta
          name='description'
          content='Poetry in Motion is the first creative writing collectible card game in web3. /
					Express your wit and creativity by crafting poetic masterpieces stored on the Sui blockchain.'
        />
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
			<script>
				window.dataLayer = window.dataLayer || [];
				function gtag() {
				dataLayer.push(arguments);
				}
				gtag('js', new Date());
				gtag('config', 'YOUR_GA_ID');
			</script> */}
      </Head>
      <div className='container mx-auto'>
        <SessionProvider session={session}>
          <ToastContainer />
          <QueryClientProvider client={queryClient}>
            <WalletProvider>
              <Header setModalState={handleModalState} />
              <Component {...pageProps} />

              {modalState === 'login-main' && (
                <SignInMain
                  key='login-main'
                  setModalState={handleModalState}
                  setShowConnect={setShowConnect}
                />
              )}

              {modalState === 'signup' && <SignUp key='sign-up' setModalState={handleModalState} />}

              {modalState === 'login' && <LogIn key='log-in' setModalState={handleModalState} />}

              {modalState === 'reset-password' && (
                <ResetPassword key='reset-password' setModalState={handleModalState} />
              )}

              <ConnectModal
                open={showConnect}
                onConnectError={() => handleModalState('login-main')}
                onOpenChange={open => setShowConnect(open)}
              ></ConnectModal>
            </WalletProvider>
          </QueryClientProvider>
        </SessionProvider>
      </div>
      <Footer />
    </div>
  )
}

export default MyApp
