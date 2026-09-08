import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  ['Home', 'home'],
  ['Classifier', 'classifier'],
  ['How It Works', 'how-it-works'],
  ['Classes', 'classes'],
  ['Results', 'research-results'],
  ['About', 'about'],
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <a className="brand" href="#home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>
            <strong>BICOL-WEAVE</strong>
            <small>AI RESEARCH PROTOTYPE</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <a className="nav-cta" href="#classifier">
          Classify Pattern
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onKeyDown={(event) => { if (event.key === 'Escape') closeMenu() }}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" onKeyDown={(event) => { if (event.key === 'Escape') closeMenu() }}>
          {navItems.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={closeMenu}>
              {label}
            </a>
          ))}
          <a className="mobile-nav-cta" href="#classifier" onClick={closeMenu}>
            Classify Pattern <ArrowUpRight size={16} />
          </a>
        </nav>
      )}
    </header>
  )
}

export default Navbar
