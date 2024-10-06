import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Typography, Box, Paper, MenuItem, IconButton, Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
  const [editDialogOpen, setEditDialogOpen] = useState(false); // Add state for edit dialog

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
      setEditDialogOpen(false); // Close the edit dialog after submission
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
    setEditDialogOpen(true); // Open the edit dialog
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

  return (
    <Box className="p-5 max-w-6xl mx-auto">
      <Paper className="p-5 mb-5">
        <Typography variant="h4" gutterBottom>
          ข่าวประชาสัมพันธ์นิติสโมสร Admin
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
                  View Full
                </button>
                <button 
                  onClick={() => handleDelete(news._id!)} 
                  className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogContent dividers>
        {selectedNews && (
          <>
            <Typography variant="h4" gutterBottom>
              {selectedNews.name}
            </Typography>
            <img src={selectedNews.image} alt={selectedNews.name} className="w-full h-96 object-cover mb-5" />
            <Typography variant="h6" gutterBottom>
              {selectedNews.category}
            </Typography>
            <Typography gutterBottom>{selectedNews.date}</Typography>
            <Typography className="whitespace-pre-line break-words max-w-full">
              {selectedNews.description}
            </Typography>
          </>
        )}
        </DialogContent>
    </Dialog>

      
      {/* Edit News Dialog */}
<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
  <DialogTitle>
    {isEditing ? 'Edit News' : 'Create News'}
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
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? 'Update News' : 'Create News'}
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={() => {
            setFormData({ image: '', category: '', name: '', date: '', description: '' }); // Reset form data
            setIsEditing(false);
            setEditDialogOpen(false); // Close the dialog
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

    </Box>
  );
};

export default NewsAM;
