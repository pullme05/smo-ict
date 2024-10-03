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
import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS

// Define the type for data
interface Entry {
  id: number;
  image: string;
  category: string;
  name: string;
  date: string;
  description: string; // Added field for description
}

// Sample data
const initialData: Entry[] = [
  {
    id: 1,
    image: 'https://via.placeholder.com/150',
    category: 'ข่าวทั่วไป',
    name: 'Item 1',
    date: '2024-01-01',
    description: 'Description for Item 1',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/150',
    category: 'ข่าวกิจกรรม',
    name: 'Item 2',
    date: '2024-02-01',
    description: 'Description for Item 2',
  },
];

// Style for TableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid #e0e0e0',
  padding: '10px',
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center', // Center align
}));

const CustomTable = () => {
  const [data, setData] = useState<Entry[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<Entry, 'id'>>({
    image: '',
    category: '',
    name: '',
    date: '',
    description: '', // Content field
  });

  const [editEntry, setEditEntry] = useState<Entry | null>(null);

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
        [name as string]: value,
      }));
    } else {
      setNewEntry((prev) => ({
        ...prev,
        [name as string]: value,
      }));
    }
  };

  // Function specific for Select
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
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editEntry) {
          setEditEntry((prev) => ({
            ...prev!,
            image: reader.result as string,
          }));
        } else {
          setNewEntry((prev) => ({
            ...prev,
            image: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (value: string) => {
    if (editEntry) {
      setEditEntry((prev) => ({
        ...prev!,
        description: value,
      }));
    } else {
      setNewEntry((prev) => ({
        ...prev,
        description: value,
      }));
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
    setNewEntry({ image: '', category: '', name: '', date: '', description: '' });
  };

  const handleEditSubmit = () => {
    if (editEntry) {
      setData((prev) =>
        prev.map((entry) => (entry.id === editEntry.id ? editEntry : entry))
      );
    }
    handleEditClose();
  };

  // Function to delete an entry
  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((entry) => entry.id !== id));
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
      <TableContainer
        component={Paper}
        elevation={3}
        style={{ marginTop: '20px', maxWidth: '1600px', marginLeft: 'auto', marginRight: 'auto' }}
      >
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
                <StyledTableCell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {/* Center image */}
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
                      style={{ width: '150px', height: '150px', borderRadius: '4px', cursor: 'pointer' }} // Adjust size to 150x150
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
                  <Button variant="outlined" color="error" onClick={() => handleDelete(row.id)}>
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
            id="image-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <Button variant="outlined" component="span">
              Upload Image
            </Button>
          </label>
          <img
            src={newEntry.image}
            alt="Preview"
            style={{ width: '60%', height: 'auto', marginTop: '10px', marginBottom: '10px' }} // Adjust size to 60%
          />
          <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newEntry.category}
              onChange={handleSelectChange}
              label="Category"
            >
              <MenuItem value="ข่าวทั่วไป">ข่าวทั่วไป</MenuItem>
              <MenuItem value="ข่าวกิจกรรม">ข่าวกิจกรรม</MenuItem>
              <MenuItem value="ข่าวการศึกษา">ข่าวการศึกษา</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="name"
            label="Name"
            value={newEntry.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '10px' }}
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            value={newEntry.date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '10px' }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {/* Description using Quill */}
          <ReactQuill
            value={newEntry.description}
            onChange={handleDescriptionChange}
            style={{ marginBottom: '10px' }}
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
            id="image-upload-edit"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload-edit">
            <Button variant="outlined" component="span">
              Upload Image
            </Button>
          </label>
          {editEntry?.image && (
            <img
              src={editEntry.image}
              alt="Preview"
              style={{ width: '60%', height: 'auto', marginTop: '10px', marginBottom: '10px' }}
            />
          )}
          <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={editEntry?.category || ''}
              onChange={handleSelectChange}
              label="Category"
            >
              <MenuItem value="ข่าวทั่วไป">ข่าวทั่วไป</MenuItem>
              <MenuItem value="ข่าวกิจกรรม">ข่าวกิจกรรม</MenuItem>
              <MenuItem value="ข่าวการศึกษา">ข่าวการศึกษา</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="name"
            label="Name"
            value={editEntry?.name || ''}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '10px' }}
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            value={editEntry?.date || ''}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '10px' }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {/* Description using Quill */}
          <ReactQuill
            value={editEntry?.description || ''}
            onChange={handleDescriptionChange}
            style={{ marginBottom: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomTable;
