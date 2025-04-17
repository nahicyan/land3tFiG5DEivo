import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getAllQualifications } from "@/utils/api";
import { format } from "date-fns";

export default function QualificationsDashboard() {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0
  });
  const [filter, setFilter] = useState({ qualified: undefined });
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch qualifications on component mount and when filters change
  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        setLoading(true);
        // Build a filters object that only includes 'qualified' if it’s defined.
        const filters = { search: searchQuery };
        if (filter.qualified !== undefined) {
          filters.qualified = filter.qualified;
        }
        const data = await getAllQualifications(
          pagination.page,
          pagination.limit,
          filters
        );
        setQualifications(data.qualifications);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching qualifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQualifications();
  }, [pagination.page, pagination.limit, filter, searchQuery]);


  // Format currency for display
  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return `$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  // Column definitions for the table
  const columns = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
    },
    {
      accessorKey: "firstName",
      header: "Applicant",
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      accessorKey: "qualified",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={row.original.qualified ?
            "bg-green-100 text-green-800" :
            "bg-red-100 text-red-800"
          }
        >
          {row.original.qualified ? "Qualified" : "Not Qualified"}
        </Badge>
      ),
    },
    {
      accessorKey: "propertyAddress",
      header: "Property",
      cell: ({ row }) => row.original.propertyAddress || "N/A",
    },
    {
      accessorKey: "propertyPrice",
      header: "Price",
      cell: ({ row }) => formatCurrency(row.original.propertyPrice),
    },
    {
      accessorKey: "monthlyPayment",
      header: "Payment",
      cell: ({ row }) => formatCurrency(row.original.monthlyPayment),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedQualification(row.original)}
        >
          View
        </Button>
      ),
    },
  ];

  // React Table setup
  const table = useReactTable({
    data: qualifications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function'
        ? updater({
          pageIndex: pagination.page - 1,
          pageSize: pagination.limit
        })
        : updater;

      setPagination(prev => ({
        ...prev,
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize,
      }));
    },
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Qualification Applications</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => handleFilterChange("qualified", undefined)}>
            All Applications
          </TabsTrigger>
          <TabsTrigger value="qualified" onClick={() => handleFilterChange("qualified", true)}>
            Qualified
          </TabsTrigger>
          <TabsTrigger value="not-qualified" onClick={() => handleFilterChange("qualified", false)}>
            Not Qualified
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Search by name, email, phone, or address..."
                  className="max-w-xs"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <Select
                  value={pagination.limit.toString()}
                  onValueChange={(val) => setPagination(prev => ({ ...prev, limit: parseInt(val) }))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table using shadcn components */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualified" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Qualified Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {/* We'll reuse the same table structure but the filter is already applied */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No qualified applications found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Same pagination controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="not-qualified" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Not Qualified Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Again, same table structure with filter applied */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No non-qualified applications found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Same pagination controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Qualification Details Modal/Dialog */}
      {selectedQualification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex justify-between">
                <span>
                  Application Details - {selectedQualification.firstName} {selectedQualification.lastName}
                </span>
                <button
                  onClick={() => setSelectedQualification(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </h2>

              {/* Status Badge */}
              <div className="mb-6">
                <Badge
                  className={`text-base py-1 px-3 ${selectedQualification.qualified ?
                    "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"}`
                  }
                >
                  {selectedQualification.qualified ? "QUALIFIED" : "NOT QUALIFIED"}
                </Badge>

                {!selectedQualification.qualified && selectedQualification.disqualificationReason && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-md">
                    <h3 className="font-semibold text-red-700">Disqualification Reason:</h3>
                    <p className="text-red-700">{selectedQualification.disqualificationReason}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Property Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <p className="font-semibold">Owner ID:</p>
                      <p>{selectedQualification.ownerId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Address:</p>
                      <p>{selectedQualification.propertyAddress || 'N/A'}</p>
                      <p>{selectedQualification.propertyCity}, {selectedQualification.propertyState} {selectedQualification.propertyZip}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Property Price:</p>
                      <p>{formatCurrency(selectedQualification.propertyPrice)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Financing Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Financing Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <p className="font-semibold">Monthly Payment:</p>
                      <p>{formatCurrency(selectedQualification.monthlyPayment)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Down Payment:</p>
                      <p>{formatCurrency(selectedQualification.downPayment)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Interest Rate:</p>
                      <p>{selectedQualification.interestRate ? `${selectedQualification.interestRate}%` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Loan Amount:</p>
                      <p>{formatCurrency(selectedQualification.loanAmount)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Term:</p>
                      <p>{selectedQualification.term ? `${selectedQualification.term} months` : 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Applicant Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Applicant Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <p className="font-semibold">Name:</p>
                      <p>{selectedQualification.firstName} {selectedQualification.lastName}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Email:</p>
                      <p>{selectedQualification.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Phone:</p>
                      <p>{selectedQualification.phone}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Employment Status:</p>
                      <p>{selectedQualification.employmentStatus || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Credit Score:</p>
                      <p>{selectedQualification.currentCreditScore || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Income:</p>
                      <p>{selectedQualification.grossAnnualIncome || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Survey Responses */}
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Survey Responses</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <p className="font-semibold">Language:</p>
                      <p>{selectedQualification.language || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Home Usage:</p>
                      <p>{selectedQualification.homeUsage || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Real Estate Agent:</p>
                      <p>{selectedQualification.realEstateAgent || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Purchase Timing:</p>
                      <p>{selectedQualification.homePurchaseTiming || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Current Home:</p>
                      <p>{selectedQualification.currentHomeOwnership || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Current on Payments:</p>
                      <p>{selectedQualification.currentOnAllPayments || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Monthly Debts:</p>
                      <p>{formatCurrency(selectedQualification.totalMonthlyPayments)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Income History:</p>
                      <p>{selectedQualification.incomeHistory || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Verify Income:</p>
                      <p>{selectedQualification.verifyIncome || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Bankruptcy:</p>
                      <p>{selectedQualification.declaredBankruptcy || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Foreclosure:</p>
                      <p>{selectedQualification.foreclosureForbearance || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Liens/Judgments:</p>
                      <p>{selectedQualification.liensOrJudgments || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Application Date:</p>
                      <p>{format(new Date(selectedQualification.createdAt), "PPpp")}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedQualification(null)}>Close</Button>
                <Button
                  onClick={() => window.location.href = `mailto:${selectedQualification.email}`}
                >
                  Contact Applicant
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}