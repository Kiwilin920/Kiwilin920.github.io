import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from './ui/card';
import { useSmartHome } from './SmartHomeContext';
import { Zap, TrendingDown, TrendingUp } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', energy: 45 },
  { day: 'Tue', energy: 52 },
  { day: 'Wed', energy: 38 },
  { day: 'Thu', energy: 48 },
  { day: 'Fri', energy: 55 },
  { day: 'Sat', energy: 42 },
  { day: 'Sun', energy: 40 },
];

const monthlyData = [
  { month: 'Jan', energy: 320, cost: 48 },
  { month: 'Feb', energy: 280, cost: 42 },
  { month: 'Mar', energy: 340, cost: 51 },
  { month: 'Apr', energy: 310, cost: 46 },
  { month: 'May', energy: 360, cost: 54 },
  { month: 'Jun', energy: 380, cost: 57 },
];

const COLORS = ['#b8a8d8', '#a8c8e8', '#f8d8b8', '#c8e8b8', '#f8c8d8'];

export function AnalyticsDashboard() {
  const { devices } = useSmartHome();

  const totalEnergyUsage = devices.reduce((sum, device) => sum + (device.energyUsage || 0), 0);
  const activeDevices = devices.filter(d => d.isOn && d.status === 'online').length;

  const deviceTypeData = devices.reduce((acc, device) => {
    const existing = acc.find(item => item.name === device.type);
    if (existing) {
      existing.value += device.energyUsage || 0;
    } else {
      acc.push({ name: device.type, value: device.energyUsage || 0 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const roomData = devices.reduce((acc, device) => {
    const existing = acc.find(item => item.name === device.room);
    if (existing) {
      existing.value += device.energyUsage || 0;
    } else {
      acc.push({ name: device.room, value: device.energyUsage || 0 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="space-y-6">
      <div>
        <h2>Usage Analytics</h2>
        <p className="text-muted-foreground">Monitor energy consumption and device performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3>Total Energy</h3>
          </div>
          <p className="text-3xl mb-1">{totalEnergyUsage} kWh</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <TrendingDown className="h-4 w-4 text-[#c8e8b8]" />
            12% less than last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/50">
              <Zap className="h-5 w-5 text-accent-foreground" />
            </div>
            <h3>Active Devices</h3>
          </div>
          <p className="text-3xl mb-1">{activeDevices}/{devices.length}</p>
          <p className="text-sm text-muted-foreground">Currently running</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-secondary/50">
              <TrendingUp className="h-5 w-5 text-secondary-foreground" />
            </div>
            <h3>Estimated Cost</h3>
          </div>
          <p className="text-3xl mb-1">${(totalEnergyUsage * 0.15).toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Weekly Energy Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="energy" fill="#b8a8d8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="energy" stroke="#b8a8d8" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#a8c8e8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Energy by Device Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Energy by Room</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#a8c8e8" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
