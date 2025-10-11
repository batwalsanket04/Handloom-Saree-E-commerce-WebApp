import React, { useContext } from 'react'
import {context} from '../../Context/StoreContext'
import SareeItem from '../SareeItem/SareeItem'

const SareeDisplay = ({category}) => {
 const {SareeList2}=useContext(context)
  return (

    <div className=''>
      <h2 className='mb-5 text-2xl text-justify p-3 w-full  sm:text-2xl sm:mt-[50px]  md:text-6xl md:mt-[20px] lg:text-4xl xl:text-5xl xl:mt-20 font-bold text-pink-600 drop-shadow-lg 
              2xl:text-7xl'>Top Saree's Near You</h2>
      <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6'>
        {
       
          SareeList2
           .filter(val=> category===val.category  || category=='All')
          .map((val,index,)=>(

            <SareeItem
             key={index} 
            id={val.id} 
            name={val.name}
            img={val.img}
            description={val.description} 
            category={val.category}
            price={val.price}
             />
        
          ))  
          }
          
      </div>
    </div>
  )
}

export default SareeDisplay
