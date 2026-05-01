import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // 將原本的首頁內容移到這裡
import AdminPage from './pages/AdminPage'; // 後台管理頁面

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* 前台首頁 */}
          <Route path="/" element={<Home />} />
          {/* 後台管理：確保這個路徑能進去 */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
