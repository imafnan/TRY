import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { TopBar } from '@/components/layout/TopBar'
import { CertificateSection } from '@/sections/CertificateSection'
import React from 'react'

const page = () => {
  return (
    <div>
        <TopBar/>
        <Navbar/>
        <CertificateSection/>
        <Footer/>
    </div>
  )
}

export default page
