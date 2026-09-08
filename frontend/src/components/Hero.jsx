import { ArrowRight, BrainCircuit, Leaf, ScanLine } from 'lucide-react'

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="section-shell hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Bicol craft · computer vision study
          </div>
          <h1>
            AI-Driven Classification of{' '}
            <em>Woven Coconut-Leaf</em> Craft Patterns
          </h1>
          <p className="hero-lead">
            Use computer vision to identify structural woven patterns as Plain,
            Twill, or Complex — a clear research demonstration rooted in local
            craft.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#classifier">
              Classify a Pattern <ArrowRight size={17} />
            </a>
            <a className="button button-secondary" href="#how-it-works">
              How It Works
            </a>
          </div>
          <div className="model-badge">
            <BrainCircuit size={17} />
            Powered by MobileNetV2 + PyTorch
          </div>
        </div>

        <div className="hero-visual" aria-label="Abstract woven pattern visualization">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-topline">
            <span><span className="live-dot" /> MODEL OVERVIEW</span>
            <span>224 × 224 RGB</span>
          </div>
          <div className="woven-grid" aria-hidden="true">
            {Array.from({ length: 36 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="visual-center-mark">
            <ScanLine size={28} />
            <span>pattern<br />recognition</span>
          </div>
          <div className="visual-chip chip-top">
            <Leaf size={15} />
            <span>COCONUT<br /><strong>LEAF WEAVE</strong></span>
          </div>
          <div className="visual-chip chip-bottom">
            <span className="chip-label">3 STRUCTURAL CLASSES</span>
            <div><b>S1</b><b>S2</b><b>S3</b></div>
          </div>
          <div className="visual-caption">A research prototype for woven pattern classification</div>
        </div>
      </div>
      <div className="hero-bottom-rule" />
    </section>
  )
}

export default Hero
