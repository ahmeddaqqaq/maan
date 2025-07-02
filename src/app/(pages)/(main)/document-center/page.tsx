"use client";

import { useState } from "react";
import TopBar from "@/app/(pages)/components/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FiSearch,
  FiFile,
  FiDownload,
  FiEye,
  FiShare2,
  FiMoreVertical,
  FiUpload,
  FiFolder,
  FiFileText,
  FiImage,
  FiVideo,
} from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface DocumentItem {
  id: string;
  name: string;
  type: 'contract' | 'report' | 'invoice' | 'claim' | 'other';
  format: 'pdf' | 'doc' | 'xlsx' | 'jpg' | 'png' | 'mp4';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  category: string;
}

const mockDocuments: DocumentItem[] = [
  {
    id: '1',
    name: 'Mining Contract - Q4 2024',
    type: 'contract',
    format: 'pdf',
    size: '2.4 MB',
    uploadedBy: 'John Doe',
    uploadedAt: '2024-01-15',
    category: 'Legal'
  },
  {
    id: '2',
    name: 'Monthly Production Report - January',
    type: 'report',
    format: 'xlsx',
    size: '1.8 MB',
    uploadedBy: 'Jane Smith',
    uploadedAt: '2024-02-01',
    category: 'Production'
  },
  {
    id: '3',
    name: 'Invoice INV-2024-001',
    type: 'invoice',
    format: 'pdf',
    size: '156 KB',
    uploadedBy: 'Mike Johnson',
    uploadedAt: '2024-01-20',
    category: 'Financial'
  },
  {
    id: '4',
    name: 'Site Safety Inspection',
    type: 'report',
    format: 'doc',
    size: '892 KB',
    uploadedBy: 'Sarah Wilson',
    uploadedAt: '2024-01-10',
    category: 'Safety'
  }
];

export default function DocumentCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const getFileIcon = (format: string) => {
    switch (format) {
      case 'pdf':
      case 'doc':
        return <FiFileText className="h-6 w-6 text-red-500" />;
      case 'xlsx':
        return <FiFile className="h-6 w-6 text-green-500" />;
      case 'jpg':
      case 'png':
        return <FiImage className="h-6 w-6 text-blue-500" />;
      case 'mp4':
        return <FiVideo className="h-6 w-6 text-purple-500" />;
      default:
        return <FiFile className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      contract: "bg-blue-100 text-blue-800",
      report: "bg-green-100 text-green-800",
      invoice: "bg-yellow-100 text-yellow-800",
      claim: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    const matchesType = !selectedType || doc.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Document Center</h1>
              <p className="text-gray-600 mt-1">Manage contracts, reports, and other mining documents</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <FiFolder className="mr-2 h-4 w-4" />
                New Folder
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FiUpload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[300px]">
                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="contract">Contracts</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                  <SelectItem value="claim">Claims</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(doc.format)}
                      <Badge className={getTypeBadgeColor(doc.type)}>
                        {doc.type}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FiMoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <FiEye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <FiDownload className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <FiShare2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-sm font-medium line-clamp-2">
                    {doc.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{doc.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{doc.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>By:</span>
                      <span>{doc.uploadedBy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FiFile className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
