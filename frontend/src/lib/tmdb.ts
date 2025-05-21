/**
 * Constructs a TMDB image URL with the specified path
 * @param path The image path from TMDB
 * @returns The full TMDB image URL
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.svg"

  // If the path already includes the base URL, return it as is
  if (path.startsWith("https://image.tmdb.org/")) {
    return path
  }

  // Ensure the path starts with a slash
  const formattedPath = path.startsWith("/") ? path : `/${path}`

  // Return the full TMDB image URL
  return `https://image.tmdb.org/t/p/w500${formattedPath}`
}

/**
 * Constructs a TMDB backdrop image URL with the specified path
 * @param path The backdrop image path from TMDB
 * @returns The full TMDB backdrop image URL
 */
export function getBackdropUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.svg"

  // If the path already includes the base URL, return it as is
  if (path.startsWith("https://image.tmdb.org/")) {
    return path
  }

  // Ensure the path starts with a slash
  const formattedPath = path.startsWith("/") ? path : `/${path}`

  // Return the full TMDB image URL with a larger size for backdrops
  return `https://image.tmdb.org/t/p/w1280${formattedPath}`
}

/**
 * Constructs a TMDB profile image URL with the specified path
 * @param path The profile image path from TMDB
 * @returns The full TMDB profile image URL
 */
export function getProfileUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.svg"

  // If the path already includes the base URL, return it as is
  if (path.startsWith("https://image.tmdb.org/")) {
    return path
  }

  // Ensure the path starts with a slash
  const formattedPath = path.startsWith("/") ? path : `/${path}`

  // Return the full TMDB image URL
  return `https://image.tmdb.org/t/p/w185${formattedPath}`
}
