import { BookOpen, Code2, Cpu, Layers2, School } from 'lucide-react'

const technologies = [
  ['React', 'Interface', Code2],
  ['FastAPI', 'Inference API', Layers2],
  ['PyTorch', 'Deep learning', Cpu],
  ['MobileNetV2', 'Vision model', School],
  ['Google Colab', 'Training lab', BookOpen],
]

function About() {
  return (
    <section className="section-block about-section" id="about">
      <div className="section-shell about-grid">
        <div>
          <span className="section-kicker">05 / About the project</span>
          <h2>Where craft meets<br /><em>computation.</em></h2>
        </div>
        <div className="about-copy">
          <p className="about-lead">BICOL-WEAVE-AI explores the use of convolutional neural networks and ethnomathematical pattern classification for woven coconut-leaf crafts.</p>
          <p>The project is a focused research demonstration built around computer vision, pattern recognition, and cultural and educational application. It is designed to make the model’s process visible and understandable — from image upload to a three-class structural prediction.</p>
          <div className="focus-tags"><span>Computer vision</span><span>Pattern recognition</span><span>Research demonstration</span></div>
        </div>
      </div>
      <div className="section-shell tech-stack">
        <span className="mini-label">BUILT WITH</span>
        <div className="tech-grid">
          {technologies.map(([name, detail, Icon]) => (
            <div className="tech-card" key={name}><Icon size={18} /><div><strong>{name}</strong><span>{detail}</span></div></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
