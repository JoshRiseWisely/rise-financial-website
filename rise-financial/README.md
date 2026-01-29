# Rise Financial Partners Website

A modern Next.js website for Rise Financial Partners, built with TypeScript and Tailwind CSS.

## Quick Start

### Option 1: Deploy to Vercel (Recommended - 5 minutes)

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Import Project" and select your repository
4. Click "Deploy" - that's it!

Vercel will automatically:
- Install dependencies
- Build the project
- Deploy to a live URL
- Set up automatic deployments on every push

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
rise-financial/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles & Tailwind
│   ├── contact/
│   │   └── page.tsx       # Contact page with intake form
│   ├── services/
│   │   └── page.tsx       # Services page
│   └── team/
│       └── page.tsx       # Team page
├── components/
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Site footer
├── public/                # Static assets (add images here)
│   └── team/              # Team member photos
├── tailwind.config.js     # Tailwind with Rise brand colors
└── package.json
```

## Brand Colors

The site uses a custom color palette defined in `tailwind.config.js`:

- `rise-navy`: #1a2e4c (primary dark)
- `rise-blue`: #2d5a87 (primary)
- `rise-sky`: #5b8fb9 (light blue)
- `rise-gold`: #c9a961 (accent)
- `rise-cream`: #f8f6f1 (background)
- `rise-slate`: #4a5568 (text)

## Adding Team Photos

1. Add photos to `/public/team/` (e.g., `thomas.jpg`, `josh.jpg`)
2. Update the image paths in `/app/team/page.tsx`
3. Uncomment the Image component code

## Form Integration

The contact form in `/app/contact/page.tsx` currently simulates submission. To make it functional:

### Option A: Formspree (Easiest)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a form and get your endpoint
3. Update the form action:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: JSON.stringify(formState),
    headers: { 'Content-Type': 'application/json' }
  })
  if (response.ok) setIsSubmitted(true)
}
```

### Option B: Custom API Route
Create `/app/api/contact/route.ts` to handle submissions with your preferred backend.

## Next Steps

- [ ] Add team member photos
- [ ] Connect contact form to backend
- [ ] Add blog functionality (can use MDX or a CMS like Sanity)
- [ ] Add client portal redirect
- [ ] Set up custom domain in Vercel
- [ ] Add analytics (Vercel Analytics or Google Analytics)

## Need Help?

This site was built to be easily maintainable. For content changes:
- Text content is in each page's `.tsx` file
- Styles use Tailwind classes
- Colors are in `tailwind.config.js`

For more complex changes, feel free to reach out!
