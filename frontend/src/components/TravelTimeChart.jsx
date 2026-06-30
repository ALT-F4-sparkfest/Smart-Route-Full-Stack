import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import hourlyData from "../data/hourlyTravelTime.json";

export default function TravelTimeChart() {
  const chartData = hourlyData.hours.map((hour, index) => ({
    hour: `${hour}:00`,
    avg: hourlyData.avg_minutes[index],
    min: hourlyData.min_minutes[index],
    max: hourlyData.max_minutes[index],
    trips: hourlyData.trip_count[index],
  }));

  return (
    <div className="chart-section">
      <h3 className="chart-title">⏱️ Average Travel Time by Hour</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis
            label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
          />
          <Tooltip formatter={(value) => `${value.toFixed(1)} min`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#FF6B00"
            name="Average"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#1A237E"
            name="Min"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#FFD700"
            name="Max"
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
