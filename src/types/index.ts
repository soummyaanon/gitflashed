export interface Flashcard {
    title: string
    description: string
    content: string
  }
  
  export interface GitHubUser {
    login: string
    name: string
    bio: string
    public_repos: number
    followers: number
    following: number
    created_at: string
  }
  
  export interface GitHubRepo {
    name: string
    description: string
    stargazers_count: number
    language: string
    updated_at: string
  }
  
  export interface GitHubData {
    user: GitHubUser
    repos: GitHubRepo[]
  }