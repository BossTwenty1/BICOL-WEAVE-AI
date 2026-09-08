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
  const [backendStatus, setBackendStatus] = useState('starting')

  useEffect(() => {
    let isMounted = true
    let healthTimer
    let consecutiveFailures = 0

    const maxHealthFailures = 3
    const retryDelay = 5000
    const healthyCheckInterval = 30000

    const checkBackend = async () => {
      try {
        const health = await getHealth()
        const isHealthy = health.status === 'ok' && health.model_loaded

        if (!isMounted) return

        if (isHealthy) {
          consecutiveFailures = 0
          setBackendStatus('online')
          healthTimer = window.setTimeout(checkBackend, healthyCheckInterval)
        } else {
          consecutiveFailures += 1
          if (consecutiveFailures >= maxHealthFailures) {
            setBackendStatus('offline')
          }
          healthTimer = window.setTimeout(checkBackend, retryDelay)
        }
      } catch {
        if (!isMounted) return

        consecutiveFailures += 1
        if (consecutiveFailures >= maxHealthFailures) {
          setBackendStatus('offline')
        }
        healthTimer = window.setTimeout(checkBackend, retryDelay)
      }
    }

    checkBackend()

    return () => {
      isMounted = false
      window.clearTimeout(healthTimer)
    }
  }, [])

  return (
    <div className="app-shell">
      <Navbar />
      <main ref={revealRef}>
        <Hero />
        <Classifier
          backendStatus={backendStatus}
          onBackendStatusChange={setBackendStatus}
        />
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
