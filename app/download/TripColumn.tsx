import {ColumnDef} from '@tanstack/react-table'
import {Trip} from '@prisma/client';
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export const TripColumn:ColumnDef<Trip>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "startLocation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-left"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Location
          <ArrowUpDown className=" h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "endLocation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Location
          <ArrowUpDown className=" h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cost
          <ArrowUpDown className=" h-4 w-4" />
        </Button>
      )
    },

    cell: ({row}) => {
      const amount = parseFloat(row.getValue("cost"));
      const formatted = new Intl.NumberFormat("en-us", {
        style:"currency",
        currency: (row.getValue("currency") === 'N/A'? 'USD':row.getValue('currency'))
      }).format(amount)

      return <div> {formatted}</div>
    }
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "travelTime",
    header: ({ column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Travel Time (Minutes)
          <ArrowUpDown className=" h-4 w-4" />
        </Button>
      )
    },

  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem> Edit Trip Details </DropdownMenuItem>
            <DropdownMenuItem> Remove Trip</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },


]