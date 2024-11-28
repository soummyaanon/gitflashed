import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function generateAIInsights(githubData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Create a warm, heartfelt message for a fellow developer (about 5-7 sentences total):

Opening:
"While others might create GitHub roasting apps, I'm here to celebrate your coding journey! Every line of code tells a story, and yours is one of dedication and passion."

Then add a personal message that:
1. Appreciates their commitment to open source
2. Includes one inspiring programming quote
3. Acknowledges the developer journey
4. Adds a touch of developer camaraderie
5. Ends with brief encouragement

Style guidelines:
- Keep it warm and conversational
- Focus on the journey, not numbers
- Make it personal and relatable
- Include one coding metaphor
- Keep sentences clear and concise

Format as a natural, flowing paragraph.
Aim for about 100-150 words total.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()

    return {
      appreciation: text.trim()
    }
  } catch (error) {
    console.error('Error in generateAIInsights:', error)
    throw error
  }
}