import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function generateAIInsights(githubData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
Based on the following GitHub activity data, create a warm, fun message that includes a data-driven "Chill Level" percentage (0-100%). 

Scoring Guidelines:
- Calculate the Chill Level by analyzing these factors:
  * Commit Consistency: 30% weight (lower score for erratic patterns or excessive commits)
  * Time Balance: 25% weight (higher score for balanced 9-5 work hours vs late night coding)
  * Weekend/Weekday Ratio: 20% weight (higher score for less weekend work)
  * Project Variety: 15% weight (higher score for diverse projects)
  * Collaboration: 10% weight (higher score for more social coding)

The final score should reflect the actual data patterns and vary significantly between users.
Avoid defaulting to middle-range scores (75-85%).

Start with:
"Let me analyze your vibe real quick... 🧘‍♂️"

Then include:
1. A calculated "Chill Level" percentage with a brief explanation
2. A warm appreciation of their coding style
3. One inspiring programming quote
4. A friendly nod to work-life balance
5. An encouraging closing message

Style guidelines:
- Keep it casual and fun
- Use emojis naturally
- Make it personal and relatable
- Include one coding metaphor
- Keep it light and positive

Format as a natural, flowing paragraph.
Aim for about 100-150 words total.

GitHub Data to analyze: ${JSON.stringify(githubData)}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return {
      appreciation: text.trim()
    }
  } catch (error) {
    console.error('Error in generateAIInsights:', error)
    throw error
  }
}