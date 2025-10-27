import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DeviceType, useSmartHome } from './SmartHomeContext';

export function DeviceManagement() {
  const { addDevice } = useSmartHome();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'light' as DeviceType,
    room: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDevice({
      ...formData,
      isOn: false,
      value: formData.type === 'light' || formData.type === 'thermostat' ? 0 : undefined,
      status: 'online',
      energyUsage: 0,
    });
    setFormData({ name: '', type: 'light', room: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>
            Connect a new smart device to your home control system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Bedroom Light"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Device Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: DeviceType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="thermostat">Thermostat</SelectItem>
                  <SelectItem value="lock">Lock</SelectItem>
                  <SelectItem value="camera">Camera</SelectItem>
                  <SelectItem value="sensor">Sensor</SelectItem>
                  <SelectItem value="outlet">Outlet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g., Living Room"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Device</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeviceListProps {
  onDelete?: (id: string) => void;
}

export function DeviceList({ onDelete }: DeviceListProps) {
  const { devices, deleteDevice } = useSmartHome();

  const handleDelete = (id: string) => {
    deleteDevice(id);
    onDelete?.(id);
  };

  return (
    <div className="space-y-2">
      {devices.map((device) => (
        <div key={device.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
          <div>
            <p>{device.name}</p>
            <p className="text-sm text-muted-foreground">{device.room} • {device.type}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(device.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
