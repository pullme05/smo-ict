// import './App.css'
import Banner from './components/Banner/Banner'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import News from './components/News/News'
import NewsActi from './components/News/NewsActi'
import OurSystem from './components/OurSystem/OurSystem'
import Allnews from './components/News/Allnews/Allnews' 
// @ts-ignore
import Meeting from './components/OurSystem/Room/Old/Meeting.jsx';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar จะอยู่ด้านบนทุกหน้าตลอดเมื่อไปยังหน้าถัดไป */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <OurSystem />
              <News />
              <NewsActi />
            </>
          } />
          <Route path="/allnews" element={<Allnews />} /> 
          <Route path="/meeting" element={<Meeting />} /> 
        </Routes>
      </div>
      
      <Footer /> {/* Footer จะอยู่ด้านล่างทุกหน้า */}
    </Router>
  );
}


export default App;
