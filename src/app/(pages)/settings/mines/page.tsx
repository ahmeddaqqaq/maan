"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { FiMoreVertical, FiSearch, FiEdit3, FiTrash2 } from "react-icons/fi";
import { useMines } from "@/hooks/useClaims";
import { Skeleton } from "@/components/ui/skeleton";
import AddNewWorkAreaDialog from "../../components/add-new-work-area-dialog";

export default function MinesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: minesData, isLoading, error } = useMines();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error loading mines: {error.message}</p>
      </div>
    );
  }

  const mines = minesData?.data || [];
  const filteredMines = mines.filter(mine =>
    mine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mine.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Mines & Work Areas</h1>
          <p className="text-gray-600 mt-1">Manage mining locations and work areas</p>
        </div>
        <AddNewWorkAreaDialog />
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search mines and locations..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Mines Table */}
      <div className="rounded-md bg-white shadow-sm border">
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
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchQuery ? "No mines found matching your search" : "No mines found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredMines.map((mine) => (
                <TableRow key={mine.id}>
                  <TableCell className="font-mono text-sm">{mine.id}</TableCell>
                  <TableCell className="font-medium">{mine.name}</TableCell>
                  <TableCell>{mine.location}</TableCell>
                  <TableCell>{mine.entityId || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={mine.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {mine.isActive ? 'Active' : 'Inactive'}
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
    </div>
  );
}
