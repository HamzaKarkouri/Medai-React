import React from 'react'
import Banner from '../components/Banner'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import MedicalAIChat from "../components/MedicalAIChat";

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
        <MedicalAIChat />
      <Banner />
    </div>
  )
}

export default Home