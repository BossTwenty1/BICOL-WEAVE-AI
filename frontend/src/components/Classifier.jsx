import { useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, FileImage, LoaderCircle, UploadCloud } from 'lucide-react'
import { API_BASE_URL, predictImage } from '../services/api'
import PredictionResult from './PredictionResult'

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

function isSupportedFile(file) {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  return ACCEPTED_MIME_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension)
}

function Classifier({ backendStatus }) {
  const inputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const selectFile = (file) => {
    if (!file) return
    if (!isSupportedFile(file)) {
      setError('Please choose a JPG, JPEG, PNG, or WEBP image.')
      setSelectedFile(null)
      setPreviewUrl('')
      setResult(null)
      return
    }

    setError('')
    setResult(null)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0])
    event.target.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  const clearSelection = () => {
    if (isAnalyzing) return
    setSelectedFile(null)
    setPreviewUrl('')
    setResult(null)
    setError('')
  }

  const handleAnalyze = async () => {
    if (!selectedFile || isAnalyzing) return
    setError('')
    setResult(null)
    setIsAnalyzing(true)
    try {
      const prediction = await predictImage(selectedFile)
      setResult(prediction)
    } catch {
      setError('Unable to analyze the image. Please make sure the AI backend is running and try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const statusLabel =
    backendStatus === 'online'
      ? 'AI Model Online'
      : backendStatus === 'checking'
        ? 'Checking AI Backend'
        : 'AI Backend Offline'

  return (
    <section className="section-block classifier-section" id="classifier">
      <div className="section-shell">
        <div className="section-heading classifier-heading">
          <div>
            <span className="section-kicker">01 / Live classifier</span>
            <h2>Read the structure<br /><em>inside the weave.</em></h2>
          </div>
          <div className={`backend-status ${backendStatus}`} role="status">
            {backendStatus === 'online' ? <CheckCircle2 size={16} /> : <span className="status-pulse" />}
            {statusLabel}
          </div>
        </div>

        <div className="classifier-layout">
          <div className="upload-card" aria-busy={isAnalyzing}>
            <div className="card-label"><span>UPLOAD SAMPLE</span><span>01</span></div>
            {!selectedFile ? (
              <label
                className={`drop-zone ${isDragging ? 'is-dragging' : ''}`}
                htmlFor="pattern-upload"
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  id="pattern-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                />
                <span className="upload-icon"><UploadCloud size={24} /></span>
                <strong>Upload a woven pattern image</strong>
                <span>Drag and drop here, or click to browse</span>
                <small>JPG, JPEG, PNG, or WEBP · Maximize clarity for best results</small>
              </label>
            ) : (
              <div className="selected-image-wrap">
                <div className={`image-preview-frame ${isAnalyzing ? 'is-analyzing' : ''}`}>
                  <img src={previewUrl} alt={`Selected woven pattern: ${selectedFile.name}`} />
                  <span className="preview-tag"><FileImage size={14} /> PREVIEW</span>
                  {isAnalyzing && <span className="scan-line" aria-hidden="true" />}
                </div>
                <div className="selected-file-row">
                  <div>
                    <strong>{selectedFile.name}</strong>
                    <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button className="text-button" type="button" onClick={clearSelection} disabled={isAnalyzing}>
                    Remove / change
                  </button>
                </div>
                <button
                  className="button button-primary analyze-button"
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? <><LoaderCircle className="spin" size={20} /> <span role="status">Analyzing woven pattern...</span></> : <>Analyze Pattern <span>→</span></>}
                </button>
              </div>
            )}
            {error && (
              <div className="error-message" role="alert">
                <AlertCircle size={17} />
                <div>
                  <strong>{error}</strong>
                  {backendStatus === 'offline' && <small>Backend expected at {API_BASE_URL}</small>}
                </div>
              </div>
            )}
          </div>

          {result ? (
            <PredictionResult result={result} onReset={clearSelection} />
          ) : (
            <div className="result-placeholder">
              <div className="placeholder-symbol"><span /><span /><span /></div>
              <span className="section-kicker">RESULTS APPEAR HERE</span>
              <h3>Your classification<br />will take shape here.</h3>
              <p>Upload a clear image of a woven structure to see its class, confidence, and probability distribution.</p>
              <div className="placeholder-line"><span /><span /><span /></div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Classifier
