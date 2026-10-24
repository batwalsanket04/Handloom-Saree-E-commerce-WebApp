import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Componants/Navbar/Navbar';
import Sidebar from './Componants/Sidebar/Sidebar';
import Add from './Pages/Add/Add';
import List from './Pages/List/List';
import Orders from './Pages/Orders/Orders';
import Login from './Pages/Login/Login';
import UserManagement from './Pages/UserManagement/UserManagement';
import Dashboard from './Pages/Dashboard/Dashboard';
import RequireAdmin from './Componants/RequireAdmin/RequireAdmin';

const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {!isLoginPage && <Navbar />}
        <div className="flex flex-1">
          {!isLoginPage && <Sidebar />}
          <main className={`${isLoginPage ? "w-full" : "flex-1"} p-6`}>
            <Routes>
              <Route path="/login" element={<Login url={url} />} />
              <Route path="/add" element={<RequireAdmin><Add url={url}/></RequireAdmin>} />
              <Route path="/list" element={<RequireAdmin><List url={url}/></RequireAdmin>} />
              <Route path="/orders" element={<RequireAdmin><Orders url={url}/></RequireAdmin>} />
              <Route path="/users" element={<RequireAdmin><UserManagement url={url}/></RequireAdmin>} />
              <Route path="/dashboard" element={<RequireAdmin><Dashboard url={url}/></RequireAdmin>} />
              <Route path="/" element={<RequireAdmin><Dashboard url={url}/></RequireAdmin>} />
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
