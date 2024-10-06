import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // นำเข้าจาก react-modal

interface News {
  _id?: string;
  image: string;
  category: string;
  name: string;
  date: string;
  description: string;
}

const Allnews = () => {
  const [newsData, setNewsData] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState<News | null>(null); // เก็บข่าวที่เลือกเพื่อแสดงใน popup
  const [isModalOpen, setIsModalOpen] = useState(false); // จัดการเปิด-ปิด modal
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // เก็บหมวดหมู่ที่เลือก

  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // กรองข่าวตามหมวดหมู่ที่เลือก
  const filteredNews = selectedCategory
    ? newsData.filter((newsItem) => newsItem.category === selectedCategory)
    : newsData; // แสดงข่าวทั้งหมดถ้าไม่ได้เลือกหมวดหมู่

  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/news');
        setNewsData(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

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

  const openModal = (newsItem: News) => {
    setSelectedNews(newsItem); // ตั้งข่าวที่ถูกเลือก
    setIsModalOpen(true); // เปิด modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // ปิด modal
    setSelectedNews(null); // ล้างข่าวที่ถูกเลือก
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category); // ตั้งหมวดหมู่ที่เลือก
    setCurrentPage(1); // ตั้งค่าหน้าเป็นหน้าแรกเมื่อเปลี่ยนหมวดหมู่
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
          <button
            className={`${
              selectedCategory === null ? 'bg-[#7a5300]' : 'bg-[#996600]'
            } shadow-md p-4 text-center text-lg font-semibold text-white rounded-lg hover:bg-[#7a5300] transition-all hover:shadow-lg`}
            onClick={() => handleCategoryChange(null)} // เมื่อคลิกจะแสดงข่าวทั้งหมด
          >
            ข่าวทั้งหมด
          </button>
          <button
            className={`${
              selectedCategory === 'ข่าวทั่วไป' ? 'bg-[#7a5300]' : 'bg-[#996600]'
            } shadow-md p-4 text-center text-lg font-semibold text-white rounded-lg hover:bg-[#7a5300] transition-all hover:shadow-lg`}
            onClick={() => handleCategoryChange('ข่าวทั่วไป')} // เมื่อคลิกจะกรองข่าวทั่วไป
          >
            ข่าวทั่วไป
          </button>
          <button
            className={`${
              selectedCategory === 'ข่าวกิจกรรมของคณะ' ? 'bg-[#7a5300]' : 'bg-[#996600]'
            } shadow-md p-4 text-center text-lg font-semibold text-white rounded-lg hover:bg-[#7a5300] transition-all hover:shadow-lg`}
            onClick={() => handleCategoryChange('ข่าวกิจกรรม')} // เมื่อคลิกจะกรองข่าวกิจกรรมของคณะ
          >
            ข่าวกิจกรรมของคณะ
          </button>
          <button
            className={`${
              selectedCategory === 'ข่าวการศึกษา' ? 'bg-[#7a5300]' : 'bg-[#996600]'
            } shadow-md p-4 text-center text-lg font-semibold text-white rounded-lg hover:bg-[#7a5300] transition-all hover:shadow-lg`}
            onClick={() => handleCategoryChange('ข่าวการศึกษา')} // เมื่อคลิกจะกรองข่าวการศึกษา
          >
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
            onClick={() => openModal(newsItem)} // เมื่อคลิกให้เปิด modal
          >
            <img
              src={newsItem.image}
              alt={newsItem.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <div className="mb-2">
                <span className="text-sm bg-smoIct text-white px-2 py-1 rounded-md">{newsItem.category}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1 text-[#996600]">{newsItem.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{newsItem.date}</p>
              <p className="text-gray-700">
                {newsItem.description.length > 100
                  ? `${newsItem.description.substring(0, 100)}...`
                  : newsItem.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ควบคุมการแบ่งหน้า */}
      <div className="flex justify-center items-center space-x-4">
        <button
          className={`w-10 h-10 rounded-full bg-[#996600] text-white flex items-center justify-center ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
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

      {/* Modal แสดงรายละเอียดข่าว */}
      {selectedNews && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="News Details"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto pt-16">
            {/* ตรวจสอบว่า selectedNews ไม่เป็น null ก่อนแสดงผล */}
            {selectedNews && (
              <>
                <h2 className="text-3xl font-bold text-[#996600] mb-4">{selectedNews.name}</h2>
                <img
                  src={selectedNews.image}
                  alt={selectedNews.name}
                  className="w-full h-[600px] object-cover mb-4"
                />
                <p className="mb-4">
                  <span className="font-semibold">หมวดหมู่:</span> {selectedNews.category}
                </p>
                <p className="mb-4">
                  <span className="font-semibold">วันที่:</span> {selectedNews.date}
                </p>
                <p>{selectedNews.description}</p>
              </>
            )}
            <button
              className="mt-4 bg-[#996600] text-white py-2 px-4 rounded-lg hover:bg-[#7a5300]"
              onClick={closeModal}
            >
              ปิด
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Allnews;
