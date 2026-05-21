import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { TopBar } from '@/components/layout/TopBar'
import { AboutSection } from '@/sections/AboutSection'
import { AboutSection2 } from '@/sections/AboutSection2'
import React from 'react'

const page = () => {
  return (
    <div>
        <TopBar/>
        <Navbar/>
        <AboutSection/>
        <AboutSection2/>
        <Footer/>
      
    </div>
  )
}

export default page
