import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import UserNav from './UserNav'

const Navbar = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession()
  const user = await getUser()
  
  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-3xl">
            Piyush<span className="text-primary">Saas</span>
          </h1>
        </Link>
        <div className="flex items-center gap-x-5">
          {await isAuthenticated() ? (
            <UserNav
              image={user?.picture as string}
              email={user?.email as string}
              name={user?.given_name as string} />
          ) : (
            <div className='flex items-center gap-x-5'>
              <LoginLink>
                <Button>Sign In</Button>
              </LoginLink>
              <RegisterLink>
                <Button variant={"secondary"}>Sign Up</Button>
              </RegisterLink>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>

    </nav>
  )
}

export default Navbar
