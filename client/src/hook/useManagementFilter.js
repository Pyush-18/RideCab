import { useState, useMemo } from "react";

export const useUsersFilters = (users = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterBookings, setFilterBookings] = useState('all');
  const [filterSpending, setFilterSpending] = useState('all');

  const providerOptions = useMemo(() => {
    const providers = new Set(users?.map(u => u.provider).filter(Boolean));
    return [
      { value: 'all', label: 'All Providers' },
      ...Array.from(providers).map(prov => ({ value: prov, label: prov }))
    ];
  }, [users]);

  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: filterStatus,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      onChange: setFilterStatus,
      primary: true,
    },
    {
      id: 'provider',
      label: 'Auth Provider',
      type: 'select',
      value: filterProvider,
      options: providerOptions,
      onChange: setFilterProvider,
      primary: true,
    },
    {
      id: 'bookings',
      label: 'Booking Count',
      type: 'select',
      value: filterBookings,
      options: [
        { value: 'all', label: 'All Bookings' },
        { value: '0', label: 'No Bookings' },
        { value: '1-5', label: '1-5 Bookings' },
        { value: '6-10', label: '6-10 Bookings' },
        { value: '10+', label: '10+ Bookings' },
      ],
      onChange: setFilterBookings,
      primary: false,
    },
    {
      id: 'spending',
      label: 'Total Spent',
      type: 'select',
      value: filterSpending,
      options: [
        { value: 'all', label: 'All Amounts' },
        { value: '0-5000', label: '₹0 - ₹5,000' },
        { value: '5000-10000', label: '₹5,000 - ₹10,000' },
        { value: '10000-25000', label: '₹10,000 - ₹25,000' },
        { value: '25000+', label: '₹25,000+' },
      ],
      onChange: setFilterSpending,
      primary: false,
    },
  ];

  const filteredData = useMemo(() => {
    return users?.filter((user) => {
      const matchesSearch = 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesProvider = filterProvider === 'all' || user.provider === filterProvider;
      
      let matchesBookings = true;
      if (filterBookings !== 'all') {
        const bookingCount = user.totalBookings || 0;
        if (filterBookings === '0') matchesBookings = bookingCount === 0;
        else if (filterBookings === '1-5') matchesBookings = bookingCount >= 1 && bookingCount <= 5;
        else if (filterBookings === '6-10') matchesBookings = bookingCount >= 6 && bookingCount <= 10;
        else if (filterBookings === '10+') matchesBookings = bookingCount > 10;
      }
      
      let matchesSpending = true;
      if (filterSpending !== 'all') {
        const spent = user.totalSpent || 0;
        if (filterSpending === '0-5000') matchesSpending = spent <= 5000;
        else if (filterSpending === '5000-10000') matchesSpending = spent > 5000 && spent <= 10000;
        else if (filterSpending === '10000-25000') matchesSpending = spent > 10000 && spent <= 25000;
        else if (filterSpending === '25000+') matchesSpending = spent > 25000;
      }

      return matchesSearch && matchesStatus && matchesProvider && matchesBookings && matchesSpending;
    });
  }, [users, searchTerm, filterStatus, filterProvider, filterBookings, filterSpending]);

  return { searchTerm, setSearchTerm, filters, filteredData };
};

