import { ArrowRight, Box, BrainCircuit, Crop, ScanSearch, Sparkles, Upload } from 'lucide-react'

const steps = [
  { number: '01', title: 'Upload Image', text: 'Share a clear image of the woven structure.', icon: Upload },
  { number: '02', title: 'Preprocess', text: 'The image becomes a consistent 224 × 224 RGB input.', icon: Crop },
  { number: '03', title: 'MobileNetV2 CNN', text: 'A lightweight vision model reads visual features.', icon: BrainCircuit },
  { number: '04', title: 'Feature Analysis', text: 'The network compares learned structural signals.', icon: ScanSearch },
  { number: '05', title: 'Classification', text: 'Softmax scores map the pattern to S1, S2, or S3.', icon: Sparkles },
  { number: '06', title: 'Result', text: 'See the class, confidence, probabilities, and timing.', icon: Box },
]

function HowItWorks() {
  return (
    <section className="section-block how-section" id="how-it-works">
      <div className="section-shell">
        <div className="section-heading centered-heading">
          <div>
            <span className="section-kicker">02 / Method</span>
            <h2>From image to <em>insight.</em></h2>
          </div>
          <p>The system turns a visual weave into a simple, interpretable classification flow — built for a focused research demonstration.</p>
        </div>
        <div className="process-line" aria-label="Classification pipeline">
          {steps.map(({ number, title, text, icon: Icon }, index) => (
            <div className="process-step" key={number}>
              <div className="process-icon"><Icon size={19} /></div>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              {index < steps.length - 1 && <ArrowRight className="step-arrow" size={18} aria-hidden="true" />}
            </div>
          ))}
        </div>
        <div className="formula-strip">
          <span>INPUT IMAGE</span><b>→</b><strong>224 × 224 RGB</strong><b>→</b><strong>IMAGENET NORMALIZATION</strong><b>→</b><strong>MOBILENETV2</strong><b>→</b><strong>SOFTMAX</strong><b>→</b><span>S1 / S2 / S3</span>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
