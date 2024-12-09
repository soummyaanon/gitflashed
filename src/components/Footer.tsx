import React from 'react'
import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'


export function Footer() {
  return (
    <footer className="w-full py-4 px-4 md:px-6 mt-auto bg-gray-900/50" aria-label="Site Footer">
      <div className="container mx-auto flex flex-col items-center justify-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a 
            href="https://www.producthunt.com/posts/chillgits?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-chillgits" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block hover:opacity-90 transition-opacity"
          >
            <img 
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=669016&theme=light" 
              alt="ChillGits - See How Chill Dev You Are... With Chill-Git" 
              width="250" 
              height="54" 
              className="w-[200px] sm:w-[250px]"
            />
          </a>
          <nav className="flex items-center gap-6" aria-label="Social media links">
            <Link 
              href="https://github.com/soummyaanon" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-green-400 transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg"
              aria-label="Visit Soumyaranjan Panda's GitHub profile"
            >
              <Github className="w-8 h-8" aria-hidden="true" />
              <span className="sr-only">GitHub Profile</span>
            </Link>
            <Link 
              href="https://x.com/Thesourya2000" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-green-400 transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg"
              aria-label="Visit Soumyaranjan Panda's X (formerly Twitter) profile"
            >
              <Twitter className="w-8 h-8" aria-hidden="true" />
              <span className="sr-only">X (formerly Twitter) Profile</span>
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-white/70 text-center" role="contentinfo">
            © {new Date().getFullYear()} ChillGits. All Rights Reserved.
          </p>
          <p className="text-xs text-white/50">
            Created by{' '}
            <Link 
              href="https://github.com/soummyaanon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
            >
              Soumyaranjan Panda
            </Link>
          </p>
        </div>

        <div className="text-xs text-white/50 text-center max-w-md">
          <p>
            ChillGits is not affiliated with GitHub. All GitHub-related trademarks 
            and logos are the property of GitHub, Inc.
          </p>
        </div>
      </div>
    </footer>
  )
}
