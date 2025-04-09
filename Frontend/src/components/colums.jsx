"use client"

import { Badge } from "@/components/ui/badge"
import Button  from "../components/ui/button"
import { Edit, FileText, Trash2 } from "lucide-react"

export const columns = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "project",
    header: "Project",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <Badge variant={status === "approved" ? "success" : status === "rejected" ? "destructive" : "outline"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "receipt",
    header: "Receipt",
    cell: ({ row }) => {
      const hasReceipt = row.getValue("receipt")
      return hasReceipt ? (
        <Button variant="ghost" size="sm">
          <FileText className="h-4 w-4" />
        </Button>
      ) : (
        "N/A"
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const expense = row.original
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" disabled={expense.status !== "pending"}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled={expense.status !== "pending"}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    },
  },
]
