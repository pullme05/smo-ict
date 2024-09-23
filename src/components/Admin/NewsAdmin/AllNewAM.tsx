import { useState } from 'react';

interface NewsItem {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  category: string;
}

const AllnewAM = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([
    {
      title: 'ข่าว',
      date: '15/02/2024',
      description: 'รายละเอียดของข่าว',
      imageUrl: 'https://via.placeholder.com/800x400',
      category: 'ข่าวสาร - /////',
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [newNews, setNewNews] = useState<NewsItem>({
    title: '',
    date: '',
    description: '',
    imageUrl: '',
    category: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = newsData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(newsData.length / itemsPerPage);

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

  const handleAddNews = () => {
    // ถ้าไม่มีการอัปโหลดรูปภาพ ใช้รูป placeholder แทน
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : 'https://via.placeholder.com/800x400'; 
    
    // เจนวันที่อัตโนมัติ
    const currentDate = new Date().toLocaleDateString();
  
    if (isEditing && editIndex !== null) {
      // กรณีแก้ไขข่าว
      const updatedNews = [...newsData];
      updatedNews[editIndex] = { ...newNews, imageUrl, date: currentDate };
      setNewsData(updatedNews);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // กรณีเพิ่มข่าวใหม่
      setNewsData([...newsData, { ...newNews, imageUrl, date: currentDate }]);
    }
  
    // รีเซ็ตฟอร์มและสถานะการอัปโหลดรูป
    setNewNews({
      title: '',
      date: '',
      description: '',
      imageUrl: '',
      category: '',
    });
    
    setImageFile(null); // รีเซ็ตไฟล์รูปภาพ
  };

  const handleEditNews = (index: number) => {
    setNewNews(newsData[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteNews = (index: number) => {
    const updatedNews = newsData.filter((_, i) => i !== index);
    setNewsData(updatedNews);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* ส่วนหัวข้อหลัก */}
      <div className="bg-[#996600] py-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">จัดการข่าวสาร</h1>
      </div>

      {/* ฟอร์มสำหรับเพิ่มและแก้ไขข่าว */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'}</h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            type="text"
            placeholder="หัวข้อข่าว"
            className="p-2 border border-gray-300 rounded"
            value={newNews.title}
            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="หมวดหมู่"
            className="p-2 border border-gray-300 rounded"
            value={newNews.category}
            onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
          />
          <textarea
            placeholder="รายละเอียดข่าว"
            className="p-2 border border-gray-300 rounded"
            value={newNews.description}
            onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
          />
          {/* เพิ่ม input สำหรับอัปโหลดรูป */}
          <input
            type="file"
            accept="image/*"
            className="p-2 border border-gray-300 rounded"
            onChange={(e) => {
              if (e.target.files) setImageFile(e.target.files[0]);
            }}
          />
        </div>
        <button
          onClick={handleAddNews}
          className="bg-[#996600] text-white p-2 rounded hover:bg-[#7a5300]"
        >
          {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มข่าว'}
        </button>
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
                <span className="text-sm bg-smoIct text-white px-2 py-1 rounded-md">
                  {newsItem.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1 text-[#996600]">
                {newsItem.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{newsItem.date}</p>
              <p className="text-gray-700">{newsItem.description}</p>
              <button
                onClick={() => handleEditNews(index)}
                className="text-blue-500 mr-2"
              >
                แก้ไข
              </button>
              <button
                onClick={() => handleDeleteNews(index)}
                className="text-red-500"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ควบคุมการแบ่งหน้า */}
      <div className="flex justify-center items-center space-x-4">
        <button
          className={`w-10 h-10 rounded-full bg-[#996600] text-white flex items-center justify-center ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-full border border-[#996600] flex items-center justify-center ${
              currentPage === index + 1 ? 'bg-[#996600] text-white' : 'text-[#996600]'
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className={`w-10 h-10 rounded-full bg-[#996600] text-white flex items-center justify-center ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default AllnewAM;
