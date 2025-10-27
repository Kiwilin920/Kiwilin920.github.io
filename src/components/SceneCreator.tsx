import { useState } from 'react';
import { Plus, Play, Trash2, Film, Home, Sun, Moon, Coffee } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useSmartHome } from './SmartHomeContext';
import { Badge } from './ui/badge';

const sceneIcons = {
  Film,
  Home,
  Sun,
  Moon,
  Coffee,
};

export function SceneCreator() {
  const { devices, scenes, addScene, activateScene, deleteScene } = useSmartHome();
  const [open, setOpen] = useState(false);
  const [sceneName, setSceneName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof sceneIcons>('Home');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneName || selectedDevices.length === 0) return;

    const sceneDevices = selectedDevices.map(deviceId => ({
      deviceId,
      isOn: true,
      value: undefined,
    }));

    addScene({
      name: sceneName,
      icon: selectedIcon,
      devices: sceneDevices,
    });

    setSceneName('');
    setSelectedIcon('Home');
    setSelectedDevices([]);
    setOpen(false);
  };

  const toggleDevice = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Scenes</h2>
          <p className="text-muted-foreground">Create and activate custom device configurations</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Scene
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Scene</DialogTitle>
              <DialogDescription>
                Select devices and configure settings for this scene.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="scene-name">Scene Name</Label>
                  <Input
                    id="scene-name"
                    value={sceneName}
                    onChange={(e) => setSceneName(e.target.value)}
                    placeholder="e.g., Bedtime"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={selectedIcon}
                    onValueChange={(value: keyof typeof sceneIcons) => setSelectedIcon(value)}
                  >
                    <SelectTrigger id="icon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(sceneIcons).map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select Devices</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                    {devices.map((device) => (
                      <div key={device.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={device.id}
                          checked={selectedDevices.includes(device.id)}
                          onCheckedChange={() => toggleDevice(device.id)}
                        />
                        <label
                          htmlFor={device.id}
                          className="flex-1 text-sm cursor-pointer"
                        >
                          {device.name} <span className="text-muted-foreground">({device.room})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Scene</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenes.map((scene) => {
          const IconComponent = sceneIcons[scene.icon as keyof typeof sceneIcons] || Home;
          return (
            <Card key={scene.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-secondary">
                    <IconComponent className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3>{scene.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteScene(scene.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {scene.devices.slice(0, 3).map((device, idx) => {
                    const deviceData = devices.find(d => d.id === device.deviceId);
                    return deviceData ? (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {deviceData.name}
                      </Badge>
                    ) : null;
                  })}
                  {scene.devices.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{scene.devices.length - 3} more
                    </Badge>
                  )}
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => activateScene(scene.id)}
                >
                  <Play className="h-4 w-4" />
                  Activate Scene
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
