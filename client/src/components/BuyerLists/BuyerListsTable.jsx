import React from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Mail, 
  PlusCircle, 
  Trash2, 
  Edit, 
  Users,
  UserPlus
} from "lucide-react";

// Define the list table component
export default function BuyerListsTable({ 
  lists, 
  searchQuery, 
  onSearchChange, 
  onNewList, 
  onEditList, 
  onEmailList, 
  onAddBuyers, 
  onManageMembers, 
  onDeleteList 
}) {
  return (
    <>
      <CardHeader className="bg-[#f0f5f4] border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Buyer Lists</CardTitle>
          
          <div className="flex gap-2">
            <Button
              className="bg-[#324c48] text-white"
              onClick={onNewList}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New List
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative max-w-sm mx-auto sm:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 border-[#324c48]/30"
            />
          </div>
        </div>
        
        {/* Lists Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>List Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead className="text-center">Buyers</TableHead>
                <TableHead>Last Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lists.length > 0 ? (
                lists.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell className="font-medium">
                      {list.name}
                    </TableCell>
                    <TableCell>
                      {list.description}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {list.criteria && list.criteria.areas && list.criteria.areas.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {list.criteria.areas.map((area, idx) => (
                              <Badge key={idx} variant="outline" className="bg-[#f0f5f4] text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {list.criteria && list.criteria.buyerTypes && list.criteria.buyerTypes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {list.criteria.buyerTypes.map((type, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className={`
                                  text-xs
                                  ${type === 'CashBuyer' ? 'bg-green-100 text-green-800' : ''}
                                  ${type === 'Investor' ? 'bg-blue-100 text-blue-800' : ''}
                                  ${type === 'Realtor' ? 'bg-purple-100 text-purple-800' : ''}
                                  ${type === 'Builder' ? 'bg-orange-100 text-orange-800' : ''}
                                  ${type === 'Developer' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${type === 'Wholesaler' ? 'bg-indigo-100 text-indigo-800' : ''}
                                `}
                              >
                                {type}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {list.criteria && list.criteria.isVIP && (
                          <Badge className="bg-[#D4A017] text-white text-xs">VIP Only</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xl font-semibold">{list.buyerCount}</span>
                    </TableCell>
                    <TableCell>
                      {list.lastEmailDate ? (
                        <span className="text-sm">
                          {new Date(list.lastEmailDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#324c48]"
                          onClick={() => onEmailList(list.id)}
                        >
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#324c48]"
                          onClick={() => onAddBuyers(list.id)}
                        >
                          <UserPlus className="h-4 w-4" />
                          <span className="sr-only">Add Buyers</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#324c48]"
                          onClick={() => onManageMembers(list.id)}
                        >
                          <Users className="h-4 w-4" />
                          <span className="sr-only">Manage Members</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#324c48]"
                          onClick={() => onEditList(list.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => onDeleteList(list.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchQuery ? "No lists match your search." : "No buyer lists found. Create your first list!"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </>
  );
}