import { RotateCcw, Timer, TrendingUp } from 'lucide-react'

const classDetails = {
  plain: {
    code: 'S1',
    title: 'Plain',
    description: 'Basic repeating woven structures characterized by simple, regular alignment.',
  },
  twill: {
    code: 'S2',
    title: 'Twill',
    description: 'Diagonal or staggered woven structures that form visible directional patterns.',
  },
  complex: {
    code: 'S3',
    title: 'Complex',
    description: 'Multi-directional or three-dimensional folded structures with more intricate geometry.',
  },
}

const classOrder = ['plain', 'twill', 'complex']

function PredictionResult({ result, onReset }) {
  const prediction = result.prediction?.toLowerCase()
  const detail = classDetails[prediction] || classDetails.plain
  const confidence = Math.max(0, Math.min(1, Number(result.confidence) || 0))

  return (
    <div className="prediction-card" aria-live="polite" aria-atomic="true">
      <div className="card-label"><span>CLASSIFICATION RESULT</span><TrendingUp size={15} /></div>
      <div className="prediction-title-row">
        <div>
          <span className="prediction-overline">Structural class detected</span>
          <h3><span className="prediction-code">{result.class_code || detail.code} —</span>{' '}{detail.title.toUpperCase()}</h3>
        </div>
        <div className="confidence-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="ring-track" cx="60" cy="60" r="54" />
            <circle className="ring-value" cx="60" cy="60" r="54"
              pathLength="100" strokeDasharray="100"
              style={{ strokeDashoffset: 100 - confidence * 100 }} />
          </svg>
          <div><strong>{(confidence * 100).toFixed(2)}%</strong><span>confidence</span></div>
        </div>
      </div>

      <div className="confidence-block">
        <div className="metric-line"><span>Confidence</span><strong>{(confidence * 100).toFixed(2)}%</strong></div>
        <div className="progress-track large"><span style={{ width: `${confidence * 100}%` }} /></div>
      </div>

      <div className="probability-block">
        <span className="mini-label">PROBABILITY DISTRIBUTION</span>
        {classOrder.map((className) => {
          const value = Math.max(0, Math.min(1, Number(result.probabilities?.[className]) || 0))
          return (
            <div className="probability-row" key={className}>
              <div className="probability-label"><span>{classDetails[className].code} {classDetails[className].title}</span><strong>{(value * 100).toFixed(2)}%</strong></div>
              <div className="progress-track"><span className={`bar-${className}`} style={{ width: `${value * 100}%` }} /></div>
            </div>
          )
        })}
      </div>

      <div className="result-footnote">
        <div className="result-description"><span className="mini-label">ABOUT THIS CLASS</span><p>{detail.description}</p></div>
        <div className="inference-time"><Timer size={17} /><span>Inference Time<strong>{Number(result.inference_ms || 0).toFixed(2)} ms</strong></span></div>
      </div>

      <button className="button button-outline reset-button" type="button" onClick={onReset}>
        <RotateCcw size={16} /> Analyze Another Image
      </button>
    </div>
  )
}

export default PredictionResult
