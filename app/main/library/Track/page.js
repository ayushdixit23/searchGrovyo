"use client"
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
const Component = dynamic(() => import('./component'), { ssr: false })

const page = () => {
  return (
    <>
      <Toaster />
      <Suspense fallback={<><div className='flex justify-center items-center h-screen'>
        <div className='animate-spin'>
          <AiOutlineLoading3Quarters />
        </div>
      </div></>}>
        <Component />
      </Suspense>
    </>
  )
}

export default page
