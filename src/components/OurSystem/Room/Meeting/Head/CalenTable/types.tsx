// types.ts
import { Event as BigCalendarEvent } from 'react-big-calendar';

// สร้างประเภท Event ของคุณใหม่
export interface Event extends BigCalendarEvent {
  title: string;
  start: Date;
  end: Date;
  // อาจจะมีฟิลด์เพิ่มเติมตามที่คุณต้องการ
}