export const useTransactionsFilters = (transactions = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCarType, setFilterCarType] = useState('all');
  const [filterAmountRange, setFilterAmountRange] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');

  const carTypeOptions = useMemo(() => {
    const types = new Set(transactions?.map(t => t.carType).filter(Boolean));
    return [
      { value: 'all', label: 'All Car Types' },
      ...Array.from(types).map(type => ({ value: type, label: type }))
    ];
  }, [transactions]);

  const filters = [
    {
      id: 'status',
      label: 'Payment Status',
      type: 'select',
      value: filterStatus,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'success', label: 'Success' },
        { value: 'failed', label: 'Failed' },
        { value: 'pending', label: 'Pending' },
      ],
      onChange: setFilterStatus,
      primary: true,
    },
    {
      id: 'carType',
      label: 'Car Type',
      type: 'select',
      value: filterCarType,
      options: carTypeOptions,
      onChange: setFilterCarType,
      primary: true,
    },
    {
      id: 'amount',
      label: 'Amount Range',
      type: 'select',
      value: filterAmountRange,
      options: [
        { value: 'all', label: 'All Amounts' },
        { value: '0-2000', label: '₹0 - ₹2,000' },
        { value: '2000-5000', label: '₹2,000 - ₹5,000' },
        { value: '5000-10000', label: '₹5,000 - ₹10,000' },
        { value: '10000+', label: '₹10,000+' },
      ],
      onChange: setFilterAmountRange,
      primary: false,
    },
    {
      id: 'date',
      label: 'Date Range',
      type: 'select',
      value: filterDateRange,
      options: [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' },
      ],
      onChange: setFilterDateRange,
      primary: false,
    },
  ];

  const filteredData = useMemo(() => {
    return transactions?.filter((txn) => {
      const matchesSearch =
        txn.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.route?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
      const matchesCarType = filterCarType === 'all' || txn.carType === filterCarType;

      let matchesAmount = true;
      if (filterAmountRange !== 'all') {
        const amount = txn.amount || 0;
        if (filterAmountRange === '0-2000') matchesAmount = amount <= 2000;
        else if (filterAmountRange === '2000-5000') matchesAmount = amount > 2000 && amount <= 5000;
        else if (filterAmountRange === '5000-10000') matchesAmount = amount > 5000 && amount <= 10000;
        else if (filterAmountRange === '10000+') matchesAmount = amount > 10000;
      }

      let matchesDate = true;
      if (filterDateRange !== 'all' && txn.date) {
        const txnDate = new Date(txn.date);
        const now = new Date();
        
        if (filterDateRange === 'today') {
          matchesDate = txnDate.toDateString() === now.toDateString();
        } else if (filterDateRange === 'week') {
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          matchesDate = txnDate >= weekAgo;
        } else if (filterDateRange === 'month') {
          matchesDate = txnDate.getMonth() === now.getMonth() && 
                       txnDate.getFullYear() === now.getFullYear();
        } else if (filterDateRange === 'year') {
          matchesDate = txnDate.getFullYear() === now.getFullYear();
        }
      }

      return matchesSearch && matchesStatus && matchesCarType && matchesAmount && matchesDate;
    });
  }, [transactions, searchTerm, filterStatus, filterCarType, filterAmountRange, filterDateRange]);

  return { searchTerm, setSearchTerm, filters, filteredData };
};

