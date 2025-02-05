import Wrapper from '@/layout/wrapper/wrapper';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserRoleChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData, error } = await supabase
        .from('users')
        .select('role, created_at')
        .order('created_at', { ascending: true }); // Order by creation date

      if (error) {
        console.error(error);
      } else {
        // Group users by date and role
        const groupedData = {};

        usersData.forEach(user => {
          const date = new Date(user.created_at).toLocaleDateString(); // Format date as MM/DD/YYYY
          if (!groupedData[date]) {
            groupedData[date] = { admin: 0, user: 0 };
          }
          if (user.role === 'admin') {
            groupedData[date].admin += 1;
          } else if (user.role === 'user') {
            groupedData[date].user += 1;
          }
        });

        // Convert grouped data into an array suitable for the chart
        const chartData = Object.keys(groupedData).map(date => ({
          date,
          admin: groupedData[date].admin,
          user: groupedData[date].user
        }));

        setData(chartData);
      }
    };

    fetchData();
  }, []);

  return (
    <Wrapper>
      <div style={{ width: '50%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
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
    </Wrapper>
  );
};

export default UserRoleChart;
