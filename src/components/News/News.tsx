import { Link } from 'react-router-dom'; // เพิ่มการนำเข้า Link จาก react-router-dom

const News = () => {
    const newsData = [
      {
        title: 'เว็บใหม่ นิสิตสโมสรคณะเทคโนโลยีสารสนเทศ',
        date: '01/01/2024',
        description: 'คณะเทคโนโลยีสารสนเทศ ... ',
        imageUrl: 'https://via.placeholder.com/800x400',
        category: 'ข่าว - /////',
      },
      {
        title: 'กิจกรรมเชื่อมสัมพันธ์ประจำปี',
        date: '15/02/2024',
        description: 'กิจกรรมสนุกสนาน ... ',
        imageUrl: 'https://via.placeholder.com/800x400',
        category: 'กิจกรรม - /////',
      },
      {
        title: '////////',
        date: '05/03/2024',
        description: '//////// ... ',
        imageUrl: 'https://via.placeholder.com/800x400',
        category: ' - /////',
      },
    ];
  
    const smallNewsData = [
      {
        title: 'บันทึกความสำเร็จใหม่',
        date: '12/09/2024',
        description: ' ... ',
        imageUrl: 'https://via.placeholder.com/400x200',
        category: 'ข่าวสาร ',
      },
      {
        title: 'ต้อนรับผู้บริหาร',
        date: '12/09/2024',
        description: 'คณะบริหารธุรกิจ . ... ',
        imageUrl: 'https://via.placeholder.com/400x200',
        category: 'ข่าวสาร ',
      },
      {
        title: 'พัฒนาความสำเร็จแห่งอาชีพ',
        date: '12/09/2024',
        description: ' จัดบรรยายพิเศษ ... ',
        imageUrl: 'https://via.placeholder.com/400x200',
        category: ' ข่าวสาร ',
      },
    ];
  
    return (
      <div id="ข่าวสาร" className="max-w-screen-xl mx-auto px-4 py-8">
        {/* หัวข้อใหญ่ */}
        <div className="flex justify-between items-center mb-6">
          <h2  className="text-4xl font-bold text-[#996600]">ข่าวประชาสัมพันธ์ของนิสิตสโมสรคณะเทคโนโลยีสารสนเทศ</h2>
          <Link to="/allnews"> {/* ใช้ Link เพื่อเชื่อมโยงไปยังหน้า Allnews */}
            <button className="text-[#996600] border border-[#996600] hover:bg-[#996600] hover:text-white transition duration-300 px-4 py-2 rounded-md">
              ข่าวสารทั้งหมด
            </button>
          </Link>
        </div>
  
        {/* ส่วนแสดงข่าวหลัก */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {newsData.map((newsItem, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <img
                src={newsItem.imageUrl}
                alt={newsItem.title}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <div className="mb-4">
                  <span className="text-sm bg-smoIct text-white px-2 py-1 rounded-md">{newsItem.category}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-[#996600]">{newsItem.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{newsItem.date}</p>
                <p className="text-gray-700 mb-4">{newsItem.description}</p>
                <Link to="/allnews">
                  <button className="text-blue-500 hover:text-blue-700 font-semibold">อ่านข่าวทั้งหมด</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
  
        {/* ส่วนแสดงข่าวเล็ก */}
        <div className="grid lg:grid-cols-3 gap-8">
          {smallNewsData.map((newsItem, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <img
                src={newsItem.imageUrl}
                alt={newsItem.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-sm bg-smoIct text-white px-2 py-1 rounded-md">{newsItem.category}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1 text-[#996600]">{newsItem.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{newsItem.date}</p>
                <p className="text-gray-700">{newsItem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default News;
