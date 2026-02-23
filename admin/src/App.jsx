import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Componants/Navbar/Navbar';
import Sidebar from './Componants/Sidebar/Sidebar';
import Add from './Pages/Add/Add';
import List from './Pages/List/List';
import Orders from './Pages/Orders/Orders';
import Login from './Pages/Login/Login';
import RequireAdmin from './Componants/RequireAdmin/RequireAdmin';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const url = "http://localhost:4000";

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <ToastContainer/>
      <div className="flex flex-col min-h-screen">
        {!isLoginPage && <Navbar />}
        <div className="flex flex-1">
          {!isLoginPage && <Sidebar />}
          <main className={`${isLoginPage ? "w-full" : "flex-1"} p-6`}>
            <Routes>
              <Route path="/login" element={<Login url={url} />} />
              <Route path="/add" element={<RequireAdmin url={url}><Add url={url}/></RequireAdmin>} />
              <Route path="/list" element={<RequireAdmin url={url}><List url={url}/></RequireAdmin>} />
              <Route path="/order" element={<RequireAdmin url={url}><Orders url={url}/></RequireAdmin>} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;