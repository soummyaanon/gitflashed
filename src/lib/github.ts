import { GitHubUser, PinnedRepo, Activity, GitHubData } from '@/types'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const headers: HeadersInit = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}

export async function fetchGitHubData(username: string): Promise<GitHubData> {
  try {
    // Fetch user data
    console.log(`Fetching user data for: ${username}`)
    const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers })
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch GitHub user data: ${userResponse.statusText}`)
    }
    const userData: GitHubUser = await userResponse.json()
    console.log('User data fetched successfully')

    // Fetch pinned repositories
    console.log(`Fetching pinned repositories for: ${username}`)
    const pinnedReposQuery = `
      query {
        user(login: "${username}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                stargazerCount
                url
                primaryLanguage {
                  name
                }
              }
            }
          }
        }
      }
    `
    const pinnedReposResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: pinnedReposQuery }),
    })
    if (!pinnedReposResponse.ok) {
      throw new Error(`Failed to fetch pinned repositories: ${pinnedReposResponse.statusText}`)
    }
    const pinnedReposData = await pinnedReposResponse.json()
    const pinnedRepos: PinnedRepo[] = pinnedReposData.data.user.pinnedItems.nodes.map((repo: any) => ({
      name: repo.name,
      description: repo.description || '',
      stars: repo.stargazerCount,
      url: repo.url,
      language: repo.primaryLanguage?.name || 'Unknown',
    }))
    console.log('Pinned repositories fetched successfully')

    // Fetch recent activity
    console.log(`Fetching recent activity for: ${username}`)
    const eventsResponse = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=10`,
      { headers }
    )
    if (!eventsResponse.ok) {
      throw new Error(`Failed to fetch activity: ${eventsResponse.statusText}`)
    }
    const events: Activity[] = await eventsResponse.json()
    console.log('Activity fetched successfully')

    return {
      user: userData,
      pinnedRepos,
      recentActivity: events
        .filter(event => event.type.includes('Event'))
        .map(event => ({
          type: event.type.replace('Event', ''),
          repo: event.repo.name,
          date: new Date(event.created_at).toLocaleDateString()
        }))
        .slice(0, 5)
    }
  } catch (error) {
    console.error('Error in fetchGitHubData:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch GitHub data')
  }
}