"use client"

import { useState,useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button, buttonVariants }  from "../components/ui/button"
import  Input  from "../components/ui/input"
import Textarea from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge, badgeVariants } from "../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,DialogDescription  } from "../components/ui/dialog"
import Label from "../components/ui/label"
import axios from "axios";
import { toast } from 'react-toastify';


import {
  Download,
  Upload,
  Filter,
  Bell,
  Edit,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  PieChartIcon,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, CartesianGrid } from "recharts"
const token = localStorage.getItem("token"); 


// Categories for the dropdown
const categories = [
  "Travel",
  "Office Supplies",
  "Entertainment",
  "Utilities",
  "Food",
  "Transportation",
  "Accommodation",
  "Other",
]

// Projects for the dropdown
const projects = ["Client A", "Client B", "Client C", "Internal", "Personal"]

const EmployeeDashboard = ({ userRole = "employee" }) => {
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/employee/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setExpenses(res.data.recentExpenses);
        setPieChartData(res.data.pieData);
        setBarChartData(res.data.barData);
        setTotalSpent(res.data.totalSpent);
        setExpenseCount(res.data.expenseCount);
      } catch (err) {
        console.error(' Failed to load dashboard data:', err);
      }
    };
  
    fetchDashboardData();
  }, []);
  const [expenses, setExpenses] = useState([]);
  const [pieData, setPieChartData] = useState([]);
  const [barData, setBarChartData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showNotification, setShowNotification] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Form state
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: "",
    project: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    receipt: null,
  })
  const handleInputChange = (e) => {
    setExpenseForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSelectChange = (name, value) => {
    setExpenseForm({
      ...expenseForm,
      [name]: value,
    })
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setExpenseForm((prev) => ({
      ...prev,
      receipt: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("amount", expenseForm.amount);
    formData.append("date", expenseForm.date);
    formData.append("category", expenseForm.category);
    formData.append("project", expenseForm.project);
    formData.append("notes", expenseForm.notes);
    
    if (expenseForm.receipt) {
      formData.append("receipt", expenseForm.receipt);
    }
  
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/employee/expenses`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(" Expense added:", res.data);
      toast.success("Expense submitted successfully!"); 
    } catch (err) {      
      console.error(" Error adding expense:", err);
      toast.error("Failed to submit expense. Please try again.");
    }
  };
  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setExpenseForm({
      amount: expense.amount.toString(),
      category: expense.category,
      project: expense.project,
      date: expense.date,
      notes: expense.notes,
      receipt: null, 
    })
  }

  // EDIT expense
const handleUpdate = async () => {
  try {
    const formData = new FormData();
    Object.entries(expenseForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (true) formData.append("receipt", receiptFile);

    const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/employee/expense/${editingExpense._id}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      body: formData,
    });

    if (res.ok) {
      const updated = await res.json();
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === updated._id ? updated : exp))
      );
      setEditingExpense(null);
      toast.success("Expense updated successfully");
    } else {
      toast.error("Failed to update expense");
    }
  } catch (error) {
    console.error("Update error:", error);
  }
};

// DELETE expense
const handleDelete = async (id) => {
  try {
    const confirm = window.confirm("Are you sure you want to delete this expense?");
    if (!confirm) return;

    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/employee/expenses/${id}`,
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )


      setExpenses((prev) => prev.filter((e) => e._id !== id));
      toast.success("Expense deleted");
    }
    catch (error) {
    console.error("Delete error:", error);
    toast.error("Failed to delete expense");
  }
};

  const filteredExpenses = expenses.filter((expense) => {
    // Filter by status
    if (statusFilter !== "all" && expense.status !== statusFilter) return false

    // Filter by category
    if (categoryFilter !== "all" && expense.category !== categoryFilter) return false

    // Filter by date range
    if (dateRange.start && new Date(expense.date) < new Date(dateRange.start)) return false
    if (dateRange.end && new Date(expense.date) > new Date(dateRange.end)) return false

    return true
  })
  // Calculate budget usage
  const totalBudget = 15000
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const budgetUsage = (totalExpenses / totalBudget) * 100
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-in fade-in slide-in-from-top-5">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <p>Expense submitted successfully!</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome Back, John!</h1>
          <p className="text-gray-500">Manage your expenses and track your budget</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button variant="default" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">My Expenses</TabsTrigger>
          <TabsTrigger value="add">Add Expense</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <h2 className="text-3xl font-bold">₹{totalExpenses.toLocaleString()}</h2>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Budget Usage</p>
                    <h2 className="text-3xl font-bold">{budgetUsage.toFixed(1)}%</h2>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <PieChartIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${budgetUsage > 80 ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending Approvals</p>
                    <h2 className="text-3xl font-bold">{expenses.filter((exp) => exp.status === "pending").length}</h2>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer
                  config={{
                    Travel: {
                      label: "Travel",
                      color: "hsl(var(--chart-1))",
                    },
                    "Office Supplies": {
                      label: "Office Supplies",
                      color: "hsl(var(--chart-2))",
                    },
                    Entertainment: {
                      label: "Entertainment",
                      color: "hsl(var(--chart-3))",
                    },
                    Utilities: {
                      label: "Utilities",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                >
                  <PieChart width={1000} height={200}>
                    <Pie 
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`var(--color-${entry.name.replace(/\s+/g, "-").toLowerCase()})`}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expense Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-80 border">
                <ChartContainer
                  config={{
                    expense: {
                      label: "Expense",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <BarChart width={1000} height={200} data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="expense" fill="#3b82f6" radius={4} />
                      </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>My Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Date</th>
                      <th className="h-10 px-4 text-left font-medium">Amount</th>
                      <th className="h-10 px-4 text-left font-medium">Category</th>
                      <th className="h-10 px-4 text-left font-medium">Project</th>
                      <th className="h-10 px-4 text-left font-medium">Status</th>
                      <th className="h-10 px-4 text-left font-medium">Receipt</th>
                      <th className="h-10 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense._id} className="border-b">
                        <td className="p-4">{expense.date}</td>
                        <td className="p-4">₹{expense.amount.toLocaleString()}</td>
                        <td className="p-4">{expense.category}</td>
                        <td className="p-4">{expense.project}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              expense.status === "approved"
                                ? "success"
                                : expense.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {expense.receipt ? (
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                          {/* // Updated Dialog usage in EmployeeDashboard.jsx */}
<Dialog>
  <DialogTrigger asChild>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleEdit(expense)}
      disabled={expense.status !== "pending"}
    >
      <Edit className="h-4 w-4" />
    </Button>
  </DialogTrigger>
  <DialogContent aria-describedby="edit-expense-description">
    <DialogHeader>
      <DialogTitle>Edit Expense</DialogTitle>
      <DialogDescription id="edit-expense-description">
        Make changes to your expense record below.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Your form fields remain the same */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-amount">Amount</Label>
          <Input
            id="edit-amount"
            name="amount"
            type="number"
            value={expenseForm.amount}
            onChange={handleInputChange}
          />
        </div>
        {/* Rest of your form fields */}
      </div>
      {/* ... */}
    </div>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setEditingExpense(null)}>
        Cancel
      </Button>
      <Button onClick={handleUpdate}>Update</Button>
    </div>
  </DialogContent>
</Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(expense._id)}
                              disabled={expense.status !== "pending"}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-gray-500">
                          No expenses found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Add Expense Tab */}
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-10"
                        value={expenseForm.amount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        className="pl-10"
                        value={expenseForm.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={expenseForm.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project">Project/Client (Optional)</Label>
                    <Select value={expenseForm.project} onValueChange={(value) => handleSelectChange("project", value)}>
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project} value={project}>
                            {project}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any additional details here..."
                    value={expenseForm.notes}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="receipt">Receipt Upload (Optional)</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag and drop your receipt here, or click to browse</p>
                    <Input id="receipt" name="receipt" type="file" className="hidden" onChange={handleFileChange} />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("receipt").click()}>
                      Browse Files
                    </Button>
                    {expenseForm.receipt && (
                      <p className="text-sm text-green-600 mt-2">File selected: {expenseForm.receipt.name}</p>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Submit Expense
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default EmployeeDashboard
