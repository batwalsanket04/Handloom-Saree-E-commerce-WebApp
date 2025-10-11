 import React from 'react';
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import Navbar from './Componants/Navbar/Navbar';
 import Sidebar from './Componants/Sidebar/Sidebar';
 import Add from './Pages/Add/Add';
 import List from './Pages/List/List';
 import Orders from './Pages/Orders/Orders';
  
 
 const App = () => {
   return (
     <>
      <div className="flex flex-col min-h-screen">
   <Navbar />
   <div className="flex flex-1">
     <Sidebar />
     <main className="flex-1 p-6">
       <Routes>
         <Route path="/add" element={<Add />} />
         <Route path="/list" element={<List />} />
         <Route path="/order" element={<Orders/>} />
       </Routes>
     </main>
   </div>
 </div>
 
     </>
   
   );
 };
 
 export default App;
 