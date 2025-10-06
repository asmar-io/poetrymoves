import React from 'react'
import Link from 'next/link' // Import the Link component
import styles from './footer.module.css'
export default function Footer() {
  return (
    <footer
      className={styles.footer}
      //   style={{
      //     backgroundColor: 'black',
      //       color: 'white',
      //     height: '200px',
      //     padding: '20px',
      //     display:'flex',
      //     alignItems: 'center',
      //     marginTop:'auto',
      //     justifyContent: 'center',
      // }}
    >
      <div className='container flex justify-center'>
        <div className=' flex w-[50%] justify-between row'>
          <div className='col-md-6'>
            <h3>
              <Link href='/terms'>Terms</Link>
            </h3>
          </div>
          <div className='col-md-6'>
            {/* Link to the "Privacy Policy" page */}
            <h3>
              <Link href='/privacy-policy'>Privacy Policy</Link>
            </h3>
          </div>
        </div>
      </div>
    </footer>
  )
}
