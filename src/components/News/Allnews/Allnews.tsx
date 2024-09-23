import { useState } from 'react';

const Allnews = () => {
  const fixedNewsData = [
    {
      title: 'ข่าว',
      date: '15/02/2024',
      description: '...',
      imageUrl: 'https://via.placeholder.com/800x400',
      category: 'ข่าวสาร - /////',
    },
    ...Array(18).fill({
      title: 'ข่าว',
      date: '15/02/2024',
      description: '...',
      imageUrl: 'https://via.placeholder.com/800x400',
      category: 'ข่าวสาร - /////',
    }),
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = fixedNewsData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(fixedNewsData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      
      {/* ส่วนหัวข้อหลัก */}
      <div className="bg-[#996600] py-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">ข่าวสารทั้งหมด</h1>
      </div>

      {/* ปุ่มหัวข้อข่าวย่อย */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <button className="bg-[#996600] shadow-md p-4 text-center text-lg font-semibold text-white rounded-lg hover:bg-[#7a5300] transition-all hover:shadow-lg">
            ข่าวทั่วไป
          </button>
          <button className="bg-[#996600] shadow-md p-4 text-center text-lg font-semibold text-white rounded-lg hover:bg-[#7a5300] transition-all hover:shadow-lg">
            ข่าวกิจกรรมของคณะ
          </button>
          <button className="bg-[#996600] shadow-md p-4 text-center text-lg font-semibold text-white rounded-lg hover:bg-[#7a5300] transition-all hover:shadow-lg">
            ข่าวการศึกษา
          </button>
        </div>
      </div>


      {/* แสดงบล็อกข่าวที่แบ่งหน้า */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {currentNews.map((newsItem, index) => (
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

      {/* ควบคุมการแบ่งหน้าแบบวงกลม */}
      <div className="flex justify-center items-center space-x-4">
        <button
          className={`w-10 h-10 rounded-full bg-[#996600] text-white flex items-center justify-center ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {/* ปุ่มเลขหน้าแบบวงกลม */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-full border border-[#996600] flex items-center justify-center ${currentPage === index + 1 ? 'bg-[#996600] text-white' : 'text-[#996600]'}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className={`w-10 h-10 rounded-full bg-[#996600] text-white flex items-center justify-center ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Allnews;
