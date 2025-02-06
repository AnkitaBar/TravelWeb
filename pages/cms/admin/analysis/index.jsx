import Wrapper from "@/layout/wrapper/wrapper";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserRoleChart = () => {
  const [userData, setUserData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [ratingData, setRatingData] = useState([]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: usersData, error } = await supabase
        .from("users")
        .select("role, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        const groupedData = {};

        usersData.forEach((user) => {
          const date = new Date(user.created_at).toLocaleDateString(); // Format date
          if (!groupedData[date]) {
            groupedData[date] = { admin: 0, user: 0 };
          }
          if (user.role === "admin") {
            groupedData[date].admin += 1;
          } else if (user.role === "user") {
            groupedData[date].user += 1;
          }
        });

        const chartData = Object.keys(groupedData).map((date) => ({
          date,
          admin: groupedData[date].admin,
          user: groupedData[date].user,
        }));

        setUserData(chartData);
      }
    };

    fetchUserData();
  }, []);

  // Fetch booking data
  useEffect(() => {
    const fetchBookingData = async () => {
      const { data: bookingsData, error } = await supabase
        .from("booking")
        .select("id,created_at") // Fetch only created_at for booking data
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        const groupedData = {};

        bookingsData.forEach((booking) => {
          const date = new Date(booking.created_at).toLocaleDateString(); // Format date
          if (!groupedData[date]) {
            groupedData[date] = 0;
          }
          groupedData[date] += 1; // Increment the count of bookings for each date
        });

        const chartData = Object.keys(groupedData).map((date) => ({
          date,
          bookings: groupedData[date], // Show the total number of bookings for each date
        }));

        setBookingData(chartData); // Set the processed booking data
      }
    };

    fetchBookingData();
  }, []);

  // Fetch rating data
  useEffect(() => {
    const fetchRatingData = async () => {
      const { data: ratingsData, error } = await supabase
        .from("rating")
        .select("id,created_at") // Fetch only created_at for rating data
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        const groupedData = {};

        ratingsData.forEach((rating) => {
          const date = new Date(rating.created_at).toLocaleDateString(); // Format date
          if (!groupedData[date]) {
            groupedData[date] = 0;
          }
          groupedData[date] += 1; // Increment the count of ratings for each date
        });

        const chartData = Object.keys(groupedData).map((date) => ({
          date,
          ratings: groupedData[date], // Show the total number of ratings for each date
        }));

        setRatingData(chartData); // Set the processed rating data
      }
    };

    fetchRatingData();
  }, []);

  return (
    <Wrapper>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "20px",
          marginTop: "5%",
        }}
      >
        {/* User Role Chart */}
        <div style={{ width: "48%", height: 400 , marginBottom: "2%" }}>
          <h3>User Role Distribution</h3>
          <ResponsiveContainer>
            <BarChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="admin" fill="#8884d8" />
              <Bar dataKey="user" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Count Chart */}
        <div style={{ width: "48%", height: 400 , marginBottom: "2%" }}>
          <h3>Total Bookings by Date</h3>
          <ResponsiveContainer>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Count Chart */}
        <div style={{ width: "48%", height: 400, marginBottom: "10%" }}>
          <h3>Total Ratings by Date</h3>
          <ResponsiveContainer>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ratings" fill="#A865B5" /> {/* Corrected dataKey */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Wrapper>
  );
};

export default UserRoleChart;
