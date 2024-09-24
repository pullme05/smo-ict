import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ไม่ต้องเช็ค isAdmin ในนี้ เพราะเช็คใน AdminRoutes แล้ว

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
            <li className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300">
              <span className="inline-block p-2 bg-[#996600] rounded text-white">
                <DashboardIcon />
              </span>
              <span className="font-semibold">Dashboard</span>
            </li>

            {/* สรุป (Summary) Menu Item */}
            <li className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300">
              <span className="inline-block p-2 bg-[#996600] rounded text-white">
                <SummarizeIcon />
              </span>
              <span className="font-semibold">สรุป</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-6">Hello Admin, welcome back!</p>

        {/* Section for Admin Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold">ปฏิทินกิจกรรม</h2>
          <button
              className="mt-4 px-4 py-2 bg-[#996600] text-white rounded transition-transform duration-300 hover:scale-105"
              onClick={() => navigate('/admin/AdminCalendar')}
            >
              กดปุ่ม
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold">การจองห้อง</h2>
            <button
              className="mt-4 px-4 py-2 bg-[#996600] text-white rounded transition-transform duration-300 hover:scale-105"
              onClick={() => navigate('/admin/heart')}
            >
              กดปุ่ม
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold">สมาชิกของนิสิตสโมสร</h2>
            <button
              className="mt-4 px-4 py-2 bg-[#996600] text-white rounded transition-transform duration-300 hover:scale-105"
            >
              กดปุ่ม
            </button>
          </div>
        </div>

        {/* ข่าวประชาสัมพันธ์นิติสโมสร */}
        <div className="bg-white mt-8 p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 w-full">
          <h2 className="text-2xl font-semibold mb-4">ข่าวประชาสัมพันธ์นิติสโมสร</h2>
          <button
              className="mt-4 px-4 py-2 bg-[#996600] text-white rounded transition-transform duration-300 hover:scale-105"
              onClick={() => navigate('/admin/news')}
            >
              กดปุ่ม
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
