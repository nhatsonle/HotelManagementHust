import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getMonthlyBookingStats,
  getTodaySummary,
  getRoomStatus,
  getRoomTypes,
} from "../services/api2";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function SemiCircleProgress({ value }) {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const progress = (value / 100) * circumference;
  return (
    <div className="relative w-60 h-40 flex items-center justify-center">
      <svg viewBox="0 0 120 60" className="w-full h-full">
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${progress}, ${circumference}`}
        />
      </svg>
      <div className="absolute bottom-6 text-2xl font-semibold">{value}%</div>
    </div>
  );
}

export default function Dashboard() {
  const [bookingStats, setBookingStats] = useState([]);
  const [todaySummary, setTodaySummary] = useState({ checkIn: 0, checkOut: 0, inHotel: 0 });
  const [roomStatus, setRoomStatus] = useState({ occupied: 0, available: 0 });
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [monthly, today, status, types] = await Promise.all([
        getMonthlyBookingStats(),
        getTodaySummary(),
        getRoomStatus(),
        getRoomTypes(),
      ]);
      setBookingStats(monthly);
      setTodaySummary(today);
      setRoomStatus(status);
      setRoomTypes(types);
    };
    fetchData();
  }, []);

  return (
    <main className="ml-64 mt-16 p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Overview Section */}
      <Card>
        <CardContent>
          <div className="font-bold text-lg mb-4">Overview</div>
          <div className="grid grid-cols-5 gap-4">
            {[
              { title: "Today's Check-in", value: todaySummary.checkIn },
              { title: "Today's Check-out", value: todaySummary.checkOut },
              { title: "Total In hotel", value: todaySummary.inHotel },
              { title: "Total Available room", value: roomStatus.available },
              { title: "Total Occupied room", value: roomStatus.occupied },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-sm text-gray-500">{item.title}</div>
                <div className="text-2xl font-bold">{item.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rooms Section */}
      <div className="grid grid-cols-3 gap-4">
        {roomTypes.map((room, i) => (
          <Card key={i}>
            <CardContent>
              <div className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded w-fit mb-2">
  {room.occupied} Deals
</div>
              <div className="text-lg font-semibold">{room.room_type}</div>
              <div className="text-sm text-gray-500">
                {room.occupied}/{room.total}
              </div>
              <div className="text-blue-600 font-bold text-xl mt-2">
                {parseInt(room.price).toLocaleString()} VND/day
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Room Status & Monthly Booking Stats */}
      <div className="grid grid-cols-2 gap-4">
        {/* Room Status */}
        <Card className="h-64">
          <CardContent className="h-full">
            <div className="font-bold text-xl mb-4">Room Status</div>
            <div className="flex items-center h-full">
              {
  <SemiCircleProgress
    value={
      roomStatus.occupied + roomStatus.available > 0
        ? Math.round((roomStatus.occupied / (roomStatus.occupied + roomStatus.available)) * 100)
        : 0
    }
  />
}
              <div className="space-y-3 text-base">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-500 rounded-full inline-block"></span>
                  <span className="text-gray-600">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-gray-200 rounded-full inline-block"></span>
                  <span className="text-gray-600">Available</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Booking Statistics */}
        <Card className="h-64">
          <CardContent className="h-full">
            <div className="font-bold text-lg mb-4">Monthly Booking Statistics</div>
            <div className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingStats}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
