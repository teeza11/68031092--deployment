// utils/login.ts

import { Credential, logout } from '@/data/credential'
import { useRouter } from 'next/navigation'
type Router = ReturnType<typeof useRouter>

export const checkLogin = (router: Router, retrunPath: string) => {
  // back up return
  localStorage.setItem('returnPath', retrunPath)
  // check credential
  const credentailString = localStorage.getItem('credential')
  if (credentailString !== null) {
    // ok
    const { token, email, name, role }: Credential =
      JSON.parse(credentailString)
    if (
      token === undefined ||
      email === undefined ||
      name === undefined ||
      role === undefined
    ) {
      // fail
      router.replace('/login')
      router.refresh()
    } else {
      // success
      router.replace(retrunPath)
      router.refresh()
    }
  } else {
    // fail
    router.replace('/login')
    router.refresh()
  }
}

export const doLogout = (router: Router, retrunPath: string) => {
  const credentailString = localStorage.getItem('credential')
  if (credentailString !== null) {
    const { token }: Credential = JSON.parse(credentailString)

    logout(token)
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        localStorage.removeItem('credential')
        window.dispatchEvent(new Event('credential-change'))
        router.replace(retrunPath)
        router.refresh()
      })
  } else {
    router.replace(retrunPath)
    router.refresh()
  }
}