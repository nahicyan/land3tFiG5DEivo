import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { PuffLoader } from "react-spinners";

// Import core components for buyer lists
import BuyerListsTable from "./BuyerListsTable";
import CreateListForm from "./CreateListForm";
import EditListForm from "./EditListForm";
import EmailForm from "./EmailForm";
import AddBuyersDialog from "./AddBuyersDialog";
import ManageMembersDialog from "./ManageMembersDialog";
import ImportCsvDialog from "./ImportCsvDialog";

// Import custom hooks from the proper location
import { useBuyerLists } from "@/components/hooks/useBuyerLists";
import useBuyers from "@/components/hooks/useBuyers.js";

export default function BuyerLists() {
  // State for dialogs and selected list
  const [createListOpen, setCreateListOpen] = useState(false);
  const [editListOpen, setEditListOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [addBuyersOpen, setAddBuyersOpen] = useState(false);
  const [manageBuyersOpen, setManageBuyersOpen] = useState(false);
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Use custom hooks for data fetching and management
  const {
    lists,
    filteredLists,
    loading: listsLoading,
    createList,
    updateList,
    deleteList,
    sendEmail,
    addBuyersToList: addBuyersToListFn,
    removeBuyersFromList,
    setListFilters,
  } = useBuyerLists();

  const {
    buyers,
    availableBuyers,
    loading: buyersLoading,
  } = useBuyers();

  // Handle search input changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setListFilters({ search: value });
  };

  // Handle opening the create list dialog
  const handleNewList = () => {
    setCreateListOpen(true);
  };

  // Handle opening the edit list dialog
  const handleEditList = (listId) => {
    const list = lists.find(l => l.id === listId);
    setSelectedList(list);
    setEditListOpen(true);
  };

  // Handle opening the email dialog
  const handleEmailList = (listId) => {
    const list = lists.find(l => l.id === listId);
    setSelectedList(list);
    setEmailDialogOpen(true);
  };

  // Handle opening the add buyers dialog
  const handleAddBuyers = (listId) => {
    const list = lists.find(l => l.id === listId);
    setSelectedList(list);
    setAddBuyersOpen(true);
  };

  // Handle opening the manage members dialog
  const handleManageMembers = (listId) => {
    const list = lists.find(l => l.id === listId);
    setSelectedList(list);
    setManageBuyersOpen(true);
  };

  // Handle CSV import
  const handleImportCsv = () => {
    setCsvUploadOpen(true);
  };

  // Handle adding buyers to a list
  const handleAddBuyersToList = async (listId, buyerIds) => {
    try {
      await addBuyersToListFn(listId, buyerIds);
      setAddBuyersOpen(false);
    } catch (error) {
      console.error("Error adding buyers to list:", error);
    }
  };

  // Loading state
  if (listsLoading || buyersLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#324c48] mb-2">Buyer Lists</h1>
        <p className="text-gray-600">
          Create and manage lists of buyers grouped by area and type for targeted emails
        </p>
      </div>

      {/* Main Content */}
      <Card className="border-[#324c48]/20">
        {/* Table with search and actions */}
        <BuyerListsTable
          lists={filteredLists}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onNewList={handleNewList}
          onEditList={handleEditList}
          onEmailList={handleEmailList}
          onAddBuyers={handleAddBuyers}
          onManageMembers={handleManageMembers}
          onDeleteList={deleteList}
        />
      </Card>

      {/* Dialogs */}
      <CreateListForm
        open={createListOpen}
        onOpenChange={setCreateListOpen}
        onCreateList={createList}
        onImportCsv={handleImportCsv}
      />

      <EditListForm
        open={editListOpen}
        onOpenChange={setEditListOpen}
        selectedList={selectedList}
        onUpdateList={updateList}
        onImportCsv={handleImportCsv}
      />

      <EmailForm
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        selectedList={selectedList}
        onSendEmail={(emailData) => sendEmail(selectedList?.id, emailData)}
      />

      <AddBuyersDialog
        open={addBuyersOpen}
        onOpenChange={setAddBuyersOpen}
        selectedList={selectedList}
        availableBuyers={availableBuyers}
        onAddBuyers={(buyerIds) => handleAddBuyersToList(selectedList?.id, buyerIds)}
        onImportCsv={handleImportCsv}
      />

      <ManageMembersDialog
        open={manageBuyersOpen}
        onOpenChange={setManageBuyersOpen}
        selectedList={selectedList}
        onRemoveMembers={(buyerIds) => removeBuyersFromList(selectedList?.id, buyerIds)}
        onAddBuyers={() => setAddBuyersOpen(true)}
      />

      <ImportCsvDialog
        open={csvUploadOpen}
        onOpenChange={setCsvUploadOpen}
        onImport={(csvData, options) => {
          // Handle CSV import based on context
          if (selectedList) {
            // Add to existing list
            addBuyersToListFn(selectedList.id, csvData.map(buyer => buyer.id));
          }
          setCsvUploadOpen(false);
        }}
      />
    </div>
  );
}