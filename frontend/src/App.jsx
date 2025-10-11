import { useEffect, useState } from 'react'
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './componant/Navbar'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './componant/Footer/Footer'
import ScrollTop from './componant/Footer/ScrollTop'
import LoginPopUp from './componant/LoginPopUp/LoginPopUp'
import About from './componant/About/About'
import Collection from './componant/Collection/Collection'
import Contact from './componant/Contact/Contact'
 

function App() {
  const [count, setCount] = useState(0);
  const [showLogin,setShowLogine]=useState(false);


   useEffect(()=>
  {
    const timer=setTimeout(()=>{
      setShowLogine(true);
    },5000)
    return ()=>clearTimeout(timer);
    
  },[])


  return (
    <>
    {
      showLogin && <LoginPopUp  setShowLogine={setShowLogine}/> 
    }
    <Router>
      <Navbar setShowLogine={setShowLogine}/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/collection' element={<Collection/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/cart' element={<Cart/>} />
        <Route path='/order' element={<PlaceOrder/>} />

        
      </Routes>
      <ScrollTop/>
      <Footer/>
    </Router>
    </>
  )
}

export default App