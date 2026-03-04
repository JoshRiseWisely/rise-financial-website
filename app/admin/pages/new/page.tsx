'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Send } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false })

const TEMPLATES = [
  { value: 'standard', label: 'Standard', description: 'General purpose page layout' },
  { value: 'landing', label: 'Landing Page', description: 'Focused page with clear call-to-action' },
  { value: 'guide', label: 'Guide / Article', description: 'Long-form educational content' },
  { value: 'case-study', label: 'Case Study', description: 'Client success story format' },
]

export default function NewPagePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [template, setTemplate] = useState('standard')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')

  const handleContentChange = useCallback((html: string) => {
    setContent(html)
  }, [])

  async function uploadFeaturedImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/uploads', { method: 'POST', body: formData })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Upload failed')
    }
    const { url } = await res.json()
    setFeaturedImage(url)
  }

  async function handleSave(submitForReview: boolean) {
    setError('')
    setSaving(true)

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          template,
          meta_title: metaTitle || null,
          meta_description: metaDescription || null,
          featured_image_url: featuredImage || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create page')
        return
      }

      const page = await res.json()

      if (submitForReview) {
        await fetch(`/api/pages/${page.id}/submit-review`, { method: 'POST' })
      }

      router.push('/admin/pages')
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} />
          Back to Pages
        </Link>
        <h1 className="text-2xl font-bold text-rise-navy">New Page</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div className="space-y-6">
        {/* Template */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTemplate(t.value)}
                className={`text-left p-3 border rounded-lg transition-colors ${
                  template === t.value
                    ? 'border-rise-navy bg-rise-navy/5 ring-2 ring-rise-navy/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm text-gray-800">{t.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{t.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
            placeholder="Enter page title"
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Choose File
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadFeaturedImage(file)
                }}
              />
            </label>
            {featuredImage && (
              <img src={featuredImage} alt="Featured" className="h-16 w-24 object-cover rounded" />
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
          <RichTextEditor content={content} onChange={handleContentChange} placeholder="Start writing your page content..." />
        </div>

        {/* SEO / Meta */}
        <details className="border border-gray-200 rounded-lg">
          <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
            SEO Settings (optional)
          </summary>
          <div className="px-4 pb-4 space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Meta Title (max 70 chars)</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                maxLength={70}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Meta Description (max 160 chars)</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                maxLength={160}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none resize-none"
              />
            </div>
          </div>
        </details>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleSave(false)}
            disabled={saving || !title || !content}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || !title || !content}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rise-navy text-white rounded-lg hover:bg-rise-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
            {saving ? 'Saving...' : 'Save & Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
