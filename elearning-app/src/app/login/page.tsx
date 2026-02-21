'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, AlertCircle, ArrowRight, Lock } from 'lucide-react'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Simulate network delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 800))

        if (username === 'team' && password === '123456') {
            // Set a simple cookie acting as our session via document.cookie
            // In a real production app, use Next.js server actions (cookies()) for security!
            document.cookie = "team_auth=true; path=/; max-age=86400" // 1 day expiration
            router.push('/courses')
            router.refresh()
        } else {
            setError('Invalid team credentials. Try team / 123456')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden">
            {/* Background Decorative Blur Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />

            <div className="glass-card w-full max-w-md p-8 md:p-12 rounded-[2rem] border border-blue-500/20 shadow-2xl relative z-10 flex flex-col items-center">

                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-8 border border-blue-500/20 shadow-inner">
                    <BookOpen className="w-8 h-8" />
                </div>

                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 text-center">
                    Team Portal
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    Authenticate to access the internal E-Learning catalog.
                </p>

                <form onSubmit={handleLogin} className="w-full space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase ml-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-xl glass-input text-white focus:border-blue-500/50 transition-colors"
                            placeholder="Enter team username"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-xl glass-input text-white focus:border-blue-500/50 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 py-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Access Secure Gateway <ArrowRight className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Encrypted Internal Access</span>
                </div>
            </div>
        </div>
    )
}
