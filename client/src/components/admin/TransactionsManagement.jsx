import {
  Download,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  MoreVertical,
  X,
  MapPinOff,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
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
  // const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("tx inside management: ", transactions);
  const { searchTerm, setSearchTerm, filters, filteredData } =
    useTransactionsFilters(transactions);

  // const filteredTransactions = transactions?.filter((txn) => {
  //   const matchesSearch =
  //     txn.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     txn.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     txn.paymentId.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesStatus = filterStatus === "all" || txn.status === filterStatus;
  //   return matchesSearch && matchesStatus;
  // });

  const handleViewDetails = (txn) => {
    setSelectedTransaction(txn);
    setIsModalOpen(true);
  };

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

                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-900'}  mb-1`}>
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
              ? "bg-slate-900 text-slate-100 border-slate-800"
              : "bg-white"
          } max-w-2xl p-0`}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <DialogTitle className="text-2xl font-bold">
              Transaction Details
            </DialogTitle>
            <DialogDescription
              className={darkMode ? "text-slate-400" : "text-slate-600"}
            >
              Complete information about this transaction
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] px-6 pb-6">
            {selectedTransaction && (
              <div className="space-y-6 pt-4">
                <Card
                  className={`${cardClasses} p-6 border-2 border-emerald-500/20 bg-linear-to-br from-emerald-500/10 to-transparent`}
                >
                  <p
                    className={`text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    } mb-2`}
                  >
                    Transaction Amount
                  </p>
                  <p className="text-4xl font-bold text-emerald-500">
                    ₹{selectedTransaction.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="default" className="bg-emerald-500">
                      <CheckCircle size={14} className="mr-1" />
                      {selectedTransaction.status}
                    </Badge>
                    <span
                      className={`text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {selectedTransaction.date}
                    </span>
                  </div>
                </Card>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    Customer Information
                  </h3>
                  <Card className={`${cardClasses} p-4`}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                        <span
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Name
                        </span>
                        <span className="font-medium">
                          {selectedTransaction.user}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Email
                        </span>
                        <span className="font-medium text-sm">
                          {selectedTransaction.email}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                    Trip Details
                  </h3>
                  <Card className={`${cardClasses} p-4`}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                        <span
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Route
                        </span>
                        <span className="font-medium text-right">
                          {selectedTransaction.from} → {selectedTransaction.to}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                        <span
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Trip Type
                        </span>
                        <span className="font-medium capitalize">
                          {selectedTransaction.tripType}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                        <span
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Vehicle
                        </span>
                        <span className="font-medium">
                          {selectedTransaction.carType} -{" "}
                          {selectedTransaction.carModel}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                        <span
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Capacity
                        </span>
                        <span className="font-medium">
                          {selectedTransaction.capacity} passengers
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Luggage
                        </span>
                        <span className="font-medium">
                          {selectedTransaction.luggage} bags
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {selectedTransaction.completedAt && (
                  <Card
                    className={`${cardClasses} p-4 border-l-4 border-l-green-500`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <div>
                        <p className="font-medium">Trip Completed</p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {new Date(
                            selectedTransaction.completedAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
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
