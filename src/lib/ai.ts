import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

interface GithubData {
  commitCount: number;
  recentActivity: any[];
  pinnedRepos: any[];
  user: {
    followers: number;
  };
}

function calculateChillLevel(githubData: GithubData) {
  const {
    commitCount = [],
    recentActivity = [],
    pinnedRepos = [],
    user = {}
  } = githubData
  // Activity scoring
  const activityScore = Math.min((commitCount as number) / 100, 1) * 30
  const consistencyScore = (recentActivity.length / 10) * 25
  const projectScore = (pinnedRepos.length / 6) * 15
  const socialScore = Math.min(((user as {followers: number}).followers || 0) / 50, 1) * 10

  const totalScore = activityScore + consistencyScore + projectScore + socialScore
  return Math.round(totalScore)
}

export async function generateAIInsights(githubData: GithubData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-exp-1121' })
    const chillLevel = calculateChillLevel(githubData)
    const isActive = chillLevel > 50

    const chillGuyMessage = isActive 
      ? "You're like the Chill Guy, effortlessly making it look easy! Keep up the great work!" 
      : "Even Chill Guy has his off days. Let's find ways to boost your GitHub game!"

    const prompt = `
Generate a ${isActive ? 'celebratory' : 'motivational'} message for a GitHub user with a ${chillLevel}% activity score.

${isActive ? `
For active users (>80%):
- Celebrate their consistency
- Highlight their achievements
- Use positive, energetic tone
- Include specific stats
- Add a fun coding quote
- Reference the Chill Guy meme
` : `
For less active users (≤60%):
- Use friendly, encouraging tone
- Suggest improvement areas
- Include a motivational quote
- Add humor about procrastination
- Reference the Chill Guy meme
- End with a call to action
`}

Chill Guy Message: ${chillGuyMessage}

GitHub Data: ${JSON.stringify(githubData)}

Keep it under 150 words, use emojis naturally, and make it personal.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return {
      appreciation: text.trim(),
      chillLevel
    }
  } catch (error) {
    console.error('Error in generateAIInsights:', error)
    throw error
  }
}