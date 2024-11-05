export async function fetchGitHubData(username: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub data: ${response.statusText}`)
    }
    const userData = await response.json()

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`)
    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repositories: ${reposResponse.statusText}`)
    }
    const reposData = await reposResponse.json()

    return {
      user: userData,
      repos: reposData,
    }
  } catch (error) {
    console.error('Error in fetchGitHubData:', error)
    throw error
  }
}