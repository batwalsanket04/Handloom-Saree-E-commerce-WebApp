import React, { useState } from 'react'
import Header from '../../componant/Header/Header'
import ExploreMenu from '../../componant/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../componant/SareeDisplay/SareeDisplay'

const Home = () => {
  const [category,setCategory]=useState('All')

  
  return (
    <div>
      <Header/>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category}/>
    </div>
  )
}

export default Home
