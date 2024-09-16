import './App.css'
import Banner from './components/Banner/Banner'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import News from './components/News/News'
import NewsActi from './components/News/NewsActi'
import OurSystem from './components/OurSystem/OurSystem'
import Allnews from './components/News/Allnews/Allnews' 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

function App() {
  return (
    <Router>
      <Navbar />
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
      </Routes>
      <Footer />
    </Router>
  )
}

export default App;
