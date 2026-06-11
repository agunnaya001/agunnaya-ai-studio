import { useEffect, useState } from 'react'
import { useParams } from 'wouter'
import { Button } from '@/components/ui/button'

interface PreviewData {
  id: string
  code: string
  language: string
  type: 'solidity' | 'react' | 'next' | 'python'
  status: 'idle' | 'compiling' | 'running' | 'error'
  output?: string
  error?: string
  createdAt: string
}

export default function ShareablePreviewPage() {
  const params = useParams()
  const token = params?.token as string
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const fetchPreview = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch preview by share token from API
        // In Phase 4E, this would be a real API endpoint
        const response = await fetch(`/api/preview/share/${token}`)
        
        if (!response.ok) {
          throw new Error('Preview not found or has expired')
        }

        const data = await response.json()
        setPreview(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview')
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error || !preview) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Preview Not Found</h1>
          <p className="text-slate-400 mb-6">
            {error || 'This preview link is invalid or has expired.'}
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => window.location.href = '/'}
          >
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Code Preview</h1>
            <p className="text-sm text-slate-400 mt-1">
              {preview.type.charAt(0).toUpperCase() + preview.type.slice(1)} Code
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              preview.status === 'error' 
                ? 'bg-red-500/20 text-red-300' 
                : preview.status === 'running'
                ? 'bg-green-500/20 text-green-300'
                : 'bg-slate-700 text-slate-300'
            }`}>
              {preview.status.charAt(0).toUpperCase() + preview.status.slice(1)}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor Panel */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
              <p className="text-sm font-medium text-slate-300">
                Source Code ({preview.language})
              </p>
            </div>
            <div className="p-4 bg-slate-950">
              <pre className="text-sm text-slate-400 overflow-x-auto max-h-96">
                <code>{preview.code}</code>
              </pre>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
              <p className="text-sm font-medium text-slate-300">
                {preview.error ? 'Error Output' : 'Compilation Output'}
              </p>
            </div>
            <div className="p-4 bg-slate-950">
              {preview.error ? (
                <div className="text-red-400 text-sm font-mono max-h-96 overflow-auto">
                  <p className="text-red-500 font-semibold mb-2">Error:</p>
                  <code>{preview.error}</code>
                </div>
              ) : preview.output ? (
                <div className="text-slate-300 text-sm max-h-96 overflow-auto">
                  <code>{preview.output}</code>
                </div>
              ) : (
                <p className="text-slate-500 italic">No output yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Preview Details */}
        <div className="mt-8 bg-slate-900 rounded-lg border border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Preview Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Type</p>
              <p className="text-sm font-medium text-slate-200 mt-1">
                {preview.type.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Language</p>
              <p className="text-sm font-medium text-slate-200 mt-1">
                {preview.language.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Status</p>
              <p className="text-sm font-medium text-slate-200 mt-1">
                {preview.status.charAt(0).toUpperCase() + preview.status.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Created</p>
              <p className="text-sm font-medium text-slate-200 mt-1">
                {new Date(preview.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button 
            className="bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => window.location.href = '/'}
          >
            Create Your Own
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigator.clipboard.writeText(preview.code)}
          >
            Copy Code
          </Button>
        </div>
      </main>
    </div>
  )
}
