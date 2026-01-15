import {
  Download,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  MoreVertical,
  X,
  MapPinOff,
  MapPin,       // Added for UI
  User,         // Added for UI
  CarFront,     // Added for UI
  Calendar,     // Added for UI
  CreditCard    // Added for UI
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useState } from "react";
import { useTransactionsFilters } from "@/hook/useManagementFilter";
import GenericFilter from "../shared/GenericFilter";

const TransactionsManagement = ({ transactions, darkMode, cardClasses }) => {

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchTerm, setSearchTerm, filters, filteredData } =
    useTransactionsFilters(transactions);

  const handleViewDetails = (txn) => {
    setSelectedTransaction(txn);
    setIsModalOpen(true);
  };

  const DetailLabel = ({ children }) => (
    <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
      {children}
    </p>
  );

  const DetailValue = ({ children, className = "" }) => (
    <p className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-800"} ${className}`}>
      {children}
    </p>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Transactions</h2>
          <p
            className={`${darkMode ? "text-slate-400" : "text-slate-600"} mt-1`}
          >
            View and manage all payment transactions
          </p>
        </div>
        <Button className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
          <Download size={16} className="mr-2" />
          Export CSV
        </Button>
      </div>

      <GenericFilter
        searchPlaceholder="Search transactions..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        darkMode={darkMode}
        showAdvancedFilters={true}
      />

      <Card className={cardClasses}>
        <Table>
          <TableHeader>
            <TableRow className={darkMode ? "border-slate-800" : ""}>
              <TableHead>User</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Car Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64">
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="bg-slate-50 p-4 rounded-full mb-4 ring-1 ring-slate-100 shadow-sm">
                      <MapPinOff className="h-8 w-8 text-slate-400" />
                    </div>

                    <h3
                      className={`text-lg font-semibold ${
                        darkMode ? "text-slate-300" : "text-slate-900"
                      }  mb-1`}
                    >
                      No transaction found
                    </h3>

                    <p className="text-sm text-slate-500 max-w-xs text-center">
                      We couldn't find any transaction matching your search.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData?.map((txn) => (
                <TableRow
                  key={txn.id}
                  className={darkMode ? "border-slate-800" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${
                          darkMode ? "bg-slate-700" : "bg-slate-200"
                        } flex items-center justify-center font-semibold`}
                      >
                        {txn.user?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold">{txn.user}</p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {txn.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{txn.route}</TableCell>
                  <TableCell>{txn.carType}</TableCell>
                  <TableCell className="font-bold">
                    ₹{txn.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        txn.status === "success"
                          ? "default"
                          : txn.status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        txn.status === "success" ? "bg-emerald-500" : ""
                      }
                    >
                      {txn.status === "success" && (
                        <CheckCircle size={14} className="mr-1" />
                      )}
                      {txn.status === "failed" && (
                        <XCircle size={14} className="mr-1" />
                      )}
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(txn)}
                        >
                          <Eye size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download size={14} className="mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className={`${
            darkMode
              ? "bg-slate-950 text-slate-100 border-slate-800"
              : "bg-white"
          } max-w-2xl p-0 overflow-hidden shadow-2xl`}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CreditCard size={20} className="text-slate-500" />
              Transaction Details
            </DialogTitle>
            <DialogDescription
              className={darkMode ? "text-slate-400" : "text-slate-600"}
            >
              Receipt ID: #{selectedTransaction?.id || "N/A"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[80vh] bg-slate-50/50 dark:bg-slate-900/50">
            {selectedTransaction && (
              <div className="p-6 space-y-6">
                
                <Card className={`${cardClasses} p-6 border-0 shadow-sm relative overflow-hidden bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-l-4 border-l-emerald-500`}>
                  <div className="flex flex-col items-center justify-center text-center space-y-2 relative z-10">
                    <DetailLabel>Total Paid Amount</DetailLabel>
                    <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{selectedTransaction.amount.toLocaleString()}
                    </h1>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className={`bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 px-3 py-1`}>
                        <CheckCircle size={14} className="mr-1.5" />
                        {selectedTransaction.status}
                      </Badge>
                      <div className={`text-sm flex items-center gap-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        <Calendar size={14} />
                        {selectedTransaction.date}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <User size={16} className="text-blue-500" />
                      Customer Information
                    </h3>
                    <Card className={`p-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                      <div className="space-y-4">
                        <div>
                          <DetailLabel>Name</DetailLabel>
                          <DetailValue>{selectedTransaction.user}</DetailValue>
                        </div>
                        <div>
                          <DetailLabel>Email Address</DetailLabel>
                          <DetailValue>{selectedTransaction.email}</DetailValue>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <CarFront size={16} className="text-purple-500" />
                      Vehicle Details
                    </h3>
                    <Card className={`p-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <DetailLabel>Car Model</DetailLabel>
                          <DetailValue>{selectedTransaction.carModel} <span className="text-xs text-slate-500">({selectedTransaction.carType})</span></DetailValue>
                        </div>
                        <div>
                          <DetailLabel>Capacity</DetailLabel>
                          <DetailValue>{selectedTransaction.capacity} Pax</DetailValue>
                        </div>
                        <div>
                          <DetailLabel>Luggage</DetailLabel>
                          <DetailValue>{selectedTransaction.luggage} Bags</DetailValue>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <MapPin size={16} className="text-orange-500" />
                      Trip Route Details
                    </h3>
                    
                    <Card className={`p-5 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                      <div className="flex flex-col gap-6 relative">
                        <div className={`absolute left-2.75 top-3 bottom-8 w-0.5 border-l-2 border-dashed ${darkMode ? "border-slate-700" : "border-slate-200"}`} />

                        <div className="flex gap-4">
                          <div className="relative z-10 mt-1">
                             <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                               <div className="w-2 h-2 rounded-full bg-current" />
                             </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">Pickup</span>
                                <span className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{selectedTransaction.from}</span>
                            </div>
                            <div className={`p-3 rounded-lg text-sm leading-relaxed border ${darkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-700"}`}>
                              {selectedTransaction.pickupSubLocation || "N/A"}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="relative z-10 mt-1">
                             <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                               <MapPin size={12} className="fill-current" />
                             </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">Drop Off</span>
                                <span className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{selectedTransaction.to}</span>
                            </div>
                             <div className={`p-3 rounded-lg text-sm leading-relaxed border ${darkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-700"}`}>
                              {selectedTransaction.dropSubLocation || "N/A"}
                            </div>
                          </div>
                        </div>

                        <div className={`pt-4 mt-2 border-t flex justify-between items-center ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                           <DetailLabel>Trip Type</DetailLabel>
                           <Badge variant="secondary" className="capitalize">
                             {selectedTransaction.tripType}
                           </Badge>
                        </div>
                      </div>
                    </Card>
                </div>

                {selectedTransaction.completedAt && (
                  <div className={`flex items-center gap-3 p-4 rounded-lg border ${darkMode ? "bg-green-950/20 border-green-900/50" : "bg-green-50 border-green-200"}`}>
                    <CheckCircle size={20} className="text-green-500" />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-green-400" : "text-green-800"}`}>Trip Completed Successfully</p>
                      <p className={`text-xs ${darkMode ? "text-green-500/70" : "text-green-600/70"}`}>
                        {new Date(selectedTransaction.completedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsManagement;