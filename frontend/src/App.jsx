import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

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
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Wishlist from './pages/Wishlist/Wishlist'
import ProtectedRoute from './componant/ProtectedRoute'

import { context } from './Context/StoreContext'

function App() {
  const [showLogin, setShowLogine] = useState(false);
  const { token } = useContext(context);

  useEffect(() => {
    if (!token) {
      const timer = setTimeout(() => {
        setShowLogine(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  return (
    <>
      {showLogin && !token && <LoginPopUp setShowLogine={setShowLogine} />}

      <Router>
        <Navbar setShowLogine={setShowLogine} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/cart' element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path='/order' element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          } />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path='/wishlist' element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
        </Routes>
        <ScrollTop />
        <Footer />
      </Router>
    </>
  )
}

export default App