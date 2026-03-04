'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, X, Plus } from 'lucide-react'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false })

interface AdvisorProfile {
  slug: string
  display_name: string
  title: string | null
  bio: string | null
  short_bio: string | null
  phone: string | null
  email: string | null
  certifications: string[] | null
  specialties: string[] | null
  profile_image_url: string | null
  headshot_url: string | null
  social_links: { linkedin?: string; twitter?: string } | null
}

function ChipInput({
  label,
  values,
  onChange,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
}) {
  const [input, setInput] = useState('')

  function handleAdd() {
    const trimmed = input.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    setInput('')
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 px-2 py-1 bg-rise-navy/10 text-rise-navy text-sm rounded-full">
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="hover:text-red-500"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none text-sm"
          placeholder={`Add ${label.toLowerCase()}...`}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [slug, setSlug] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [title, setTitle] = useState('')
  const [shortBio, setShortBio] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [certifications, setCertifications] = useState<string[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [profileImage, setProfileImage] = useState('')
  const [headshot, setHeadshot] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [twitter, setTwitter] = useState('')

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Get current user first
        const meRes = await fetch('/api/auth/me')
        if (!meRes.ok) return
        const { user } = await meRes.json()

        // Find the advisor profile by checking all advisors
        // We need to find the slug for the current user
        const profileSlug = user.full_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        const res = await fetch(`/api/advisors/${profileSlug}`)
        if (!res.ok) {
          setError('Advisor profile not found')
          return
        }

        const advisor: AdvisorProfile = await res.json()
        setSlug(advisor.slug)
        setDisplayName(advisor.display_name)
        setTitle(advisor.title || '')
        setShortBio(advisor.short_bio || '')
        setBio(advisor.bio || '')
        setPhone(advisor.phone || '')
        setEmail(advisor.email || '')
        setCertifications(advisor.certifications || [])
        setSpecialties(advisor.specialties || [])
        setProfileImage(advisor.profile_image_url || '')
        setHeadshot(advisor.headshot_url || '')
        setLinkedin(advisor.social_links?.linkedin || '')
        setTwitter(advisor.social_links?.twitter || '')
      } catch {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleBioChange = useCallback((html: string) => {
    setBio(html)
  }, [])

  async function uploadImage(file: File, setter: (url: string) => void) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/uploads', { method: 'POST', body: formData })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || 'Upload failed')
      return
    }
    const { url } = await res.json()
    setter(url)
  }

  async function handleSave() {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const socialLinks: Record<string, string> = {}
      if (linkedin) socialLinks.linkedin = linkedin
      if (twitter) socialLinks.twitter = twitter

      const res = await fetch(`/api/advisors/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          title: title || null,
          short_bio: shortBio || null,
          bio: bio || null,
          phone: phone || null,
          email: email || null,
          certifications: certifications.length > 0 ? certifications : null,
          specialties: specialties.length > 0 ? specialties : null,
          profile_image_url: profileImage || null,
          headshot_url: headshot || null,
          social_links: Object.keys(socialLinks).length > 0 ? socialLinks : null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }

      setSuccess('Profile saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
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
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-rise-navy mb-6">My Profile</h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
              placeholder="e.g., Wealth Advisor"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
          <textarea
            value={shortBio}
            onChange={(e) => setShortBio(e.target.value)}
            rows={2}
            maxLength={200}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none resize-none"
            placeholder="1-2 sentence bio for cards (max 200 chars)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Bio</label>
          <RichTextEditor content={bio} onChange={handleBioChange} placeholder="Write your full biography..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
            />
          </div>
        </div>

        <ChipInput label="Certifications" values={certifications} onChange={setCertifications} />
        <ChipInput label="Specialties" values={specialties} onChange={setSpecialties} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadImage(file, setProfileImage)
                }} />
              </label>
              {profileImage && <img src={profileImage} alt="Profile" className="h-12 w-12 object-cover rounded-full" />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headshot</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadImage(file, setHeadshot)
                }} />
              </label>
              {headshot && <img src={headshot} alt="Headshot" className="h-12 w-12 object-cover rounded-full" />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
            <input
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
              placeholder="https://twitter.com/..."
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving || !displayName}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rise-navy text-white rounded-lg hover:bg-rise-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
