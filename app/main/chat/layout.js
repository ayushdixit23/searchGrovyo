"use client"
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
const Component = dynamic(() => import('./laycom'), { ssr: false })

const page = ({ children }) => {
  return (
    <>
      <Toaster />
      <Suspense fallback={<><div className='flex justify-center items-center h-screen'>
        <div className='animate-spin'>
          <AiOutlineLoading3Quarters />
        </div>
      </div></>}>
        <Component>{children}</Component>
      </Suspense>
    </>
  )
}

export default page
