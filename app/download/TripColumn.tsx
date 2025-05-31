import {ColumnDef} from '@tanstack/react-table'
import {Trip} from '@prisma/client';

export const TripColumn:ColumnDef<Trip>[] = [
  {
    accessorKey: "startLocation",
    header: "Start Location"
  },
  {
    accessorKey: "endLocation",
    header: "End Location",
  },
  {
    accessorKey: "cost",
    header: "Cost",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "travelTime",
    header: "Travel Time (minutes)",
  },


]