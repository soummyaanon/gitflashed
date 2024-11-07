import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function generateAIInsights(githubData: any) {
  try {
    console.log('Initializing AI model')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Based on the following GitHub user data, generate insights including:
1. An appreciation of their work
2. A summary of their activity
3. A suggestion for improvement

User data:
${JSON.stringify(githubData.user, null, 2)}

Top repository:
${JSON.stringify(githubData.topRepo, null, 2)}

Format the response as a JSON object with "appreciation", "activity_summary", and "improvement_suggestion" fields. Do not include any code blocks or markdown formatting.
`

    console.log('Generating AI content')
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = await response.text()
    console.log('AI content generated successfully:', text)
    
    // Remove code fences if any
    text = text.replace(/```json\s*([\s\S]*?)```/i, '$1').trim()
    text = text.replace(/```[\s\S]*?```/g, '').trim()

    return JSON.parse(text)
  } catch (error) {
    console.error('Error in generateAIInsights:', error)
    throw error
  }
}