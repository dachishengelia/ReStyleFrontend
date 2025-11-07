import { PieChart, Pie, Cell, Legend } from "recharts";

const data = [
  { name: "Buyers", value: stats.buyers },
  { name: "Sellers", value: stats.sellers },
  { name: "Admins", value: stats.admins },
];

<PieChart width={400} height={400}>
  <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
  <Legend />
</PieChart>
