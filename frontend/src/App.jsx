import { useEffect, useState } from 'react'
import { getHealth } from './services/api'
import useScrollReveal from './hooks/useScrollReveal'
import About from './components/About'
import Classifier from './components/Classifier'
import Footer from './components/Footer'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Navbar from './components/Navbar'
import PatternClasses from './components/PatternClasses'
import ResearchResults from './components/ResearchResults'

function App() {
  const revealRef = useScrollReveal()
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    let isMounted = true

    const checkBackend = async () => {
      try {
        const health = await getHealth()
        if (isMounted) {
          setBackendStatus(
            health.status === 'ok' && health.model_loaded ? 'online' : 'offline',
          )
        }
      } catch {
        if (isMounted) {
          setBackendStatus('offline')
        }
      }
    }

    checkBackend()
    const retryTimer = window.setInterval(checkBackend, 10000)

    return () => {
      isMounted = false
      window.clearInterval(retryTimer)
    }
  }, [])

  return (
    <div className="app-shell">
      <Navbar />
      <main ref={revealRef}>
        <Hero />
        <Classifier backendStatus={backendStatus} />
        <HowItWorks />
        <PatternClasses />
        <ResearchResults />
        <About />
      </main>
      <Footer />
    </div>
  )
}

export default App
