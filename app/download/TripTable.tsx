"use client"
import * as React from "react"

import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  getFilteredRowModel,

  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,

} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,

} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import './styles.css'
import {Trip} from "@prisma/client";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<Trip, any>[];


}
import axios from 'axios';
import {useContext, useState} from "react";
import {TableContext} from "@/app/download/TableContext";
export function TripTable<TData, TValue>({
                                           columns,

                                         }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const {data, setData} = useContext(TableContext);
  const [rowSelection, setRowSelection] = React.useState({})
  const handleDelete = async () =>{
    // @ts-ignore
    const toDelete = table.getSelectedRowModel().rows.map((item) => item.original.tripID)
    setData(data.filter((item) => !toDelete.includes(item.tripID)));
    await axios.post('/api/deleteTrip',  {
      tripIDs: toDelete
    });
    //now filter through the state
  }
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,

    initialState:{
      pagination:{
        pageSize:5
      }
    },
    state:{
      sorting,

      columnFilters,
      rowSelection
    }
  })

  return (
    <div>
      <div className="flex flex-row justify-between items-center py-4">
        <Input
          placeholder="Filter destinations ... "
          value={(table.getColumn("endLocation")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("endLocation")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className  =  "tableButtons">
          <Button onClick={() => console.log("test")} className="exportButton"> Export Selected Trips</Button>
          <Button onClick={handleDelete} className="deleteExportButton"  variant="destructive"> Delete Selected Trips</Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center  ">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow className="text-center"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-center" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 ">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}