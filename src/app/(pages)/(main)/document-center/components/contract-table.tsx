"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FiMoreVertical, FiCalendar, FiSearch } from "react-icons/fi";
import { RxFileText } from "react-icons/rx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ContractData {
  id: string;
  contract?: File;
  contractWith: string;
  workArea: string;
  contractDate: string;
}

interface ContractTableProps {
  data: ContractData[];
}

export function ContractTable({ data }: ContractTableProps) {
  return (
    <div className="rounded-md bg-white shadow-sm">
      {/* Controls */}
      <div className="p-4 border-b flex justify-between items-center gap-3">
        <div className="flex gap-2">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 bg-muted md:w-[200px] lg:w-[300px]"
            />
          </div>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Contract with" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">Gulf Mining & Resources</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Work Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">Northern Production Unit</SelectItem>
              <SelectItem value="south">Southern Area</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start">
                <FiCalendar className="mr-2 h-4 w-4" />
                Contract Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" captionLayout="dropdown" />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Show</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 15, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Contract</TableHead>
            <TableHead>Contract With</TableHead>
            <TableHead>Work Area</TableHead>
            <TableHead>Contract Date</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <RxFileText size={35} />
                  <div className="flex flex-col gap-1">
                    <h1>{item.contract?.name}</h1>
                    <p>{item.contract?.size}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.contractWith}</TableCell>
              <TableCell>{item.workArea}</TableCell>
              <TableCell>{item.contractDate}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <FiMoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
