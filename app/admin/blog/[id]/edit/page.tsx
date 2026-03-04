'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Send } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false })

const CATEGORIES = [
  { value: '', label: 'Select a category...' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'investing', label: 'Investing' },
  { value: 'tax', label: 'Tax Planning' },
  { value: 'estate', label: 'Estate Planning' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'faith-based-investing', label: 'Faith-Based Investing' },
  { value: 'business', label: 'Business' },
]

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [currentStatus, setCurrentStatus] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${postId}`)
        if (!res.ok) {
          setError('Post not found')
          return
        }
        const post = await res.json()
        setTitle(post.title)
        setContent(post.content)
        setExcerpt(post.excerpt || '')
        setCategory(post.category || '')
        setTagsInput((post.tags || []).join(', '))
        setFeaturedImage(post.featured_image_url || '')
        setSeoTitle(post.seo_title || '')
        setSeoDescription(post.seo_description || '')
        setCurrentStatus(post.status)
      } catch {
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [postId])

  const handleContentChange = useCallback((html: string) => {
    setContent(html)
  }, [])

  async function uploadFeaturedImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/uploads', { method: 'POST', body: formData })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || 'Upload failed')
      return
    }
    const { url } = await res.json()
    setFeaturedImage(url)
  }

  async function handleSave(submitForReview: boolean) {
    setError('')
    setSaving(true)

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const res = await fetch(`/api/blog/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt || null,
          category: category || null,
          tags,
          featured_image_url: featuredImage || null,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }

      if (submitForReview) {
        await fetch(`/api/blog/${postId}/submit-review`, { method: 'POST' })
      }

      router.push('/admin/blog')
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} />
          Back to Blog Posts
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-rise-navy">Edit Blog Post</h1>
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${STATUS_STYLES[currentStatus] || ''}`}>
            {currentStatus.replace(/_/g, ' ')}
          </span>
        </div>
        {(currentStatus === 'approved' || currentStatus === 'published') && (
          <p className="text-sm text-amber-600 mt-1">
            Editing will reset the approval status to draft.
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            maxLength={300}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
              placeholder="retirement, planning, tax (comma-separated)"
            />
          </div>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
          <RichTextEditor content={content} onChange={handleContentChange} />
        </div>

        <details className="border border-gray-200 rounded-lg">
          <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
            SEO Settings (optional)
          </summary>
          <div className="px-4 pb-4 space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">SEO Title (max 70 chars)</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                maxLength={70}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">SEO Description (max 160 chars)</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={160}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none resize-none"
              />
            </div>
          </div>
        </details>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleSave(false)}
            disabled={saving || !title || !content}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {(currentStatus === 'draft' || currentStatus === 'rejected') && (
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !title || !content}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rise-navy text-white rounded-lg hover:bg-rise-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
              {saving ? 'Saving...' : 'Save & Submit for Review'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
