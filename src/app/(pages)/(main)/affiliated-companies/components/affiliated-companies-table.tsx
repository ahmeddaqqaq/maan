"use client";

import { Button } from "@/components/ui/button";
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
import { FiMoreVertical } from "react-icons/fi";
import type { EntityResponse } from "../../../../../../client";

interface AffiliatedTableProps {
  data: EntityResponse[];
  onEdit?: (entity: EntityResponse) => void;
  onDelete?: (entity: EntityResponse) => void;
}

export function AffiliatedTable({
  data,
  onEdit,
  onDelete,
}: AffiliatedTableProps) {
  return (
    <div className="rounded-md bg-white shadow-sm">
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entity) => (
            <TableRow key={entity.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{entity.id}</TableCell>
              <TableCell className="font-bold">{entity.name}</TableCell>
              <TableCell>
                {new Date(entity.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <FiMoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(entity)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete?.(entity)}>
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
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
