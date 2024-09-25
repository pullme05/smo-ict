import { Route, Routes } from 'react-router-dom';
import Banner from '../components/Banner/Banner';
import OurSystem from '../components/OurSystem/OurSystem';
import News from '../components/News/News';
import NewsActi from '../components/News/NewsActi';
import Allnews from '../components/News/Allnews/Allnews';
import MemberList from '../components/Member/MemberList';
import Heart from '../components/OurSystem/Room/Meeting/Heart';
import UserCalendar from '../components/Calendar/UserCalendar';
import MemberUser from '../components/MemberUser/MemberUser';

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
    <Route path="/MemberList" element={<MemberList />} />
    <Route path="/MemberUser" element={<MemberUser />} />
    <Route path="/UserCalendar" element={<UserCalendar />} />
  </Routes>
);

export default UserRoutes;
