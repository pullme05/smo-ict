

const NewsActi = () => {
  const smallNewsData = [
    {
      title: 'พัฒนาความสำเร็จแห่งอาชีพ',
      date: '12/09/2024',
      description: 'CSC จัดบรรยายพิเศษ ... ',
      imageUrl: 'https://via.placeholder.com/400x200',
      category: 'กิจกรรม',
    },
    {
      title: 'กิจกรรมเชื่อมสัมพันธ์ประจำปี',
      date: '15/02/2024',
      description: 'กิจกรรมสนุกสนาน ... ',
      imageUrl: 'https://via.placeholder.com/400x200',
      category: 'กิจกรรม',
    },
    {
      title: 'นิทรรศการเทคโนโลยี',
      date: '05/03/2024',
      description: 'การจัดแสดงนิทรรศการ ... ',
      imageUrl: 'https://via.placeholder.com/400x200',
      category: 'กิจกรรม',
    },
  ];

  // กรองเฉพาะข่าวที่หมวดหมู่เป็น "กิจกรรม"
  const filteredNews = smallNewsData.filter(newsItem => newsItem.category === 'กิจกรรม').slice(0, 3);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-[#996600]">ข่าวสารกิจกรรม</h2>
        {/* <button className="text-[#996600] border border-[#996600] hover:bg-[#996600] hover:text-white transition duration-300 px-4 py-2 rounded-md">
          ดูกิจกรรมทั้งหมด
        </button> */}
      </div>

      {/* ส่วนแสดงข่าวเล็กที่เกี่ยวกับกิจกรรม */}
      <div className="grid lg:grid-cols-3 gap-8">
        {filteredNews.map((newsItem, index) => (
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

export default NewsActi;
