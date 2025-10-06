import PoetryTypeWrite from '../components/PoetryTypeWrite'
import FAQ from '../components/FAQ'
import HomeImageSlider from '../components/HomeImageSlider'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className='relative'>
      <PoetryTypeWrite />
      <HomeImageSlider />
      <FAQ />
    </div>
  )
}
