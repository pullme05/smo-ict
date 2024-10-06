import { Route, Routes } from 'react-router-dom';
import Banner from '../components/Banner/Banner';
import OurSystem from '../components/OurSystem/OurSystem';
import News from '../components/News/News';
// import NewsActi from '../components/News/NewsActi';
import Allnews from '../components/News/Allnews/Allnews';
import UserCalendar from '../components/Calendar/UserCalendar';
import MemberUser from '../components/MemberUser/MemberUser';
import Qrcode from '../components/QRcode/QRcode';
import MeetingUser from '../components/OurSystem/Room/MeetingUser/MeetingUser';
const UserRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <>
          <Banner />
          <OurSystem />
          <News />
          {/* <NewsActi /> */}
        </>
      }
    />
    <Route path="/allnews" element={<Allnews />} />
    <Route path="/MemberUser" element={<MemberUser />} />
    <Route path="/UserCalendar" element={<UserCalendar />} />
    <Route path="/qrcode" element={<Qrcode />} />
    <Route path="/MeetingUser" element={<MeetingUser />} />
  </Routes>
);

export default UserRoutes;
