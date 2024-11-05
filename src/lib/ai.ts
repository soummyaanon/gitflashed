import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function generateFlashcards(githubData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
      Based on the following GitHub user data, generate 6 flashcards highlighting key aspects of their GitHub profile and activities. Each flashcard should have a title, a brief description, and some content. The content should include a short compliment or encouragement related to their GitHub journey.

      User data:
      ${JSON.stringify(githubData.user, null, 2)}

      Top 5 repositories:
      ${JSON.stringify(githubData.repos, null, 2)}

      Format the response as a JSON array of objects, each representing a flashcard with "title", "description", and "content" fields.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return JSON.parse(text)
  } catch (error) {
    console.error('Error in generateFlashcards:', error)
    throw error
  }
}