import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
 
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
 
import { context } from './Context/StoreContext'
import { ProtectedRoute } from './componant/ProtectedRoute'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Wishlist from './pages/Wishlist/Wishlist'
 

function App() {
  const [showLogin,setShowLogine]=useState(false);
  const {token}=useContext(context);

  // Show login popup after 5 seconds if not authenticated
  useEffect(() => {
    if(!token){
      const timer = setTimeout(() => {
        setShowLogine(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  return (
    <>
      {showLogin && !token && <LoginPopUp setShowLogine={setShowLogine}/>}

      <Router>
        <Navbar setShowLogine={setShowLogine}/>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home/>} />
          <Route path='/collection' element={<Collection/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<Contact/>}/>

          {/* Protected Routes - Requires Authentication */}
          <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>} />
          <Route path='/order' element={<ProtectedRoute><PlaceOrder/></ProtectedRoute>} />
          <Route path='/verify' element={<ProtectedRoute><Verify/></ProtectedRoute>}/>
          <Route path='/myorders' element={<ProtectedRoute><MyOrders/></ProtectedRoute>} />
          <Route path='/wishlist' element={<ProtectedRoute><Wishlist/></ProtectedRoute>} />
        </Routes>
        
        <ScrollTop/>
        <Footer/>
      </Router>
    </>
  )
}

export default App