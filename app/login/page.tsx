'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoginDialog from '@/components/LoginDialog'

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    if (localStorage.getItem('credential')) {
      router.replace('/')
    }
  }, [router])

  return <LoginDialog />
}