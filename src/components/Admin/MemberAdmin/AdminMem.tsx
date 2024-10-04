import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

// สร้าง interface สำหรับ CustomDescendant
interface CustomText {
  text: string; // เพิ่ม text ที่นี่
}

interface CustomDescendant {
  type: 'paragraph' | 'heading'; // กำหนดประเภทที่ต้องการ
  children: CustomText[]; // เปลี่ยนให้ children เป็น CustomText[]
}

// สร้าง interface สำหรับ entry
interface Entry {
  id: number;
  image: string;
  position: string;
  name: string;
  date: string;
  description: string;
}

// ข้อมูลเริ่มต้น
const initialData: Entry[] = [
  {
    id: 1,
    image: 'https://via.placeholder.com/150',
    position: '1',
    name: 'Item 1',
    date: '2024-01-01',
    description: 'Description for Item 1',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/150',
    position: '2',
    name: 'Item 2',
    date: '2024-02-01',
    description: 'Description for Item 2',
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid #e0e0e0',
  padding: '10px',
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
}));

const CustomTable = () => {
  const [data, setData] = useState<Entry[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<Entry, 'id'>>({
    image: '',
    position: '',
    name: '',
    date: '',
    description: '',
  });
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const editor = useMemo(() => withReact(createEditor()), []);

  // ใช้ CustomDescendant แทน Descendant
  const [editorValue, setEditorValue] = useState<CustomDescendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditorValue([{ type: 'paragraph', children: [{ text: '' }] }]); // reset editor
  };

  const handleEditOpen = (row: Entry) => {
    setEditEntry(row);
    setEditorValue([{ type: 'paragraph', children: [{ text: row.description }] }]);
    setEditOpen(true); // เปิด Dialog แก้ไข
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

  const handleSubmit = () => {
    const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    setData((prev) => [
      ...prev,
      {
        ...newEntry,
        id: newId,
        description: editorValue.map((block) => block.children[0].text).join(' '),
      },
    ]);
    handleClose();
    setNewEntry({ image: '', position: '', name: '', date: '', description: '' });
  };

  const handleEditSubmit = () => {
    if (editEntry) {
      setData((prev) =>
        prev.map((entry) =>
          entry.id === editEntry.id
            ? { ...editEntry, description: editorValue.map((block) => block.children[0].text).join(' ') }
            : entry
        )
      );
    }
    handleEditClose();
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <div>
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
              <StyledTableCell>Position</StyledTableCell>
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
                      style={{ width: '150px', height: '150px', borderRadius: '4px', cursor: 'pointer' }}
                    />
                  </label>
                </StyledTableCell>
                <StyledTableCell>{row.position}</StyledTableCell>
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

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Create New Entry</DialogTitle>
        <DialogContent>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id={`image-upload-new`}
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor={`image-upload-new`}>
            <Button variant="outlined" component="span">
              Upload Image
            </Button>
          </label>
          <img
            src={newEntry.image}
            alt="Preview"
            style={{
              width: '60%',
              height: 'auto',
              borderRadius: '4px',
              marginTop: '10px',
            }}
          />
          <TextField
            name="position"
            label="Position"
            value={newEntry.position}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="name"
            label="Name"
            value={newEntry.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            value={newEntry.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              padding: '10px',
              marginTop: '10px',
            }}
          >
            <Slate
              editor={editor}
              initialValue={editorValue} // เปลี่ยนจาก value เป็น initialValue
              onChange={(value) => {
                // เปลี่ยน Descendant[] เป็น CustomDescendant[]
                setEditorValue(value as CustomDescendant[]);
              }}
            >
              <Editable placeholder="Write your description here..." />
            </Slate>
          </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="lg" fullWidth>
        <DialogTitle>Edit Entry</DialogTitle>
        <DialogContent>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id={`image-upload-edit-${editEntry?.id}`}
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor={`image-upload-edit-${editEntry?.id}`}>
            <Button variant="outlined" component="span">
              Upload Image
            </Button>
          </label>
          {editEntry && (
            <>
              <img
                src={editEntry.image}
                alt="Preview"
                style={{
                  width: '60%',
                  height: 'auto',
                  borderRadius: '4px',
                  marginTop: '10px',
                }}
              />
              <TextField
                name="position"
                label="Position"
                value={editEntry.position}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="name"
                label="Name"
                value={editEntry.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="date"
                label="Date"
                type="date"
                value={editEntry.date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '10px',
                  marginTop: '10px',
                }}
              >
                <Slate
                  editor={editor}
                  initialValue={editorValue} // ใช้ initialValue แทน value
                  onChange={(value) => {
                    // ตั้งค่า editorValue ให้เป็น CustomDescendant[]
                    setEditorValue(value as CustomDescendant[]);
                  }}
                >
                  <Editable placeholder="Write your description here..." />
                </Slate>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomTable;
