import { GoogleGenerativeAI } from '@google/generative-ai'
import { GitHubData } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

function calculateChillLevel(githubData: GitHubData) {
  const {
    user = { public_repos: 0, followers: 0 },
    recentActivity = [],
    pinnedRepos = [],
  } = githubData

  // Activity scoring based on public repos and followers
  const activityScore = Math.min((user.public_repos / 30) * 0.7 + (user.followers / 100) * 0.3, 1) * 30
  const consistencyScore = (recentActivity.length / 10) * 25
  const projectScore = (pinnedRepos.length / 6) * 15

  const totalScore = activityScore + consistencyScore + projectScore 
  return Math.round(totalScore)
}

const chillGuyMessages = {
  active: [
    "You're like the Chill Guy, making it look so easy with those commits! 🐕",
    "Lowkey crushing it like our favorite laid-back doggo! 🐾",
    "Just vibing and coding, that's your whole deal! 🎧",
    "My guy's out here in their grey sweater, pushing code like it's nothing 💻"
  ],
  inactive: [
    "Even Chill Guy had to start somewhere before he got his grey sweater game on! 🐕",
    "Hands in pockets, taking it easy? Time to show them what you've got! 💪",
    "The Chill Guy energy is there, just needs a bit more git push! 🚀",
    "Looking as calm as Chill Guy, but let's turn that smirk into some commits! 🎮"
  ]
}

export async function generateAIInsights(githubData: GitHubData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-exp-1121' })
    const chillLevel = calculateChillLevel(githubData)
    const isActive = chillLevel > 50

    const chillGuyMessage = chillGuyMessages[isActive ? 'active' : 'inactive'][
      Math.floor(Math.random() * 4)
    ]

    const prompt = `
Generate a ${isActive ? 'celebratory' : 'motivational'} message for a GitHub user with a ${chillLevel}% activity score.

Context: Reference the "Just a Chill Guy" meme - a laid-back dog character in a grey sweater and jeans who makes everything look effortless.

${isActive ? `
For active users (>50%):
- Channel that "they make it look so easy" energy
- Mention their effortless coding style
- Compare their smooth git workflow to Chill Guy's relaxed vibe
- Add coding puns with a laid-back twist
` : `
For less active users (≤50%):
- Use Chill Guy's supportive, no-pressure attitude
- Suggest taking it easy while improving
- Reference "lowkey doesn't give a fuck" but in a productive way
- Add humor about finding their coding groove
`}

Chill Guy Message: ${chillGuyMessage}

GitHub Data: ${JSON.stringify(githubData)}

Keep it under 150 words, use emojis naturally, and make it personal. Remember: we're channeling that laid-back dog in the grey sweater who makes everything look effortless!
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