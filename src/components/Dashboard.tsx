import { DeviceCard } from './DeviceCard';
import { useSmartHome } from './SmartHomeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function Dashboard() {
  const { devices } = useSmartHome();
  const [searchTerm, setSearchTerm] = useState('');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const rooms = ['all', ...Array.from(new Set(devices.map(d => d.room)))];

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoom = roomFilter === 'all' || device.room === roomFilter;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'online' && device.status === 'online') ||
                          (statusFilter === 'offline' && device.status === 'offline') ||
                          (statusFilter === 'active' && device.isOn);
    
    return matchesSearch && matchesRoom && matchesStatus;
  });

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const activeDevices = devices.filter(d => d.isOn && d.status === 'online').length;

  return (
    <div className="space-y-6">
      <div>
        <h2>Device Dashboard</h2>
        <p className="text-muted-foreground">
          {onlineDevices} devices online • {activeDevices} active
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by room" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map(room => (
              <SelectItem key={room} value={room}>
                {room === 'all' ? 'All Rooms' : room}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredDevices.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No devices found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  );
}
