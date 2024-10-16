import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [monthlySummary, setMonthlySummary] = useState<Record<string, number>>({});
  const [newsSummary, setNewsSummary] = useState<{ category: string; count: number }[]>([]);
  const [totalNews, setTotalNews] = useState<number>(0);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  

  useEffect(() => {
    fetchMonthlySummary();
    fetchNewsSummary();
    fetchAllBookings();
  }, []);

  const fetchMonthlySummary = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/events');
      const events = response.data;
      const summary = calculateMonthlySummary(events);
      setMonthlySummary(summary);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchNewsSummary = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/news');
      const news = response.data;
      const summary = calculateNewsSummary(news);
      setNewsSummary(summary.categories);
      setTotalNews(summary.total);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/bookings');
      if (response.status === 200) {
        setPendingBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง');
    }
  };

  const totalBookings = pendingBookings.length;
  const room1Bookings = pendingBookings.filter((booking) => booking.room === 'ห้อง 1').length;
  const room2Bookings = pendingBookings.filter((booking) => booking.room === 'ห้อง 2').length;
  const room3Bookings = pendingBookings.filter((booking) => booking.room === 'ห้อง 3').length;
  const approvedBookings = pendingBookings.filter((booking) => booking.status === 'อนุมัติแล้ว').length;
  const rejectedBookings = pendingBookings.filter((booking) => booking.status === 'ถูกปฏิเสธ').length;

  const data = {
    labels: ['ห้องทั้งหมด', 'ห้อง 1', 'ห้อง 2', 'ห้อง 3', 'อนุมัติแล้ว', 'ถูกปฏิเสธ'],
    datasets: [
      {
        label: 'จำนวนการจองห้องทั้งหมด',
        data: [totalBookings, room1Bookings, room2Bookings, room3Bookings, approvedBookings, rejectedBookings],
        backgroundColor: ['#996600', '#8d38c9', '#c4996c', '#FFCC33', '#33CC33', '#FF3333'],
      },
    ],
  };

  const calculateMonthlySummary = (events: any[]) => {
    return events.reduce((acc: Record<string, number>, event) => {
      const month = new Date(event.start).toLocaleString('th-TH', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += 1;
      return acc;
    }, {});
  };

  const calculateNewsSummary = (news: any[]) => {
    const categories = news.reduce((acc: Record<string, number>, item) => {
      const category = item.category || 'อื่นๆ';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += 1;
      return acc;
    }, {});

    const summary = Object.keys(categories).map((category) => ({
      category,
      count: categories[category],
    }));

    return {
      categories: summary,
      total: news.length,
    };
  };

  // Function to format monthly summary chart data
  const getChartDataForMonth = () => {
    const labels = Object.keys(monthlySummary);
    const data = Object.values(monthlySummary);

    return {
      labels,
      datasets: [
        {
          label: 'จำนวนกิจกรรม',
          data,
          backgroundColor: labels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)),
        },
      ],
    };
  };

  const getNewsChartData = () => {
    const labels = [...newsSummary.map((item) => item.category), 'ข่าวทั้งหมด'];
    const data = [...newsSummary.map((item) => item.count), totalNews];
  
    // กำหนดสีให้แต่ละหมวดหมู่
    const backgroundColor = labels.map((category) => {
      switch (category) {
        case 'ข่าวทั่วไป':
          return '#996600';  // สีฟ้า
        case 'ข่าวการศึกษา':
          return '#996600';  // สีเขียว
        case 'ข่าวกิจกรรม':
          return '#996600';  // สีแดง
        case 'ข่าวทั้งหมด':
          return '#9b59b6';  // สีม่วง (สำหรับข่าวทั้งหมด)
        default:
          return '#95a5a6';  // สีเทา สำหรับหมวดหมู่อื่นๆ
      }
    });
  
    return {
      labels,
      datasets: [
        {
          label: 'จำนวนข่าว',
          data,
          backgroundColor, // ใช้ตัวแปร backgroundColor ที่กำหนดไว้
        },
      ],
    };
  };
  

  const options = {
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,  // ทำให้ข้อความในแกน X เป็นแนวนอน
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <AccountCircleIcon className="bg-gray-300 text-gray-700 h-10 w-10 p-1 rounded-full" />
          <div>
            <p className="text-gray-700 font-semibold">Admin</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300" onClick={() => navigate('/admin/AdminCalendar')}>
              <span className="inline-block p-2 bg-[#996600] rounded text-white">
                <CalendarTodayIcon />
              </span>
              <span className="font-semibold">ปฏิทินกิจกรรม</span>
            </li>
            <li className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300" onClick={() => navigate('/admin/heartAM')}>
              <span className="inline-block p-2 bg-[#996600] rounded text-white">
                <MeetingRoomIcon />
              </span>
              <span className="font-semibold">การจองห้อง</span>
            </li>
            <li className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300" onClick={() => navigate('/admin/Amem')}>
              <span className="inline-block p-2 bg-[#996600] rounded text-white">
                <GroupIcon />
              </span>
              <span className="font-semibold">สมาชิกกรรมการ</span>
            </li>
            <li className="flex items-center space-x-3 text-[#996600] hover:bg-gray-200 hover:text-[#663300] p-3 rounded-lg transition-colors duration-300" onClick={() => navigate('/admin/NewsAM')}>
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

          {/* ส่วนของกราฟ สรุปปฎิทินกิจกรรม และ สรุปยอดข่าว ให้อยู่ในแถวเดียวกัน */} 
          <div className="flex space-x-6">
          {/* กราฟสรุปกิจกรรมรายเดือน */} 
          <div className="bg-white shadow-md rounded-lg p-6 w-1/3">
            <h2 className="text-2xl font-bold mb-4">สรุปปฎิทินกิจกรรม</h2>
            <div className="flex flex-col items-center justify-center">
              <Bar data={getChartDataForMonth()} options={options} className="w-full h-36" />
              <div className="mt-4 space-y-3 bg-gray-50 border border-gray-200 shadow-lg rounded-lg p-4 w-full">
                {Object.entries(monthlySummary).map(([month, count]) => (
                  <p key={month} className="text-gray-700 font-semibold">
                    <span className="text-[#996600] font-bold">เดือน {month}:</span> {count} กิจกรรม
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* สรุปยอดข่าว */} 
          <div className="bg-white shadow-md rounded-lg p-6 w-1/3">
            <h2 className="text-2xl font-bold mb-4">สรุปยอดข่าว</h2>
            <div className="flex flex-col items-center justify-center">
              <Bar data={getNewsChartData()} options={options} className="w-full h-36" />
              <div className="mt-4 space-y-3 bg-gray-50 border border-gray-200 shadow-lg rounded-lg p-4 w-full">
                {newsSummary.map((item) => (
                  <p key={item.category} className="text-gray-700 font-semibold">
                    <span className="text-[#996600] font-bold">หมวด {item.category}:</span> {item.count} ข่าว
                  </p>
                ))}
                <p className="text-gray-700 font-semibold">
                  <span className="text-[#996600] font-bold">ข่าวทั้งหมด:</span> {totalNews} ข่าว
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* กราฟสรุปการจองห้องประชุม */} 
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">สรุปการจองห้องประชุม</h2>
          <div className="flex items-center justify-between">
            {/* กราฟ */}
            <div className="w-3/5">
              <Bar data={data} options={options} className="w-full h-64" />
            </div>

            {/* ข้อความ */}
            <div className="w-2/5 ml-6 bg-gray-50 border border-gray-200 shadow-lg rounded-lg p-4">
              <div className="space-y-3">
                <p className="text-gray-700 font-semibold">
                  <span className="text-[#996600] font-bold">จำนวนการจองห้องทั้งหมด:</span> {totalBookings}
                </p>
                <p className="text-gray-700 font-semibold">
                  <span className="text-[#996600] font-bold">ห้อง 1:</span> {room1Bookings} การจอง
                </p>
                <p className="text-gray-700 font-semibold">
                  <span className="text-[#996600] font-bold">ห้อง 2:</span> {room2Bookings} การจอง
                </p>
                <p className="text-gray-700 font-semibold">
                  <span className="text-[#996600] font-bold">ห้อง 3:</span> {room3Bookings} การจอง
                </p>
                <p className="text-gray-700 font-semibold">
                  <span className="text-[#996600] font-bold">อนุมัติแล้ว:</span> {approvedBookings} การจอง
                </p>
                <p className="text-gray-700 font-semibold">
                  <span className="text-[#996600] font-bold">ถูกปฏิเสธ:</span> {rejectedBookings} การจอง
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
