import { useState } from 'react';
import { Home, LayoutGrid, BarChart3, Settings, Bell } from 'lucide-react';
import { SmartHomeProvider } from './components/SmartHomeContext';
import { Dashboard } from './components/Dashboard';
import { SceneCreator } from './components/SceneCreator';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DeviceManagement, DeviceList } from './components/DeviceManagement';
import { NotificationCenter, NotificationList } from './components/NotificationCenter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card } from './components/ui/card';
import { Separator } from './components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Button } from './components/ui/button';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <SmartHomeProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  <Home className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1>Smart Home Control</h1>
                  <p className="text-sm text-muted-foreground">Manage your connected devices</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DeviceManagement />
                <NotificationCenter />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-auto p-1">
              <TabsTrigger value="dashboard" className="gap-2 py-3">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="scenes" className="gap-2 py-3">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Scenes</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2 py-3">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 py-3">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>

            <TabsContent value="scenes">
              <SceneCreator />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <div>
                  <h2>Settings</h2>
                  <p className="text-muted-foreground">Manage devices and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="mb-4">Device Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Add, remove, or configure your smart home devices
                    </p>
                    <DeviceList />
                  </Card>

                  <Card className="p-6">
                    <h3 className="mb-4">Notifications</h3>
                    <p className="text-muted-foreground mb-4">
                      Recent alerts and system notifications
                    </p>
                    <div className="max-h-96 overflow-y-auto">
                      <NotificationList />
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="mb-4">User Profile</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Username</p>
                        <p>Primary User</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Permission Level</p>
                        <p>Administrator</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Connected Devices</p>
                        <p>10 devices</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="mb-4">System Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Hub Status</p>
                        <p className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#c8e8b8]"></span>
                          Online
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Firmware Version</p>
                        <p>v2.4.1</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Last Backup</p>
                        <p>October 26, 2025</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t mt-auto bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2025 Smart Home Control. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SmartHomeProvider>
  );
}
