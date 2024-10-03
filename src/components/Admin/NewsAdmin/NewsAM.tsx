import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  styled,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

// กำหนดประเภทของข้อมูล
interface Entry {
  id: number;
  image: string;
  category: string;
  name: string;
  date: string;
  description: string; // เพิ่มฟิลด์สำหรับเนื้อหา
}

// ข้อมูลตัวอย่าง
const initialData: Entry[] = [
  {
    id: 1,
    image: 'https://via.placeholder.com/150',
    category: 'ข่าวทั่วไป',
    name: 'Item 1',
    date: '2024-01-01',
    description: 'Description for Item 1', // เพิ่มเนื้อหาตัวอย่าง
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/150',
    category: 'ข่าวกิจกรรม',
    name: 'Item 2',
    date: '2024-02-01',
    description: 'Description for Item 2', // เพิ่มเนื้อหาตัวอย่าง
  },
];

// สไตล์สำหรับ TableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid #e0e0e0',
  padding: '10px',
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center', // จัดกึ่งกลาง
}));

const CustomTable = () => {
  const [data, setData] = useState<Entry[]>(initialData); // กำหนดประเภทให้ data
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<Entry, 'id'>>({
    image: '',
    category: '',
    name: '',
    date: '',
    description: '', // ฟิลด์เนื้อหา
  }); // ใช้ Omit เพื่อลดประเภทให้ไม่มี id

  const [editEntry, setEditEntry] = useState<Entry | null>(null); // สำหรับการแก้ไข

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = (row: Entry) => {
    setEditEntry(row);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditEntry(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (editEntry) {
      setEditEntry((prev) => ({
        ...prev!,
        [name as string]: value, // แก้ไขการเข้าถึง name
      }));
    } else {
      setNewEntry((prev) => ({
        ...prev,
        [name as string]: value, // แก้ไขการเข้าถึง name
      }));
    }
  };

  // ฟังก์ชันเฉพาะสำหรับ Select
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (editEntry) {
      setEditEntry((prev) => ({
        ...prev!,
        [name]: value,
      }));
    } else {
      setNewEntry((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // ตรวจสอบว่า files มีค่าหรือไม่
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editEntry) {
          setEditEntry((prev) => ({
            ...prev!,
            image: reader.result as string, // เก็บค่า Base64 ของภาพในรูปแบบ string
          }));
        } else {
          setNewEntry((prev) => ({
            ...prev,
            image: reader.result as string, // เก็บค่า Base64 ของภาพในรูปแบบ string
          }));
        }
      };
      reader.readAsDataURL(file); // อ่านไฟล์เป็น Base64
    }
  };

  const handleSubmit = () => {
    const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    setData((prev) => [
      ...prev,
      {
        ...newEntry,
        id: newId,
      },
    ]);
    handleClose();
    setNewEntry({ image: '', category: '', name: '', date: '', description: '' }); // Reset new entry
  };

  const handleEditSubmit = () => {
    if (editEntry) {
      setData((prev) =>
        prev.map((entry) => (entry.id === editEntry.id ? editEntry : entry))
      );
    }
    handleEditClose();
  };

  // ฟังก์ชันสำหรับการลบรายการ
  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((entry) => entry.id !== id)); // ลบรายการที่มี id ตรงกัน
  };

  return (
    <div>
      {/* Header with Create Button */}
      <Box sx={{ maxWidth: '1600px', margin: '0 auto' }}>
        <AppBar position="static" style={{ backgroundColor: '#1976d2' }}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Data Management
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
              Create New
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Table Container */}
      <TableContainer component={Paper} elevation={3} style={{ marginTop: '20px', maxWidth: '1600px', marginLeft: 'auto', marginRight: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>No.</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* จัดกลางรูปภาพ */}
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id={`image-upload-${row.id}`}
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor={`image-upload-${row.id}`}>
                    <img
                      src={row.image}
                      alt={row.name}
                      style={{ width: '150px', height: '150px', borderRadius: '4px', cursor: 'pointer' }} // ปรับขนาดเป็น 150x150
                    />
                  </label>
                </StyledTableCell>
                <StyledTableCell>{row.category}</StyledTableCell>
                <StyledTableCell>{row.name}</StyledTableCell>
                <StyledTableCell>{row.date}</StyledTableCell>
                <StyledTableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleEditOpen(row)}>
                    Edit
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(row.id)}> {/* เพิ่มการลบ */}
                    Delete
                  </Button>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for New Entry */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Create New Entry</DialogTitle>
        <DialogContent>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="new-image-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="new-image-upload">
            <Button variant="outlined" component="span">
              Upload Image
            </Button>
          </label>
          <img
            src={newEntry.image}
            alt="Preview"
            style={{ width: '150px', height: '150px', borderRadius: '4px', display: newEntry.image ? 'block' : 'none' }} // แสดงตัวอย่างภาพ
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newEntry.category}
              onChange={handleSelectChange}
            >
              <MenuItem value="ข่าวทั่วไป">ข่าวทั่วไป</MenuItem>
              <MenuItem value="ข่าวกิจกรรม">ข่าวกิจกรรม</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="name"
            label="Name"
            fullWidth
            margin="normal"
            value={newEntry.name}
            onChange={handleChange}
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            value={newEntry.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            name="description" // เพิ่มฟิลด์สำหรับเนื้อหา
            label="Description"
            fullWidth
            margin="normal"
            value={newEntry.description} // เพิ่มการใช้งานเนื้อหา
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Edit Entry */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="lg" fullWidth>
        <DialogTitle>Edit Entry</DialogTitle>
        <DialogContent>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id={`edit-image-upload`}
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor={`edit-image-upload`}>
            <Button variant="outlined" component="span">
              Upload Image
            </Button>
          </label>
          <img
            src={editEntry?.image}
            alt="Preview"
            style={{ width: '150px', height: '150px', borderRadius: '4px', display: editEntry?.image ? 'block' : 'none' }} // แสดงตัวอย่างภาพ
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={editEntry?.category}
              onChange={handleSelectChange}
            >
              <MenuItem value="ข่าวทั่วไป">ข่าวทั่วไป</MenuItem>
              <MenuItem value="ข่าวกิจกรรม">ข่าวกิจกรรม</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="name"
            label="Name"
            fullWidth
            margin="normal"
            value={editEntry?.name}
            onChange={handleChange}
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            value={editEntry?.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            name="description" // เพิ่มฟิลด์สำหรับเนื้อหา
            label="Description"
            fullWidth
            margin="normal"
            value={editEntry?.description} // เพิ่มการใช้งานเนื้อหา
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomTable;
