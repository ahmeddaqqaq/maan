"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Package, FileText, MapPin } from "lucide-react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your application settings</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="mines" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Mines
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Create and manage user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Management</CardTitle>
              <CardDescription>
                Create and manage materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Management</CardTitle>
              <CardDescription>
                Create and manage contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mines" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mine Management</CardTitle>
              <CardDescription>
                Create and manage mines
              </CardDescription>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}