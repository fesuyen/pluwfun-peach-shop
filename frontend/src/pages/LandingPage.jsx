import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import FarmerStory from '../components/FarmerStory'
import QualityNotice from '../components/QualityNotice'
import OrderFlow from '../components/OrderFlow'
import OrderSection from '../components/OrderSection'
import Testimonials from '../components/Testimonials'
import Membership from '../components/Membership'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import useScrollAnimation from '../hooks/useScrollAnimation'

export default function LandingPage() {
  useScrollAnimation()

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      )
      document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
      return () => observer.disconnect()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <FarmerStory />
      <QualityNotice />
      <OrderFlow />
      <OrderSection />
      <Testimonials />
      <Membership />
      <FAQ />
      <Footer />
    </div>
  )
}
