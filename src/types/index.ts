export interface Flashcard {
  id: string
  title: string
  content: string
}

export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  public_repos: number
  followers: number
  following: number
}

export interface PinnedRepo {
  name: string
  description: string
  stars: number
  url: string
  language: string
}

export interface Activity {
  type: string
  repo: {
    name: string
  }
  created_at: string
}

export interface GitHubData {
  user: GitHubUser
  pinnedRepos: PinnedRepo[]
  recentActivity: {
    type: string
    repo: string
    date: string
  }[]
}

export interface AIInsights {
  appreciation: string
  activity_summary: string
  improvement_suggestion: string
}
export interface ActivityData {
  date: Date;
  count: number;
}
export interface GitHubStats {

  public_repos: number;

  followers: number;

  following: number;

}
