import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal'; // Import react-modal

interface News {
  _id?: string;
  image: string;
  category: string;
  name: string;
  date: string;
  description: string;
}

// Set up react-modal's root element for accessibility
Modal.setAppElement('#root');

const News: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [selectedNews, setSelectedNews] = useState<News | null>(null); // State to track selected news for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal open/close

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/news');
        setNewsList(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  const openModal = (news: News) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  return (
    <div id="ข่าวสาร" className="max-w-screen-xl mx-auto px-4 py-8">
      {/* หัวข้อใหญ่ */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-[#996600]">
          ข่าวประชาสัมพันธ์ของนิสิตสโมสรคณะเทคโนโลยีสารสนเทศ
        </h2>
        <Link to="/allnews">
          <button className="text-[#996600] border border-[#996600] hover:bg-[#996600] hover:text-white transition duration-300 px-4 py-2 rounded-md">
            ข่าวสารทั้งหมด
          </button>
        </Link>
      </div>

      {/* ส่วนแสดงข่าวหลัก */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {newsList.map((newsItem, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() => openModal(newsItem)} // Open modal on click
          >
            <img
              src={newsItem.image}
              alt={newsItem.name}
              className="w-full h-80 object-cover"
            />
            <div className="p-4">
              <div className="mb-4">
                <span className="text-sm bg-smoIct text-white px-2 py-1 rounded-md">{newsItem.category}</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-[#996600]">{newsItem.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{newsItem.date}</p>
              <p className="text-gray-700 mb-4">
                {newsItem.description.length > 100
                  ? newsItem.description.substring(0, 100) + '...'
                  : newsItem.description}
              </p>
              <button className="text-blue-500 hover:text-blue-700 font-semibold">
                อ่านข่าวทั้งหมด
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for detailed news */}
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

export default News;
