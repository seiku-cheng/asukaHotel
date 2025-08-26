'use client';

import { useState, useEffect } from 'react';

interface AvailabilityCalendarProps {
  roomId: string;
}

interface BookedDate {
  date: string;
  status: 'booked';
}

export default function AvailabilityCalendar({ roomId }: AvailabilityCalendarProps) {
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [roomId, currentMonth]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Get start and end dates for current and next month
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2, 0);
      
      const params = new URLSearchParams({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      const response = await fetch(`/api/rooms/${roomId}/availability?${params}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Calendar API Response:', data);
        console.log('Booked dates received:', data.bookedDates);
        setBookedDates(data.bookedDates || []);
      } else {
        console.error('Failed to fetch availability:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDateBooked = (date: Date) => {
    // 使用UTC方式格式化日期，避免时区问题
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const found = bookedDates.find(booked => booked.date === dateStr);
    
    // 添加调试信息
    if (date.getDate() === 23 || date.getDate() === 24) {
      console.log(`Checking date: ${date.toDateString()}`);
      console.log(`Formatted as: ${dateStr}`);
      console.log(`ISO String: ${date.toISOString().split('T')[0]}`);
      console.log(`Found booked: ${found ? 'YES' : 'NO'}`);
      console.log(`Available booked dates:`, bookedDates.map(b => b.date));
    }
    
    return found;
  };

  const getDayClass = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const booked = isDateBooked(date);
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();

    let classes = 'w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors ';

    if (isPast) {
      classes += 'text-gray-300 cursor-not-allowed ';
    } else if (isToday) {
      classes += 'bg-wa-brown text-wa-cream font-bold ';
    } else if (booked) {
      classes += 'bg-red-500 text-white '; // Booked dates
    } else {
      classes += 'text-wa-gray hover:bg-wa-beige ';
    }

    return classes;
  };

  const renderCalendarMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay()); // Start from Sunday

    const days = [];
    const current = new Date(startDate);

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return (
      <div key={`${year}-${month}`} className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold text-wa-brown mb-4 text-center">
          {monthDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
        </h3>
        
        {/* Week headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-wa-gray p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const booked = isDateBooked(date);
            
            return (
              <div
                key={index}
                className={`p-1 ${isCurrentMonth ? '' : 'opacity-30'}`}
              >
                <div
                  className={getDayClass(date)}
                  title={booked ? '予約済み' : '空室'}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-wa-brown mb-4">空室状況カレンダー</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-wa-gray">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-wa-brown">空室状況カレンダー</h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 text-wa-brown hover:bg-wa-beige rounded-full transition-colors"
            disabled={currentMonth.getMonth() === new Date().getMonth()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-wa-brown hover:bg-wa-beige rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-wa-brown rounded-full"></div>
          <span className="text-wa-gray">今日</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-wa-gray">予約済み</span>
        </div>
      </div>

      {/* Calendar months */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderCalendarMonth(currentMonth)}
        {renderCalendarMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
      </div>
    </div>
  );
}