'use client'

import { useRouter } from 'next/navigation'
import { login } from '@/data/credential'
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/tailgrids/core/dialog'
import { Button } from '@/components/tailgrids/core/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/tailgrids/core/input-group'
import { EyeDisabled, Keyboard } from '@tailgrids/icons'
import { useRef, useState } from 'react'

type LoginDialogProps = {
  isOpen?: boolean
}

export default function LoginDialog({ isOpen = true }: LoginDialogProps) {
  const router = useRouter()
  const userInputRef = useRef<HTMLInputElement>(null)
  const passInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = () => {
    const userDom = userInputRef.current
    const passDom = passInputRef.current
    if (!userDom || !passDom) return

    const user = userDom.value.trim()
    const pass = passDom.value.trim()

    if (user === '') {
      setError('Error: user is required')
      userDom.focus()
      return
    }
    if (pass === '') {
      setError('Error: password is required')
      passDom.focus()
      return
    }

    setError(null)
    login(`${user}@company.com`, pass)
      .then((credential) => {
        localStorage.setItem('credential', JSON.stringify(credential))
        window.dispatchEvent(new Event('credential-change'))
        const returnPath = localStorage.getItem('returnPath') || '/'
        const safeReturnPath =
          returnPath.startsWith('/') && !returnPath.startsWith('//')
            ? returnPath
            : '/'
        localStorage.removeItem('returnPath')
        router.replace(safeReturnPath)
        router.refresh()
      })
      .catch((error) => {
        userDom.value = ''
        passDom.value = ''
        setError(`Error: ${error}`)
        userDom.focus()
      })
  }

  return (
    <Dialog isOpen={isOpen} showCloseButton={false} className='w-72 max-w-[calc(100vw-2rem)] p-3'>
      <DialogHeader>
        <DialogTitle className='text-center'>Who are you?</DialogTitle>
      </DialogHeader>
      <DialogBody className='py-2'>
        {error && <p role='alert' className='mb-2 text-xs text-red-600'>{error}</p>}
        <InputGroup>
          <InputGroupAddon align='inline-start' className='px-2 text-xs'>
            <Keyboard />
          </InputGroupAddon>
          <InputGroupInput ref={userInputRef} id='user' placeholder='user | admin | manager' className='py-1 text-xs' />
          <InputGroupAddon align='inline-end' className='px-2 text-xs'>@company.com</InputGroupAddon>
        </InputGroup>
        <InputGroup className='mt-2'>
          <InputGroupAddon align='inline-start' className='px-2 text-xs'>
            <EyeDisabled />
          </InputGroupAddon>
          <InputGroupInput ref={passInputRef} id='pass' type='password' placeholder='pass' className='py-1 text-xs' />
        </InputGroup>
      </DialogBody>
      <DialogFooter className='pt-2'>
        <div className='flex justify-end'>
          <Button appearance='outline' size='sm' onPress={handleLogin}>
            Login
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  )
}