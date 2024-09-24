import { useParams } from 'react-router-dom';

interface NewsItem {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  category: string;
  detailImage: string;
}

interface NewsDetailProps {
  newsData: NewsItem[];
}

const NewsDetail: React.FC<NewsDetailProps> = ({ newsData }) => {
  const { id } = useParams<{ id: string }>(); 
  const newsIndex = id ? parseInt(id, 10) : -1;

  if (isNaN(newsIndex) || newsIndex < 0 || newsIndex >= newsData.length) {
    return <p>ไม่พบข่าวนี้</p>;
  }

  const newsItem = newsData[newsIndex];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{newsItem.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{newsItem.date}</p>
      <div className="mb-4">
        <img
          src={newsItem.detailImage || newsItem.imageUrl}
          alt={newsItem.title}
          className="w-full h-auto object-cover mb-4"
        />
        <p className="text-lg">{newsItem.description}</p>
      </div>
    </div>
  );
};

export default NewsDetail;
