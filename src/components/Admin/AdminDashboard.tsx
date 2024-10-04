import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import AnnouncementIcon from '@mui/icons-material/Announcement';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        {/* User Status Section */}
        <div className="flex items-center space-x-4 mb-6">
          <AccountCircleIcon className="bg-gray-300 text-gray-700 h-10 w-10 p-1 rounded-full" />
          <div>
            <p className="text-gray-700 font-semibold">Admin</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="space-y-4">
            {/* Dashboard Menu Item */}
            <li
              className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300"
              onClick={() => navigate('/admin/dashboard')}
            >
              <span className="inline-block p-2 bg-[#996600] rounded text-white">
                <DashboardIcon />
              </span>
              <span className="font-semibold">Dashboard</span>
            </li>
            {/* ปฏิทินกิจกรรม Menu Item */}
            <li
              className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300"
              onClick={() => navigate('/admin/AdminCalendar')}
            >
              <span className="inline-block p-2 bg-[#996600] rounded text-white">
                <CalendarTodayIcon />
              </span>
              <span className="font-semibold">ปฏิทินกิจกรรม</span>
            </li>

            {/* การจองห้อง Menu Item */}
            <li
              className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300"
              onClick={() => navigate('/admin/heartAM')}
            >
              <span className="inline-block p-2 bg-[#996600] rounded text-white">
                <MeetingRoomIcon />
              </span>
              <span className="font-semibold">การจองห้อง</span>
            </li>

            {/* สมาชิกกรรมการ Menu Item */}
            <li
              className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300"
              onClick={() => navigate('/admin/Amem')}
            >
              <span className="inline-block p-2 bg-[#996600] rounded text-white">
                <GroupIcon />
              </span>
              <span className="font-semibold">สมาชิกกรรมการ</span>
            </li>

            {/* ข่าวประชาสัมพันธ์นิติสโมสร Menu Item */}
            <li
              className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300"
              onClick={() => navigate('/admin/NewsAM')}
            >
              <span className="inline-block p-2 bg-[#996600] rounded text-white">
                <AnnouncementIcon />
              </span>
              <span className="font-semibold">ข่าวประชาสัมพันธ์นิติสโมสร</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-6">Hello Admin, welcome back!</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
