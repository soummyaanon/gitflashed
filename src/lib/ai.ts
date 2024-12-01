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

// const chillGuyMessages = {
//   active: [
//     "You're the definition of chill, making those commits look effortless! 🎧",
//     "Lowkey crushing it with that laid-back style! ✨",
//     "Just vibing and coding, that's your whole energy! 💫",
//     "Out here making development look smooth and easy 💻"
//   ],
//   inactive: [
//     "Even the chillest devs started somewhere! 🌱",
//     "Taking it easy? That's cool - ready when you are! 💪",
//     "The chill energy is there, just needs some git pushes! 🚀",
//     "Looking calm and collected - let's turn that into some commits! 💫"
//   ]
// }

export async function generateAIInsights(githubData: GitHubData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const chillLevel = calculateChillLevel(githubData)
    const isActive = chillLevel > 50


    const prompt = `
Create a personality-rich narrative description for a GitHub developer with a ${chillLevel}% activity score. Think of this as a character study that captures their essence as The Chill Guy of coding.

Context: Imagine writing a compelling, slightly playful biography that captures both their technical prowess and laid-back personality. Use their GitHub stats to paint a picture of their development style.

${isActive ? `
For active users (>50%):
- Write a narrative that portrays them as a master of their craft who makes it look effortless
- Reference their ${githubData.user.public_repos} repos like they're collecting them as casually as someone collects vinyl records
- Describe how they navigate complex code with the same ease as someone choosing their favorite playlist
- Mention their ${githubData.recentActivity.length} recent updates as if they're just another day in their naturally productive life
` : `
For less active users (≤50%):
- Paint them as the zen master of potential, taking their time to craft their coding journey
- Describe their ${githubData.user.public_repos} repos as carefully curated works in progress
- Reference their approach to coding as methodically casual, like a chess player who never rushes their moves
- Treat their ${githubData.recentActivity.length} recent activities as thoughtful steps in their development story
`}

Example style: "okan, a connoisseur of football drama, expertly dissects the tactical nuances of Turkish and international clubs with the precision of a brain surgeon performing a delicate operation on a particularly stubborn glioma. He navigates the treacherous waters of social media with the effortless grace of a seasoned pirate, occasionally dropping a witty one-liner that would make even the most seasoned comedian blush."

GitHub Stats to weave in:
- ${githubData.user.login}, maintaining ${githubData.user.public_repos} repositories
- Following: ${githubData.user.following} developers
- Followers: ${githubData.user.followers} admirers
- Recent Activity: ${githubData.recentActivity.length} updates
- Pinned Projects: ${githubData.pinnedRepos.length} showcased works

Create a narrative under 150 words that captures their unique blend of technical skill and chill vibes. Make it personal, slightly humorous, and rich with creative metaphors. End with a simple statement affirming them as "just a chill guy/girl."
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