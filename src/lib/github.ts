import { GitHubData } from '@/types'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const headers: HeadersInit = {
  'Accept': 'application/vnd.github.v3+json',
  ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` })
}

export async function fetchGitHubData(username: string): Promise<GitHubData> {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, { headers })
    ])

    if (!userResponse.ok || !reposResponse.ok) {
      const rateLimitRemaining = Number(userResponse.headers.get('x-ratelimit-remaining'))
      if (rateLimitRemaining === 0) {
        const resetTime = new Date(Number(userResponse.headers.get('x-ratelimit-reset')) * 1000)
        throw new Error(`GitHub API rate limit exceeded. Resets at ${resetTime.toISOString()}`)
      }
      
      if (userResponse.status === 404) {
        throw new Error(`GitHub user ${username} not found`)
      }
      
      throw new Error(`GitHub API error: ${userResponse.statusText}`)
    }

    const [userData, reposData] = await Promise.all([
      userResponse.json(),
      reposResponse.json()
    ])

    return {
      user: userData,
      pinnedRepos: reposData
        .filter((repo: { fork: boolean }) => !repo.fork)
        .slice(0, 6)
        .map((repo: { name: string; description: string; stargazers_count: number; html_url: string; language: string }) => ({
          name: repo.name,
          description: repo.description || '',
          stars: repo.stargazers_count,
          url: repo.html_url,
          language: repo.language || 'Unknown'
        })),
      recentActivity: reposData
        .slice(0, 5)
        .map((repo: { full_name: string; updated_at: string }) => ({
          type: 'UpdatedRepo',
          repo: repo.full_name,
          date: new Date(repo.updated_at).toLocaleDateString()
        }))
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    throw error
  }
}