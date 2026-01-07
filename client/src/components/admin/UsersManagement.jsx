import {
  Edit,
  Eye,
  MoreVertical,
  X,
  Calendar,
  CreditCard,
  MapPin,
  MapPinOff,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import { useUsersFilters } from "@/hook/useManagementFilter";
import GenericFilter from "../shared/GenericFilter";

const UsersManagement = ({ users, darkMode, cardClasses }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { searchTerm, setSearchTerm, filters, filteredData } =
    useUsersFilters(users);

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Users Management</h2>
          <p
            className={`${darkMode ? "text-slate-400" : "text-slate-600"} mt-1`}
          >
            View and manage registered users
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: users?.length, color: "blue" },
          {
            label: "Active Users",
            value: users?.filter((u) => u.status === "active").length,
            color: "emerald",
          },
          {
            label: "Total Bookings",
            value: users?.reduce((acc, u) => acc + u.totalBookings, 0),
            color: "amber",
          },
        ].map((stat, idx) => (
          <Card key={idx} className={`${cardClasses} p-6`}>
            <p
              className={`text-sm ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {stat.label}
            </p>
            <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
          </Card>
        ))}
      </div>

      <GenericFilter
        searchPlaceholder="Search users..."
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
              <TableHead>Provider</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64">
                  <div className="flex flex-col items-center justify-center  h-full py-12">
                    <div className="bg-slate-50 p-4 rounded-full mb-4 ring-1 ring-slate-100 shadow-sm">
                      <MapPinOff className="h-8 w-8 text-slate-400" />
                    </div>

                    <h3
                      className={`text-lg font-semibold ${
                        darkMode ? "text-slate-200" : "text-slate-900"
                      } mb-1`}
                    >
                      No users found
                    </h3>

                    <p
                      className={`text-sm ${
                        darkMode ? "text-slate-300 " : "text-slate-500"
                      } max-w-xs text-center`}
                    >
                      We couldn't find any users matching your search.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData?.map((user) => (
                <TableRow
                  key={user.id}
                  className={darkMode ? "border-slate-800" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${
                          darkMode ? "bg-slate-700" : "bg-slate-200"
                        } flex items-center justify-center font-semibold`}
                      >
                        {user.displayName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-semibold">{user.displayName}</p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.provider}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.totalBookings} trips</Badge>
                  </TableCell>
                  <TableCell className="font-bold">
                    ₹{user.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                      className={
                        user.status === "active" ? "bg-emerald-500" : ""
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinedDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewProfile(user)}
                        >
                          <Eye size={14} className="mr-2" />
                          View Profile
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={`max-w-4xl max-h-[90vh] p-0 ${
            darkMode
              ? "bg-slate-900 text-slate-100 border-slate-800"
              : "bg-white"
          }`}
        >
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-2xl">User Profile</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-80px)] px-6 pb-6">
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-20 h-20 rounded-full ${
                      darkMode ? "bg-slate-700" : "bg-slate-200"
                    } flex items-center justify-center text-3xl font-bold`}
                  >
                    {selectedUser.displayName?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">
                      {selectedUser.displayName}
                    </h3>
                    <p
                      className={`${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {selectedUser.email}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge
                        variant={
                          selectedUser.status === "active"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          selectedUser.status === "active"
                            ? "bg-emerald-500"
                            : ""
                        }
                      >
                        {selectedUser.status}
                      </Badge>
                      <Badge variant="outline">{selectedUser.provider}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card className={`${cardClasses} p-4`}>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {selectedUser.totalBookings}
                    </p>
                  </Card>
                  <Card className={`${cardClasses} p-4`}>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Total Spent
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      ₹{selectedUser.totalSpent.toLocaleString()}
                    </p>
                  </Card>
                  <Card className={`${cardClasses} p-4`}>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Joined
                    </p>
                    <p className="text-lg font-bold mt-1">
                      {selectedUser.joinedDate}
                    </p>
                  </Card>
                </div>

                <Tabs defaultValue="bookings" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="bookings" className="flex-1">
                      <Calendar size={16} className="mr-2" />
                      Bookings ({selectedUser.bookings?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="transactions" className="flex-1">
                      <CreditCard size={16} className="mr-2" />
                      Transactions ({selectedUser.transactions?.length || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="bookings" className="space-y-4 mt-4">
                    {selectedUser.bookings &&
                    selectedUser.bookings.length > 0 ? (
                      selectedUser.bookings.map((booking) => (
                        <Card key={booking.id} className={`${cardClasses} p-4`}>
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-blue-500" />
                                <span className="font-semibold">
                                  {booking.from} → {booking.to}
                                </span>
                              </div>
                              <div className="flex gap-4 text-sm">
                                <span
                                  className={
                                    darkMode
                                      ? "text-slate-400"
                                      : "text-slate-600"
                                  }
                                >
                                  {booking.carName} - {booking.carModel}
                                </span>
                                <span
                                  className={
                                    darkMode
                                      ? "text-slate-400"
                                      : "text-slate-600"
                                  }
                                >
                                  {booking.tripType}
                                </span>
                              </div>
                              <div className="flex gap-4 text-sm">
                                <span
                                  className={
                                    darkMode
                                      ? "text-slate-400"
                                      : "text-slate-600"
                                  }
                                >
                                  Capacity: {booking.capacity}
                                </span>
                                <span
                                  className={
                                    darkMode
                                      ? "text-slate-400"
                                      : "text-slate-600"
                                  }
                                >
                                  Luggage: {booking.luggage}
                                </span>
                              </div>
                              <p
                                className={`text-xs ${
                                  darkMode ? "text-slate-500" : "text-slate-500"
                                }`}
                              >
                                {new Date(booking.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  booking.status === "completed"
                                    ? "default"
                                    : booking.status === "pending"
                                    ? "secondary"
                                    : "outline"
                                }
                                className={
                                  booking.status === "completed"
                                    ? "bg-emerald-500"
                                    : booking.status === "pending"
                                    ? "bg-amber-500"
                                    : ""
                                }
                              >
                                {booking.status}
                              </Badge>
                              <p className="font-bold text-lg mt-2">
                                ₹{booking.amount?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p
                        className={`text-center py-8 ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        No bookings found
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="transactions" className="space-y-4 mt-4">
                    {selectedUser.transactions &&
                    selectedUser.transactions.length > 0 ? (
                      selectedUser.transactions.map((transaction) => (
                        <Card
                          key={transaction.id}
                          className={`${cardClasses} p-4`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <p
                                className={`text-sm ${
                                  darkMode ? "text-slate-400" : "text-slate-600"
                                }`}
                              >
                                {transaction.route ||
                                  `${transaction.from} → ${transaction.to}`}
                              </p>
                              <p
                                className={`text-xs ${
                                  darkMode ? "text-slate-500" : "text-slate-500"
                                }`}
                              >
                                {new Date(transaction.date).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant="default"
                                className="bg-emerald-500"
                              >
                                {transaction.status}
                              </Badge>
                              <p className="font-bold text-lg mt-2">
                                ₹{transaction.amount?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p
                        className={`text-center py-8 ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        No transactions found
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
