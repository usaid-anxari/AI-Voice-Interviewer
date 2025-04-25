import { Button } from '@/components/ui/button'
import { isAuthenticated, signOut } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout = async ({children}:{children:ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  
  if (!isUserAuthenticated) return redirect ('/sign-in')
  return (
    <div className='root-layout'>
      <nav className='flex justify-between'>
        <Link href='/' className='flex items-center gap-2' >
         <Image src={'logo.svg'} alt='logo' width={38} height={36} />
         <h2 className='text-primary-100'>AI Voice Agent</h2>
        </Link>
        <Button className="rounded-2xl bg-red-400 max-sm:w-full" onClick={signOut}>
            {/* <Link href="/sign-in">Sign-out</Link> */}
            Signout
          </Button>
        
      </nav>
      {children}
    </div>
  )
}

export default RootLayout