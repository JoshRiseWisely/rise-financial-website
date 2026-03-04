/**
 * Generate a URL-safe slug from a title string.
 * "My Blog Post Title!" → "my-blog-post-title"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, '-')  // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')      // Collapse multiple hyphens
    .replace(/^-|-$/g, '')    // Trim hyphens from edges
}

/**
 * Ensure a slug is unique by appending -2, -3, etc. if needed.
 * Checks against existing slugs via the provided query function.
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug
  let suffix = 2

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${suffix}`
    suffix++
  }

  return slug
}
