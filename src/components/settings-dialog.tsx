"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  FiSettings,
  FiMoreVertical,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiShield,
  FiTool,
  FiMapPin,
} from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { useMaterials } from "@/hooks/useContracts";
import { useMines } from "@/hooks/useClaims";
import AddNewMaterialDialog from "@/app/(pages)/components/add-new-material-dialog";
import AddNewWorkAreaDialog from "@/app/(pages)/components/add-new-work-area-dialog";

interface SettingsDialogProps {
  children?: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("mines");
  const [materialSearchQuery, setMaterialSearchQuery] = useState("");
  const [mineSearchQuery, setMineSearchQuery] = useState("");

  // Materials data
  const {
    data: materialsData,
    isLoading: materialsLoading,
    error: materialsError,
  } = useMaterials();

  // Mines data
  const {
    data: minesData,
    isLoading: minesLoading,
    error: minesError,
  } = useMines();

  const materials = materialsData?.data || [];
  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(materialSearchQuery.toLowerCase())
  );

  const mines = minesData?.data || [];
  const filteredMines = mines.filter(
    (mine) =>
      mine.name.toLowerCase().includes(mineSearchQuery.toLowerCase()) ||
      mine.location.toLowerCase().includes(mineSearchQuery.toLowerCase())
  );

  const sideMenuItems = [
    // {
    //   id: "account",
    //   name: "Account",
    //   icon: <FiUser className="h-4 w-4" />,
    //   description: "Personal information",
    // },
    {
      id: "roles",
      name: "Roles & Permissions",
      icon: <FiShield className="h-4 w-4" />,
      description: "User roles management",
    },
    {
      id: "materials",
      name: "Materials",
      icon: <FiTool className="h-4 w-4" />,
      description: "Mining materials",
    },
    {
      id: "mines",
      name: "Mines & Work Areas",
      icon: <FiMapPin className="h-4 w-4" />,
      description: "Mining locations",
    },
    // {
    //   id: "production",
    //   name: "Production",
    //   icon: <FiActivity className="h-4 w-4" />,
    //   description: "Production settings",
    // },
  ];

  const AccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Account Settings
        </h3>
        <p className="text-gray-600 mb-6">
          Manage your account information and preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <Input placeholder="Enter first name" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <Input placeholder="Enter last name" disabled />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input placeholder="Enter email address" disabled />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <Input placeholder="Enter username" disabled />
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-500">
          Account settings functionality will be implemented soon.
        </p>
      </div>
    </div>
  );

  const RolesSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Roles & Permissions
        </h3>
        <p className="text-gray-600 mb-6">
          Manage user roles and access permissions
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Administrator</span>
            <Badge className="bg-red-100 text-red-800">Full Access</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Complete system access and management capabilities
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Production Manager</span>
            <Badge className="bg-blue-100 text-blue-800">Production</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Production oversight and management
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Financial Manager</span>
            <Badge className="bg-green-100 text-green-800">Financial</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Financial operations and reporting
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Standard User</span>
            <Badge className="bg-gray-100 text-gray-800">Limited</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Basic system access and operations
          </p>
        </div>
      </div>
    </div>
  );

  const MaterialsSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            Materials Management
          </h3>
          <p className="text-gray-600 mt-1">
            Manage mining materials and their properties
          </p>
        </div>
        <AddNewMaterialDialog />
      </div>

      <div className="relative w-full max-w-md">
        <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search materials..."
          className="pl-9"
          value={materialSearchQuery}
          onChange={(e) => setMaterialSearchQuery(e.target.value)}
        />
      </div>

      {materialsLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : materialsError ? (
        <div className="p-8 text-center">
          <p className="text-red-600">
            Error loading materials: {materialsError.message}
          </p>
        </div>
      ) : (
        <div className="rounded-md bg-white shadow-sm border max-h-96 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Mine</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    {materialSearchQuery
                      ? "No materials found matching your search"
                      : "No materials found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-mono text-sm">
                      {material.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {material.name}
                    </TableCell>
                    <TableCell>{material.unit}</TableCell>
                    <TableCell>{material.entityId || "N/A"}</TableCell>
                    <TableCell>{material.mineId || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          material.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {material.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <FiMoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <FiEdit3 className="mr-2 h-4 w-4" />
                            Edit Material
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                            <FiTrash2 className="mr-2 h-4 w-4" />
                            Delete Material
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  const MinesSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            Mines & Work Areas
          </h3>
          <p className="text-gray-600 mt-1">
            Manage mining locations and work areas
          </p>
        </div>
        <AddNewWorkAreaDialog />
      </div>

      <div className="relative w-full max-w-md">
        <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search mines and locations..."
          className="pl-9"
          value={mineSearchQuery}
          onChange={(e) => setMineSearchQuery(e.target.value)}
        />
      </div>

      {minesLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : minesError ? (
        <div className="p-8 text-center">
          <p className="text-red-600">
            Error loading mines: {minesError.message}
          </p>
        </div>
      ) : (
        <div className="rounded-md bg-white shadow-sm border max-h-96 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMines.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    {mineSearchQuery
                      ? "No mines found matching your search"
                      : "No mines found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMines.map((mine) => (
                  <TableRow key={mine.id}>
                    <TableCell className="font-mono text-sm">
                      {mine.id}
                    </TableCell>
                    <TableCell className="font-medium">{mine.name}</TableCell>
                    <TableCell>{mine.location}</TableCell>
                    <TableCell>{mine.entityId || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          mine.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {mine.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(mine.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <FiMoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <FiEdit3 className="mr-2 h-4 w-4" />
                            Edit Mine
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                            <FiTrash2 className="mr-2 h-4 w-4" />
                            Delete Mine
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  const ProductionSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Production Settings
        </h3>
        <p className="text-gray-600 mb-6">
          Configure production parameters and workflows
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Production Targets</h4>
          <p className="text-sm text-gray-600 mb-3">
            Set monthly and yearly production goals
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Target
              </label>
              <Input placeholder="Enter monthly target" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yearly Target
              </label>
              <Input placeholder="Enter yearly target" disabled />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Quality Standards</h4>
          <p className="text-sm text-gray-600 mb-3">
            Define quality control parameters
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Grade (%)
            </label>
            <Input placeholder="Enter minimum grade" disabled />
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Safety Protocols</h4>
          <p className="text-sm text-gray-600">
            Safety guidelines and emergency procedures
          </p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-500">
          Production settings functionality will be implemented soon.
        </p>
      </div>
    </div>
  );

  const renderActiveContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings />;
      case "roles":
        return <RolesSettings />;
      case "materials":
        return <MaterialsSettings />;
      case "mines":
        return <MinesSettings />;
      case "production":
        return <ProductionSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <FiSettings className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-6xl min-h-[85vh] overflow-hidden p-0">
        <div className="flex h-full">
          {/* Side Menu */}
          <div className="w-72 bg-gray-50 border-r">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="flex items-center gap-2">
                <FiSettings className="h-5 w-5" />
                Settings
              </DialogTitle>
            </DialogHeader>

            <nav className="p-4 space-y-2">
              {sideMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "hover:bg-white hover:shadow-sm text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`${
                        activeSection === item.id
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">{renderActiveContent()}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
