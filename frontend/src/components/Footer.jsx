import { ArrowUpRight } from 'lucide-react'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-inner">
        <div><strong>BICOL-WEAVE-AI</strong><span>AI-Driven Woven Pattern Classification</span></div>
        <div className="footer-right"><span>Research prototype / educational demonstration</span><a href="#home" aria-label="Back to top">Back to top <ArrowUpRight size={15} /></a></div>
      </div>
    </footer>
  )
}

export default Footer
