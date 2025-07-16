"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { MineResponse, MineService } from "../../../../../../client";


interface MinesTableProps {
  retrigger: number;
}

export const MinesTable = ({ retrigger }: MinesTableProps) => {
    const [mines, setMines] = useState<MineResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
      fetchMines();
    }, [retrigger]);

    const fetchMines = async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        const response = await MineService.mineControllerFindMany({});
        setMines(response.data || []);
        if (isRefresh) {
          toast.success("Mines refreshed successfully");
        }
      } catch (error) {
        toast.error("Failed to fetch mines");
        console.error(error);
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    };

    const handleRefresh = async () => {
      await fetchMines(true);
    };

    const handleDelete = async (id: number) => {
      if (!confirm("Are you sure you want to delete this mine?")) return;

      try {
        await MineService.mineControllerDelete({ id });
        toast.success("Mine deleted successfully");
        fetchMines();
      } catch (error) {
        toast.error("Failed to delete mine");
        console.error(error);
      }
    };

    if (loading) {
      return <div className="text-center py-8">Loading mines...</div>;
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Mines</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mines.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No mines found
                  </TableCell>
                </TableRow>
              ) : (
                mines.map((mine) => (
                  <TableRow key={mine.id}>
                    <TableCell className="font-medium">{mine.name}</TableCell>
                    <TableCell>{mine.location || "N/A"}</TableCell>
                    <TableCell>{mine.contract?.name || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement edit functionality
                            toast.info("Edit functionality coming soon");
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(mine.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
};
