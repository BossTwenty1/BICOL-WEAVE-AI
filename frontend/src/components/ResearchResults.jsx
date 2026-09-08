import { BarChart3, Check, FlaskConical } from 'lucide-react'

const metrics = [
  ['Test Images', '33', 'holdout samples'],
  ['Accuracy', '93.94%', 'overall correctness'],
  ['Macro Precision', '94.66%', 'across three classes'],
  ['Macro Recall', '93.52%', 'across three classes'],
  ['Macro F1', '93.93%', 'balanced score'],
  ['CPU Inference', '41.003 ms', 'average per image'],
]

function ResearchResults() {
  return (
    <section className="section-block results-section" id="research-results">
      <div className="section-shell">
        <div className="section-heading results-heading">
          <div>
            <span className="section-kicker">04 / Research results</span>
            <h2>A measured first<br /><em>step forward.</em></h2>
          </div>
          <div className="results-model-note"><span className="mini-label">DEPLOYED MODEL</span><strong>MobileNetV2</strong><p>A lightweight architecture suitable for real-time and resource-efficient deployment.</p></div>
        </div>
        <div className="metrics-panel">
          <div className="metrics-panel-header"><span><BarChart3 size={17} /> MobileNetV2 evaluation</span><span>VERIFIED HOLDOUT RUN</span></div>
          <div className="metrics-grid">
            {metrics.map(([label, value, note]) => (
              <div className="metric-card" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
            ))}
          </div>
        </div>
        <div className="research-note"><Check size={17} /><p>Results are based on the current 33-image holdout test split after exact-duplicate filtering. This MVP dataset remains subject to further research validation.</p></div>
        <div className="planned-evaluation"><FlaskConical size={20} /><div><span className="mini-label">PLANNED COMPARATIVE EVALUATION</span><p>ResNet18 <span>·</span> PCA-SVM <em>not part of the currently deployed model evaluation</em></p></div></div>
      </div>
    </section>
  )
}

export default ResearchResults