export const usePricingFilters = (pricing = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTripType, setFilterTripType] = useState('all');
  const [filterCarType, setFilterCarType] = useState('all');
  const [filterPriceRange, setFilterPriceRange] = useState('all');
  const [filterCapacity, setFilterCapacity] = useState('all');

  const carTypeOptions = useMemo(() => {
    const types = new Set(pricing?.map(p => p.carType).filter(Boolean));
    return [
      { value: 'all', label: 'All Car Types' },
      ...Array.from(types).map(type => ({ value: type, label: type }))
    ];
  }, [pricing]);

  const filters = [
    {
      id: 'tripType',
      label: 'Trip Type',
      type: 'select',
      value: filterTripType,
      options: [
        { value: 'all', label: 'All Trip Types' },
        { value: 'one-way', label: 'One-Way' },
        { value: 'round-trip', label: 'Round Trip' },
      ],
      onChange: setFilterTripType,
      primary: true,
    },
    {
      id: 'carType',
      label: 'Car Type',
      type: 'select',
      value: filterCarType,
      options: carTypeOptions,
      onChange: setFilterCarType,
      primary: true,
    },
    {
      id: 'price',
      label: 'Price Range',
      type: 'select',
      value: filterPriceRange,
      options: [
        { value: 'all', label: 'All Prices' },
        { value: '0-2000', label: '₹0 - ₹2,000' },
        { value: '2000-4000', label: '₹2,000 - ₹4,000' },
        { value: '4000-6000', label: '₹4,000 - ₹6,000' },
        { value: '6000+', label: '₹6,000+' },
      ],
      onChange: setFilterPriceRange,
      primary: false,
    },
    {
      id: 'capacity',
      label: 'Capacity',
      type: 'select',
      value: filterCapacity,
      options: [
        { value: 'all', label: 'All Capacities' },
        { value: '4', label: '4 Passengers' },
        { value: '6', label: '6 Passengers' },
        { value: '7', label: '7 Passengers' },
        { value: '8+', label: '8+ Passengers' },
      ],
      onChange: setFilterCapacity,
      primary: false,
    },
  ];

  const filteredData = useMemo(() => {
    return pricing?.filter((price) => {
      const matchesSearch =
        price.carType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.route?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.carModel?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTripType = filterTripType === 'all' || price.tripType === filterTripType;
      const matchesCarType = filterCarType === 'all' || price.carType === filterCarType;

      let matchesPrice = true;
      if (filterPriceRange !== 'all') {
        const priceVal = price.price || 0;
        if (filterPriceRange === '0-2000') matchesPrice = priceVal <= 2000;
        else if (filterPriceRange === '2000-4000') matchesPrice = priceVal > 2000 && priceVal <= 4000;
        else if (filterPriceRange === '4000-6000') matchesPrice = priceVal > 4000 && priceVal <= 6000;
        else if (filterPriceRange === '6000+') matchesPrice = priceVal > 6000;
      }

      let matchesCapacity = true;
      if (filterCapacity !== 'all') {
        const cap = price.capacity || 0;
        if (filterCapacity === '4') matchesCapacity = cap === 4;
        else if (filterCapacity === '6') matchesCapacity = cap === 6;
        else if (filterCapacity === '7') matchesCapacity = cap === 7;
        else if (filterCapacity === '8+') matchesCapacity = cap >= 8;
      }

      return matchesSearch && matchesTripType && matchesCarType && matchesPrice && matchesCapacity;
    });
  }, [pricing, searchTerm, filterTripType, filterCarType, filterPriceRange, filterCapacity]);

  return { searchTerm, setSearchTerm, filters, filteredData };
};

export const useRoutesFilters = (routes = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDistance, setFilterDistance] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  const locationOptions = useMemo(() => {
    const locations = new Set();
    routes?.forEach(route => {
      if (route.from) locations.add(route.from);
      if (route.to) locations.add(route.to);
    });
    return [
      { value: 'all', label: 'All Locations' },
      ...Array.from(locations).map(loc => ({ value: loc, label: loc }))
    ];
  }, [routes]);

  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: filterStatus,
      options: [
        { value: 'all', label: 'All Routes' },
        { value: 'active', label: 'Active Only' },
        { value: 'inactive', label: 'Inactive Only' },
      ],
      onChange: setFilterStatus,
      primary: true,
    },
    {
      id: 'distance',
      label: 'Distance',
      type: 'select',
      value: filterDistance,
      options: [
        { value: 'all', label: 'All Distances' },
        { value: '0-50', label: '0-50 km' },
        { value: '50-100', label: '50-100 km' },
        { value: '100-200', label: '100-200 km' },
        { value: '200+', label: '200+ km' },
      ],
      onChange: setFilterDistance,
      primary: true,
    },
    {
      id: 'location',
      label: 'Location',
      type: 'select',
      value: filterLocation,
      options: locationOptions,
      onChange: setFilterLocation,
      primary: false,
    },
  ];

  const filteredData = useMemo(() => {
    return routes?.filter((route) => {
      const matchesSearch =
        route.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.to?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && route.active) ||
        (filterStatus === 'inactive' && !route.active);

      let matchesDistance = true;
      if (filterDistance !== 'all') {
        const dist = route.distance || 0;
        if (filterDistance === '0-50') matchesDistance = dist <= 50;
        else if (filterDistance === '50-100') matchesDistance = dist > 50 && dist <= 100;
        else if (filterDistance === '100-200') matchesDistance = dist > 100 && dist <= 200;
        else if (filterDistance === '200+') matchesDistance = dist > 200;
      }

      let matchesLocation = true;
      if (filterLocation !== 'all') {
        matchesLocation = route.from === filterLocation || route.to === filterLocation;
      }

      return matchesSearch && matchesStatus && matchesDistance && matchesLocation;
    });
  }, [routes, searchTerm, filterStatus, filterDistance, filterLocation]);

  return { searchTerm, setSearchTerm, filters, filteredData };
};