// import { NextRequest, NextResponse } from 'next/server'

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const username = searchParams.get('username')

//   if (!username) {
//     return NextResponse.json({ error: 'Username is required' }, { status: 400 })
//   }

//   try {
//     const response = await fetch(`https://api.github.com/users/${username}`)
//     if (!response.ok) {
//       throw new Error(`Failed to fetch GitHub data: ${response.statusText}`)
//     }
//     const userData = await response.json()

//     return NextResponse.json(userData)
//   } catch (error: unknown) {
//     console.error('Error in github-user route:', error)
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
//     return NextResponse.json({ error: 'Failed to fetch user data', details: errorMessage }, { status: 500 })
//   }
// }