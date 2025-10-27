import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DeviceType = 'light' | 'thermostat' | 'lock' | 'camera' | 'sensor' | 'outlet';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  isOn: boolean;
  value?: number; // For dimmers, temperature, etc.
  status: 'online' | 'offline' | 'warning';
  energyUsage?: number; // kWh
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  devices: { deviceId: string; isOn: boolean; value?: number }[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface SmartHomeContextType {
  devices: Device[];
  scenes: Scene[];
  notifications: Notification[];
  addDevice: (device: Omit<Device, 'id'>) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  addScene: (scene: Omit<Scene, 'id'>) => void;
  activateScene: (sceneId: string) => void;
  deleteScene: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const SmartHomeContext = createContext<SmartHomeContextType | undefined>(undefined);

const initialDevices: Device[] = [
  { id: '1', name: 'Living Room Light', type: 'light', room: 'Living Room', isOn: true, value: 80, status: 'online', energyUsage: 12 },
  { id: '2', name: 'Bedroom Light', type: 'light', room: 'Bedroom', isOn: false, value: 0, status: 'online', energyUsage: 8 },
  { id: '3', name: 'Kitchen Light', type: 'light', room: 'Kitchen', isOn: true, value: 100, status: 'online', energyUsage: 15 },
  { id: '4', name: 'Main Thermostat', type: 'thermostat', room: 'Living Room', isOn: true, value: 72, status: 'online', energyUsage: 45 },
  { id: '5', name: 'Front Door Lock', type: 'lock', room: 'Entrance', isOn: true, status: 'online', energyUsage: 2 },
  { id: '6', name: 'Garage Door', type: 'lock', room: 'Garage', isOn: false, status: 'online', energyUsage: 3 },
  { id: '7', name: 'Security Camera', type: 'camera', room: 'Front Yard', isOn: true, status: 'online', energyUsage: 18 },
  { id: '8', name: 'Motion Sensor', type: 'sensor', room: 'Hallway', isOn: true, status: 'online', energyUsage: 1 },
  { id: '9', name: 'Coffee Maker', type: 'outlet', room: 'Kitchen', isOn: false, status: 'online', energyUsage: 0 },
  { id: '10', name: 'Patio Light', type: 'light', room: 'Outdoor', isOn: false, value: 0, status: 'offline', energyUsage: 0 },
];

const initialScenes: Scene[] = [
  {
    id: '1',
    name: 'Movie Night',
    icon: 'Film',
    devices: [
      { deviceId: '1', isOn: true, value: 20 },
      { deviceId: '3', isOn: false },
    ],
  },
  {
    id: '2',
    name: 'Away Mode',
    icon: 'Home',
    devices: [
      { deviceId: '1', isOn: false },
      { deviceId: '2', isOn: false },
      { deviceId: '3', isOn: false },
      { deviceId: '5', isOn: true },
      { deviceId: '7', isOn: true },
    ],
  },
  {
    id: '3',
    name: 'Good Morning',
    icon: 'Sun',
    devices: [
      { deviceId: '1', isOn: true, value: 100 },
      { deviceId: '3', isOn: true, value: 100 },
      { deviceId: '9', isOn: true },
      { deviceId: '4', isOn: true, value: 68 },
    ],
  },
];

const initialNotifications: Notification[] = [
  {
    id: '1',
    message: 'Patio Light is offline',
    type: 'warning',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: '2',
    message: 'Motion detected in Hallway',
    type: 'info',
    timestamp: new Date(Date.now() - 7200000),
    read: true,
  },
];

export function SmartHomeProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addDevice = (device: Omit<Device, 'id'>) => {
    const newDevice = { ...device, id: Date.now().toString() };
    setDevices([...devices, newDevice]);
  };

  const updateDevice = (id: string, updates: Partial<Device>) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, ...updates } : device
    ));
  };

  const deleteDevice = (id: string) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const addScene = (scene: Omit<Scene, 'id'>) => {
    const newScene = { ...scene, id: Date.now().toString() };
    setScenes([...scenes, newScene]);
  };

  const activateScene = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    scene.devices.forEach(sceneDevice => {
      updateDevice(sceneDevice.deviceId, {
        isOn: sceneDevice.isOn,
        value: sceneDevice.value,
      });
    });

    addNotification({
      message: `Scene "${scene.name}" activated`,
      type: 'info',
    });
  };

  const deleteScene = (id: string) => {
    setScenes(scenes.filter(scene => scene.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <SmartHomeContext.Provider
      value={{
        devices,
        scenes,
        notifications,
        addDevice,
        updateDevice,
        deleteDevice,
        addScene,
        activateScene,
        deleteScene,
        addNotification,
        markNotificationRead,
        clearAllNotifications,
      }}
    >
      {children}
    </SmartHomeContext.Provider>
  );
}

export function useSmartHome() {
  const context = useContext(SmartHomeContext);
  if (!context) {
    throw new Error('useSmartHome must be used within a SmartHomeProvider');
  }
  return context;
}
