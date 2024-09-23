import { Route, Routes } from 'react-router-dom';
import Banner from '../components/Banner/Banner';
import OurSystem from '../components/OurSystem/OurSystem';
import News from '../components/News/News';
import NewsActi from '../components/News/NewsActi';
import Allnews from '../components/News/Allnews/Allnews';
import CalendarMain from '../components/Calendar/CalendarMain';
import MemberList from '../components/Member/MemberList';
import Heart from '../components/OurSystem/Room/Meeting/Heart';

const UserRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <>
          <Banner />
          <OurSystem />
          <News />
          <NewsActi />
        </>
      }
    />
    <Route path="/allnews" element={<Allnews />} />
    <Route path="/Heart" element={<Heart />} />
    <Route path="/CalendarMain" element={<CalendarMain />} />
    <Route path="/MemberList" element={<MemberList />} />
  </Routes>
);

export default UserRoutes;
