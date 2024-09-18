import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import "./RoomSelection.css";

// ฟังก์ชันเพื่อตรวจสอบว่าห้องถูกจองหรือไม่
export function isRoomBooked(roomId, bookings) {
  console.log("Checking if room", roomId, "is booked.");
  return bookings.some(booking => booking.selectedRoom === roomId);
}

const rooms = [
  {
    id: 1,
    name: "Room A",
    image: "https://via.placeholder.com/250?text=Room+A",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Room B",
    image: "https://via.placeholder.com/250?text=Room+B",
    isAvailable: true,
  },
];

function RoomSelection({ bookings }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomStatus, setRoomStatus] = useState({});

  useEffect(() => {
    console.log("Bookings data:", bookings);

    const updatedRoomStatus = {};
    rooms.forEach(room => {
      updatedRoomStatus[room.id] = isRoomBooked(room.id, bookings);
    });
    console.log("Updated room status:", updatedRoomStatus);
    setRoomStatus(updatedRoomStatus);
  }, [bookings]); // Ensure that it only runs when `bookings` changes
  

  const onSelectRoom = (id) => {
    if (!roomStatus[id]) {
      setSelectedRoom(id);
    }
  };

  return (
    <div className="roomSelectionContainer">
      {rooms.length > 0 ? rooms.map((room) => {
        const isBooked = roomStatus[room.id];

        return (
          <div
            key={room.id}
            className={`roomCard ${selectedRoom === room.id ? "selected" : ""}`}
            onClick={() => onSelectRoom(room.id)}
          >
            <img src={room.image} alt={room.name} className="roomImage" />

            <Typography variant="h5" className="roomName">
              {room.name}
            </Typography>

            <Typography
              variant="body1"
              className={`roomStatus ${isBooked ? "occupied" : "available"}`}
            >
              {isBooked ? (
                <>
                  <Cancel color="error" /> ไม่ว่าง
                </>
              ) : (
                <>
                  <CheckCircle color="success" /> ว่าง
                </>
              )}
            </Typography>
          </div>
        );
      }) : (
        <Typography>ไม่พบข้อมูลห้องประชุม</Typography>
      )}
    </div>
  );
}

export default RoomSelection;
