import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { TopBar } from '@/components/layout/TopBar'
import { DocumentsSection } from '@/sections/DocumentsSection'
import React from 'react'

const page = () => {
  return (
    <div>
        <TopBar/>
        <Navbar/>
        <DocumentsSection/>
        <Footer/>
      
    </div>
  )
}

export default page
