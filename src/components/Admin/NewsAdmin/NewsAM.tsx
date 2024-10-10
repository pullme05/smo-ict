import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Typography, Box, Paper, MenuItem, IconButton, Dialog, DialogContent, DialogTitle, Button, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface News {
  _id?: string;
  image: string;
  category: string;
  name: string;
  date: string;
  description: string;
}

const NewsAM: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [formData, setFormData] = useState<News>({
    image: '',
    category: '',
    name: '',
    date: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<News | null>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [chartDialogOpen, setChartDialogOpen] = useState(false); // Popup สำหรับกราฟ

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/news');
      setNewsList(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingId) {
        await axios.put(`http://localhost:8000/api/news/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:8000/api/news', formData);
      }
      setFormData({ image: '', category: '', name: '', date: '', description: '' });
      setIsEditing(false);
      setEditingId(null);
      fetchNews();
      setPreview(null);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handlePreview = () => {
    setPreview(formData);
  };

  const handleClosePreview = () => {
    setPreview(null);
  };

  const handleEdit = (news: News) => {
    setFormData(news);
    setIsEditing(true);
    setEditingId(news._id || null);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/news/${id}`);
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleViewFullNews = (news: News) => {
    setSelectedNews(news);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNews(null);
  };

  // ฟังก์ชันสำหรับสร้างข้อมูลกราฟ
  const summarizeNewsByCategory = (newsList: News[]) => {
    const summary = newsList.reduce((acc, news) => {
      acc[news.category] = (acc[news.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(summary).map(category => ({
      category,
      count: summary[category],
    }));
  };

  // ข้อมูลสำหรับกราฟ
  const dataForChart = summarizeNewsByCategory(newsList);

  // ข้อมูลกราฟจำนวนข่าวทั้งหมด
  const totalNewsData = [
    { name: 'Total News', count: newsList.length },
  ];

  return (
    <Box className="p-5 max-w-6xl mx-auto">
      <Paper className="p-5 mb-5">
        <Typography variant="h4" gutterBottom>
          ข่าวประชาสัมพันธ์นิสิตสโมสร Admin
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <input
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
            className="block mb-5"
          />
          {formData.image && <img src={formData.image} alt="Uploaded Preview" className="max-w-full mb-5" />}

          <TextField
            label="หมวดหมู่"
            name="category"
            fullWidth
            select
            margin="normal"
            value={formData.category}
            onChange={handleChange}
          >
            <MenuItem value="ข่าวทั่วไป">ข่าวทั่วไป</MenuItem>
            <MenuItem value="ข่าวกิจกรรม">ข่าวกิจกรรม</MenuItem>
            <MenuItem value="ข่าวการศึกษา">ข่าวการศึกษา</MenuItem>
          </TextField>

          <TextField
            label="หัวข้อ"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="วันที่"
            name="date"
            type="date"
            fullWidth
            margin="normal"
            value={formData.date}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="flex gap-3 mt-5">
            <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600">
              {isEditing ? 'Update News' : 'Create News'}
            </button>
            <button type="button" onClick={handlePreview} className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600">
              Preview
            </button>
            {/* ปุ่มสำหรับสรุปข้อมูล */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setChartDialogOpen(true)} // เปิด popup dialog สำหรับกราฟ
      >
        ดู สรุปยอดข่าว
      </Button>
          </div>
        </form>
      </Paper>

      {/* Preview Section */}
      {preview && (
        <Paper className="p-5 mb-5 relative">
          <IconButton
            onClick={handleClosePreview}
            className="absolute top-2 right-2"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" gutterBottom>
            Preview News
          </Typography>
          <img src={preview.image} alt="Preview" className="max-w-full" />
          <Typography variant="h6">{preview.name}</Typography>
          <Typography>{preview.category}</Typography>
          <Typography>{preview.date}</Typography>
          <Typography>{preview.description.length > 100 ? preview.description.substring(0, 100) + '...' : preview.description}</Typography>
        </Paper>
      )}

      <Typography variant="h5" gutterBottom>
        All News
      </Typography>
      <Box className="grid lg:grid-cols-3 gap-8 mb-8">
        {newsList.map((news) => (
          <div
            key={news._id}
            className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            <img
              src={news.image}
              alt={news.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <div className="mb-2">
                <span className="text-sm bg-smoIct text-white px-2 py-1 rounded-md">{news.category}</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-[#996600]">{news.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{news.date}</p>
              <p className="text-gray-700 mb-4">
                {news.description.length > 50 ? news.description.substring(0, 50) + '...' : news.description}
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleEdit(news)} 
                  className="bg-yellow-500 text-white px-5 py-2 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleViewFullNews(news)} 
                  className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600"
                >
                  View
                </button>
                <button 
                  onClick={() => handleDelete(news._id as string)} 
                  className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </Box>

      {/* Dialog สำหรับแสดงกราฟ */}
      <Dialog open={chartDialogOpen} onClose={() => setChartDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          สรุปยอดข่าว
          <IconButton onClick={() => setChartDialogOpen(false)} className="absolute top-8px right-8px">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* ข่าวทั้งหมด */}
          <Box>
            <Typography variant="subtitle2" style={{ color: '#757575' }} gutterBottom>
              จำนวนข่าวทั้งหมด: <strong>{newsList.length}</strong> ข่าว
            </Typography>
            <Divider /> {/* เส้นแบ่ง */}
          </Box>

          {/* แสดงจำนวนข่าวตามหมวดหมู่ */}
          <Box marginY={3}>
            <Typography variant="subtitle2" style={{ color: '#757575' }} gutterBottom>
              ข่าวแบ่งตามหมวดหมู่:
            </Typography>
            {dataForChart.map((item) => (
              <Typography key={item.category} variant="body2" style={{ marginLeft: '20px', color: '#757575' }}>
                <strong>{item.category}</strong>: {item.count} ข่าว
              </Typography>
            ))}
            <Divider style={{ marginTop: '16px' }} /> {/* เส้นแบ่ง */}
          </Box>

          {/* กราฟแท่งสรุปข่าวตามหมวดหมู่ */}
          <Typography variant="h6" gutterBottom align="center">
            กราฟแสดงจำนวนข่าวตามหมวดหมู่
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataForChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <Divider style={{ marginTop: '20px', marginBottom: '20px' }} /> {/* เส้นแบ่ง */}
          
          {/* กราฟแท่งสรุปจำนวนข่าวทั้งหมด */}
          <Typography variant="h6" gutterBottom align="center">
            กราฟแสดงข่าวทั้งหมด
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={totalNewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </DialogContent>
      </Dialog>

      {/* Dialog สำหรับแสดงข่าวเต็ม */}
      {selectedNews && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{selectedNews.name}</DialogTitle>
          <DialogContent>
            <img
              src={selectedNews.image}
              alt={selectedNews.name}
              className="w-full h-64 object-cover mb-5"
            />
            <Typography variant="h6" gutterBottom>
              {selectedNews.category}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {selectedNews.date}
            </Typography>
            <Typography variant="body2">
              {selectedNews.description}
            </Typography>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit News
          <IconButton
            onClick={() => setEditDialogOpen(false)}
            className="absolute top-2 right-2"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <input
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
              className="block mb-5"
            />
            {formData.image && <img src={formData.image} alt="Uploaded Preview" className="max-w-full mb-5" />}
            <TextField
              label="หมวดหมู่"
              name="category"
              fullWidth
              select
              margin="normal"
              value={formData.category}
              onChange={handleChange}
            >
              <MenuItem value="ข่าวทั่วไป">ข่าวทั่วไป</MenuItem>
              <MenuItem value="ข่าวกิจกรรม">ข่าวกิจกรรม</MenuItem>
              <MenuItem value="ข่าวการศึกษา">ข่าวการศึกษา</MenuItem>
            </TextField>
            <TextField
              label="หัวข้อ"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label="วันที่"
              name="date"
              type="date"
              fullWidth
              margin="normal"
              value={formData.date}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <TextField
              label="Description"
              name="description"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={formData.description}
              onChange={handleChange}
            />
            <div className="flex gap-3 mt-5">
              <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600">
                Update News
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NewsAM;
