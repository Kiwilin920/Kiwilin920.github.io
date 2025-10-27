import { Lightbulb, Thermometer, Lock, Camera, Radio, Plug, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Device, useSmartHome } from './SmartHomeContext';

const deviceIcons = {
  light: Lightbulb,
  thermostat: Thermometer,
  lock: Lock,
  camera: Camera,
  sensor: Radio,
  outlet: Plug,
};

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { updateDevice } = useSmartHome();
  const Icon = deviceIcons[device.type];

  const handleToggle = () => {
    updateDevice(device.id, { isOn: !device.isOn });
  };

  const handleValueChange = (values: number[]) => {
    updateDevice(device.id, { value: values[0] });
  };

  const getStatusColor = () => {
    switch (device.status) {
      case 'online': return 'bg-[#c8e8b8]';
      case 'offline': return 'bg-[#f8b4c4]';
      case 'warning': return 'bg-[#f8d8b8]';
    }
  };

  const getStatusText = () => {
    switch (device.status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'warning': return 'Warning';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${device.isOn ? 'bg-primary' : 'bg-muted'}`}>
            <Icon className={`h-6 w-6 ${device.isOn ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <h3 className="mb-1">{device.name}</h3>
            <p className="text-sm text-muted-foreground">{device.room}</p>
          </div>
        </div>
        <Switch
          checked={device.isOn}
          onCheckedChange={handleToggle}
          disabled={device.status === 'offline'}
        />
      </div>

      <div className="space-y-3">
        {device.type === 'light' && device.value !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Brightness</span>
              <span>{device.value}%</span>
            </div>
            <Slider
              value={[device.value]}
              onValueChange={handleValueChange}
              max={100}
              step={1}
              disabled={!device.isOn || device.status === 'offline'}
            />
          </div>
        )}

        {device.type === 'thermostat' && device.value !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Temperature</span>
              <span>{device.value}°F</span>
            </div>
            <Slider
              value={[device.value]}
              onValueChange={handleValueChange}
              min={60}
              max={85}
              step={1}
              disabled={!device.isOn || device.status === 'offline'}
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <Badge variant={device.status === 'online' ? 'secondary' : 'destructive'} className={getStatusColor()}>
            {device.status === 'offline' && <AlertCircle className="h-3 w-3 mr-1" />}
            {getStatusText()}
          </Badge>
          {device.energyUsage !== undefined && (
            <span className="text-sm text-muted-foreground">{device.energyUsage} kWh</span>
          )}
        </div>
      </div>
    </Card>
  );
}
