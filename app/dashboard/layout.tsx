import { ReactNode } from 'react'
import DashboardNavbar from '../components/DashboardNavbar'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '../lib/db'
import { stripe } from '../lib/stripe'
import { unstable_noStore as noStore } from "next/cache";
//& after setting up prisma we are trying to get authenticated users and save them in supabasee

async function getData({ email, id, firstName, lastName, profileImage }: {
  email: string,
  id: string,
  firstName: string | undefined | null,
  lastName: string | undefined | null,
  profileImage: string | undefined | null
}) {

  noStore()
  //? import prisma only from db not client
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    }

  })
  if (!user) {
    const name = `${firstName ?? ''}${lastName ?? ''}`
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name,

      }
    })
  }

  // !creating  customer id for new users for stripe cusotmer id
  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email: email,
    });

    // ? updating user with id after creating customer id, and for checking this we can check it in stripe dashboard 

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        stripeCustomerId: data.id
      }
    })
  }
}


const dashboardLayout = async ({ children }: { children: ReactNode }) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser();


  if (!user) {
    return redirect('/')
  }

  await getData({ email: user.email as string, firstName: user.given_name as string, id: user.id as string, lastName: user.family_name as string, profileImage: user.picture })


  return (
    <div className='flex flex-col space-y-6 mt-10'>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">

        <aside className='hidden w-[200px] flex-col md:flex'>
          <DashboardNavbar />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}

export default dashboardLayout
