import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Save,
  Filter,
  MapPinOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  createPricing,
  updatePricing,
  deletePricing,
  fetchAllPricing,
} from "../../store/slices/pricingSlice";
import { fetchRoutes } from "../../store/slices/routeSlice";
import { usePricingFilters } from "@/hook/useManagementFilter";
import GenericFilter from "../shared/GenericFilter";

const PricingManagement = ({ darkMode, cardClasses }) => {
  const dispatch = useDispatch();
  const { pricing, loading } = useSelector((state) => state.pricing);
  const { routes } = useSelector((state) => state.routes);
  const { searchTerm, setSearchTerm, filters, filteredData } =
    usePricingFilters(pricing);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [formData, setFormData] = useState({
    routeId: "",
    carType: "",
    carModel: "",
    capacity: "",
    luggage: "",
    price: "",
    pricePerKm: "",
    tripType: "one-way",
    features: "",
    minKm: "",
  });
  console.log("routes", routes);

  useEffect(() => {
    dispatch(fetchRoutes());
    dispatch(fetchAllPricing());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!formData.routeId || !formData.carType || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    const selectedRoute = routes.find((r) => r.id === formData.routeId);

    if (!selectedRoute) {
      toast.error("Selected route not found");
      return;
    }

    const pricingData = {
      routeId: selectedRoute.id,
      route: `${selectedRoute.from} → ${selectedRoute.to}`,
      routeFrom: selectedRoute.from,
      routeTo: selectedRoute.to,
      airport: selectedRoute.airport || "",
      carType: formData.carType.trim(),
      carModel: formData.carModel.trim() || "",
      capacity: parseInt(formData.capacity) || 0,
      luggage: formData.luggage.trim() || "",
      price: parseFloat(formData.price),
      pricePerKm: parseFloat(formData.pricePerKm) || 0,
      tripType: formData.tripType,
      features: formData.features
        ? formData.features.split(",").map((f) => f.trim())
        : [],
      minKm: formData.tripType === "round-trip" ? formData.minKm : "",
      imageUrl: selectedRoute.imageUrl || "",
    };

    try {
      if (editingPrice) {
        await dispatch(
          updatePricing({
            pricingId: editingPrice.id,
            updates: pricingData,
          })
        ).unwrap();
        toast.success("Pricing updated successfully!");
      } else {
        await dispatch(createPricing(pricingData)).unwrap();
        toast.success("Pricing created successfully!");
      }

      setShowDialog(false);
      resetForm();
    } catch (error) {
      toast.error(error || "Operation failed");
    }
  };

  const handleEdit = (price) => {
    setEditingPrice(price);
    setFormData({
      routeId: price.routeId || "",
      carType: price.carType,
      carModel: price.carModel || "",
      capacity: price.capacity?.toString() || "",
      luggage: price.luggage || "",
      price: price.price.toString(),
      pricePerKm: price.pricePerKm?.toString() || "",
      tripType: price.tripType || "one-way",
      features: Array.isArray(price.features) ? price.features.join(", ") : "",
      minKm: price.minKm || "",
    });
    setShowDialog(true);
  };

  const handleDelete = async (pricingId) => {
    if (!window.confirm("Are you sure you want to delete this pricing?"))
      return;

    try {
      await dispatch(deletePricing(pricingId)).unwrap();
      toast.success("Pricing deleted successfully!");
    } catch (error) {
      toast.error(error || "Failed to delete pricing");
    }
  };

  const resetForm = () => {
    setEditingPrice(null);
    setFormData({
      routeId: "",
      carType: "",
      carModel: "",
      capacity: "",
      luggage: "",
      price: "",
      pricePerKm: "",
      tripType: "one-way",
      features: "",
      minKm: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Pricing Management</h2>
          <p
            className={`${darkMode ? "text-slate-400" : "text-slate-600"} mt-1`}
          >
            Configure pricing for different routes and car types
          </p>
        </div>

        <Dialog
          open={showDialog}
          onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
              <Plus size={16} className="mr-2" />
              Add New Pricing
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`${
              darkMode
                ? "bg-slate-900 text-slate-100 border-slate-800"
                : "bg-white"
            } max-w-2xl max-h-[90vh] overflow-y-auto`}
          >
            <DialogHeader>
              <DialogTitle>
                {editingPrice ? "Edit Pricing" : "Create New Pricing"}
              </DialogTitle>
              <DialogDescription>
                Set pricing details for a specific route and car type
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Route *</Label>
                <Select
                  value={formData.routeId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, routeId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes
                      .filter((r) => r.active)
                      .map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.from} → {route.to}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Trip Type *</Label>
                <Select
                  value={formData.tripType}
                  onValueChange={(val) =>
                    setFormData({ ...formData, tripType: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-way">One-Way</SelectItem>
                    <SelectItem value="round-trip">Round Trip</SelectItem>
                    <SelectItem value="multi-city">Multi City</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Car Type *</Label>
                  <Input
                    value={formData.carType}
                    onChange={(e) =>
                      setFormData({ ...formData, carType: e.target.value })
                    }
                    placeholder="Comfort Sedan"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Car Model</Label>
                  <Input
                    value={formData.carModel}
                    onChange={(e) =>
                      setFormData({ ...formData, carModel: e.target.value })
                    }
                    placeholder="Dzire, Etios"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Capacity (Passengers)</Label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    placeholder="4"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Luggage</Label>
                  <Input
                    value={formData.luggage}
                    onChange={(e) =>
                      setFormData({ ...formData, luggage: e.target.value })
                    }
                    placeholder="2 Large"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fixed Price (₹) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="2499"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price per KM (₹)</Label>
                  <Input
                    type="number"
                    value={formData.pricePerKm}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerKm: e.target.value })
                    }
                    placeholder="11"
                  />
                </div>
              </div>

              {formData.tripType === "round-trip" && (
                <div className="space-y-2">
                  <Label>Minimum KM per Day</Label>
                  <Input
                    value={formData.minKm}
                    onChange={(e) =>
                      setFormData({ ...formData, minKm: e.target.value })
                    }
                    placeholder="250km / day"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Features (comma-separated)</Label>
                <Input
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="AC Included, No Hidden Charges, Music System"
                />
                <p className="text-xs text-slate-500">
                  Enter features separated by commas
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              >
                <Save size={16} className="mr-2" />
                {loading ? "Saving..." : editingPrice ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <GenericFilter
        searchPlaceholder="Search pricing..."
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
              <TableHead>Route</TableHead>
              <TableHead>Car Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Per KM</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64">
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="bg-slate-50 p-4 rounded-full mb-4 ring-1 ring-slate-100 shadow-sm">
                      <MapPinOff className="h-8 w-8 text-slate-400" />
                    </div>

                    <h3
                      className={`text-lg font-semibold ${
                        darkMode ? "text-slate-200" : "text-slate-900"
                      } mb-1`}
                    >
                      No pricing found
                    </h3>

                    <p className="text-sm text-slate-500 max-w-xs text-center">
                      We couldn't find any pricing matching your search.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((price) => (
                <TableRow
                  key={price.id}
                  className={darkMode ? "border-slate-800" : ""}
                >
                  <TableCell>
                    <p className="font-semibold">{price.route}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{price.carType}</p>
                      {price.carModel && (
                        <p
                          className={`text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {price.carModel}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {price.capacity ? `${price.capacity} passengers` : "N/A"}
                  </TableCell>
                  <TableCell className="font-bold text-emerald-600">
                    ₹{price.price}
                  </TableCell>
                  <TableCell>
                    {price.pricePerKm ? `₹${price.pricePerKm}/km` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{price.tripType}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(price)}>
                          <Edit size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(price.id)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
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
    </div>
  );
};

export default PricingManagement;
