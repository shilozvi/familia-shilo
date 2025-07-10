'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    // בדיקה אם המשתמש כבר מחובר
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push('/select-user')
      }
    })
  }, [router])

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/select-user`
        }
      })
      
      if (error) {
        console.error('שגיאה בהתחברות:', error)
      }
    } catch (error) {
      console.error('שגיאה בהתחברות:', error)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-right rtl px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">התחברות</h1>
        <p className="text-gray-600 mb-6 text-center">
          התחברו עם חשבון Google שלכם כדי להיכנס לאתר המשפחתי
        </p>
        <button
          onClick={handleGoogleLogin}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg text-lg hover:bg-red-700 transition"
        >
          התחברות עם Google
        </button>
        <p className="text-sm text-gray-500 mt-4 text-center">
          לאחר ההתחברות תוכלו לבחור שם משתמש משפחתי
        </p>
      </div>
    </main>
  )
}
