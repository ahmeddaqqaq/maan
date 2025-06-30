// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import {
//   FiMoreVertical,
//   FiDownload,
//   FiCalendar,
//   FiSearch,
// } from "react-icons/fi";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";

// interface ProductionData {
//   id: string;
//   workArea: string;
//   category: string;
//   material: string;
//   qty: number;
//   from: string;
//   to: string;
// }

// interface Requests {
//   data: ProductionData[];
// }

// export function ProductionTable({ data }: ProductionTableProps) {
//   return (
//     <div className="rounded-md bg-white shadow-sm">
//       {/* Integrated Table Controls */}
//       <div className="p-4 border-b flex justify-between items-center gap-3">
//         <div className="flex gap-2">
//           <Button variant="outline" className="ml-auto">
//             <FiDownload className="mr-2 h-4 w-4" />
//             Export
//           </Button>
//           <div className="relative w-full max-w-md">
//             <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search..."
//               className="w-full pl-8 bg-muted md:w-[200px] lg:w-[300px]"
//             />
//           </div>
//           <Select>
//             <SelectTrigger>
//               <SelectValue placeholder="Work Area" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="construction">Construction</SelectItem>
//               <SelectItem value="electrical">Electrical</SelectItem>
//               <SelectItem value="plumbing">Plumbing</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select>
//             <SelectTrigger>
//               <SelectValue placeholder="Company" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="company1">Company A</SelectItem>
//               <SelectItem value="company2">Company B</SelectItem>
//             </SelectContent>
//           </Select>

//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline" className="w-[150px] justify-start">
//                 <FiCalendar className="mr-2 h-4 w-4" />
//                 Select Date
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0">
//               <Calendar mode="range" captionLayout="dropdown" />
//             </PopoverContent>
//           </Popover>
//         </div>

//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-gray-600 whitespace-nowrap">Show</span>
//           <Select defaultValue="10">
//             <SelectTrigger className="w-[80px]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {[10, 15, 20, 30, 50].map((size) => (
//                 <SelectItem key={size} value={String(size)}>
//                   {size}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Table */}
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-gray-50">
//             <TableHead className="w-[40px]">
//               <Checkbox />
//             </TableHead>
//             <TableHead>ID</TableHead>
//             <TableHead>Work Area</TableHead>
//             <TableHead>Category</TableHead>
//             <TableHead>Material</TableHead>
//             <TableHead>Qty</TableHead>
//             <TableHead>From</TableHead>
//             <TableHead>To</TableHead>
//             <TableHead className="w-[40px]"></TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.map((item) => (
//             <TableRow key={item.id}>
//               <TableCell>
//                 <Checkbox />
//               </TableCell>
//               <TableCell>{item.id}</TableCell>
//               <TableCell className="font-bold">{item.workArea}</TableCell>
//               <TableCell>{item.category}</TableCell>
//               <TableCell>{item.material}</TableCell>
//               <TableCell>{item.qty}</TableCell>
//               <TableCell>{item.from}</TableCell>
//               <TableCell>{item.to}</TableCell>
//               <TableCell>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <FiMoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>Edit</DropdownMenuItem>
//                     <DropdownMenuItem>Delete</DropdownMenuItem>
//                     <DropdownMenuItem>View Details</DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
