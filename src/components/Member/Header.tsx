import React, { useState, useEffect } from 'react';

interface SavedData {
  id: number;
  name: string;
  date: string;
  data: any;
}

const Header: React.FC<{ onSave: () => any, onLoad: (data: any[]) => void }> = ({ onSave, onLoad }) => {
  const [savedItems, setSavedItems] = useState<SavedData[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const saveDataToLocal = (data: SavedData[]) => {
    localStorage.setItem('savedData', JSON.stringify(data));
  };

  const loadDataFromLocal = (): SavedData[] => {
    const data = localStorage.getItem('savedData');
    return data ? JSON.parse(data) : [];
  };

  const handleSave = () => {
    const savedData = onSave();
    const name = prompt("กรุณาตั้งชื่อการบันทึก:");
    if (name) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
      const newSave = {
        id: Date.now(),
        name: `${name} (${formattedDate})`,
        date: formattedDate,
        data: savedData,
      };
      const updatedSavedItems = [newSave, ...savedItems];
      setSavedItems(updatedSavedItems);
      saveDataToLocal(updatedSavedItems);
      setDropdownOpen(false); // ปิด dropdown หลังจากบันทึก
    }
  };

  const handleItemClick = (item: SavedData) => {
    onLoad(item.data); // ส่งข้อมูลกลับไปยัง MemberList
    setDropdownOpen(false);
  };

  const handleDelete = (id: number) => {
    const updatedSavedItems = savedItems.filter(item => item.id !== id);
    setSavedItems(updatedSavedItems);
    saveDataToLocal(updatedSavedItems); // บันทึกข้อมูลที่ถูกลบลง localStorage
  };

  useEffect(() => {
    const loadedItems = loadDataFromLocal();
    setSavedItems(loadedItems);
  }, []);

  return (
    <div className="bg-gray-200 p-4 rounded-md shadow mb-4 flex items-center relative">
      
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Save & View Items
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg max-h-64 overflow-auto z-10">
            <div className="px-4 py-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white w-full px-4 py-2 rounded hover:bg-blue-600 mb-2"
              >
                Save
              </button>
            </div>
            <ul>
              {savedItems.length > 0 ? (
                savedItems.map(item => (
                  <li
                    key={item.id}
                    className="px-4 py-2 border-b hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                    onClick={() => handleItemClick(item)}
                  >
                    {item.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ป้องกันการเรียก handleItemClick
                        handleDelete(item.id);
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ลบ
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No saved items</li>
              )}
            </ul>
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold text-center flex-grow mx-4">Student Club Committee</h1>
    </div>
  );
};

export default Header;
