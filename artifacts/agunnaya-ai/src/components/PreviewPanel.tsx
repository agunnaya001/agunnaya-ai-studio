import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Share2, Download, Play, X } from 'lucide-react'

interface PreviewPanelProps {
  code: string
  language: string
  type: 'solidity' | 'react' | 'next' | 'python'
  onClose?: () => void
  showActions?: boolean
}

interface CompilationResult {
  id: string
  status: 'idle' | 'compiling' | 'running' | 'error'
  output?: string
  error?: string
  shareToken?: string
}

export function PreviewPanel({
  code,
  language,
  type,
  onClose,
  showActions = true,
}: PreviewPanelProps) {
  const [result, setResult] = useState<CompilationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  /**
   * Compile code when it changes
   */
  const handleCompile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/preview/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, type, language }),
      })

      if (!response.ok) {
        throw new Error('Compilation failed')
      }

      const data = await response.json()
      setResult(data)

      // Generate share link
      if (data.shareToken) {
        setShareLink(`${window.location.origin}/preview/${data.shareToken}`)
      }
    } catch (error) {
      setResult({
        id: 'error',
        status: 'error',
        error: error instanceof Error ? error.message : 'Compilation failed',
      })
    } finally {
      setLoading(false)
    }
  }, [code, type, language])

  /**
   * Auto-compile on code change (debounced)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code.trim()) {
        handleCompile()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [code, handleCompile])

  /**
   * Copy share link to clipboard
   */
  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  /**
   * Copy code to clipboard
   */
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">Preview</h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            result?.status === 'error'
              ? 'bg-red-500/20 text-red-300'
              : result?.status === 'running'
              ? 'bg-green-500/20 text-green-300'
              : 'bg-slate-700 text-slate-300'
          }`}>
            {result?.status || 'idle'}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <p className="text-sm text-slate-400">Compiling code...</p>
            </div>
          </div>
        )}

        {!loading && result && result.status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-red-300 mb-2">Compilation Error</h4>
            <pre className="text-xs text-red-200 whitespace-pre-wrap font-mono overflow-x-auto max-h-64">
              {result.error || 'Unknown error'}
            </pre>
            {showActions && (
              <Button
                size="sm"
                className="mt-3 bg-red-600 hover:bg-red-500 text-white"
                onClick={() => window.location.href = '/dashboard/studio'}
              >
                Debug in Studio
              </Button>
            )}
          </div>
        )}

        {!loading && result && result.status === 'running' && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-2">Compilation Successful</h4>
            {result.output && (
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-64 bg-slate-950 p-2 rounded border border-slate-700">
                {result.output}
              </pre>
            )}
          </div>
        )}

        {!loading && !result && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm text-slate-400">
              Code will be compiled and previewed here
            </p>
            {showActions && (
              <Button
                size="sm"
                className="mt-4 bg-blue-600 hover:bg-blue-500 text-white"
                onClick={handleCompile}
              >
                <Play size={16} className="mr-2" />
                Compile Now
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && result && (
        <div className="bg-slate-800 px-4 py-3 border-t border-slate-700 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyCode}
            className="flex-1 text-slate-300 border-slate-600 hover:bg-slate-700"
          >
            <Copy size={14} className="mr-2" />
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
          {shareLink && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="flex-1 text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              <Share2 size={14} className="mr-2" />
              {copied ? 'Link Copied!' : 'Share'}
            </Button>
          )}
          <Button
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Download size={14} className="mr-2" />
            Export
          </Button>
        </div>
      )}
    </div>
  )
}
