import { Grid3X3, Layers3, MoveDiagonal } from 'lucide-react'

const classes = [
  {
    code: 'S1',
    name: 'Plain',
    description: 'Basic repeating woven structures characterized by simple, regular alignment.',
    icon: Grid3X3,
    visual: 'pattern-plain',
  },
  {
    code: 'S2',
    name: 'Twill',
    description: 'Diagonal or staggered woven structures that create directional patterns.',
    icon: MoveDiagonal,
    visual: 'pattern-twill',
  },
  {
    code: 'S3',
    name: 'Complex',
    description: 'Multi-directional or three-dimensional folds with more intricate structure.',
    icon: Layers3,
    visual: 'pattern-complex',
  },
]

function PatternClasses() {
  return (
    <section className="section-block classes-section" id="classes">
      <div className="section-shell">
        <div className="section-heading centered-heading">
          <div>
            <span className="section-kicker">03 / Structural vocabulary</span>
            <h2>Three ways a weave<br /><em>can take shape.</em></h2>
          </div>
          <p>The classifier keeps the structural vocabulary intentionally focused: a clear starting point for image-based study.</p>
        </div>
        <div className="class-grid">
          {classes.map(({ code, name, description, icon: Icon, visual }) => (
            <article className="class-card" key={code}>
              <div className={`class-visual ${visual}`} aria-hidden="true"><div /><div /><div /><div /><div /></div>
              <div className="class-card-content">
                <div className="class-card-top"><span className="class-code">{code}</span><Icon size={20} /></div>
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PatternClasses
