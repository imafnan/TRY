import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { TopBar } from '@/components/layout/TopBar'
import { CertificateGalleryGrid } from '@/components/site/CertificateGalleryGrid'
import React from 'react'

const page = () => {
  return (
    <div>
            <TopBar/>
            <Navbar/>
                <div className="container mx-auto px-4 py-8">
                        <CertificateGalleryGrid />
                </div>
            <Footer/>        
    </div>
  )
}

export default page
