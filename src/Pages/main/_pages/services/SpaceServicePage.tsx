import React, { useState, useEffect } from 'react';
import UserLayout from '../../_components/UserLayout';
import { useAllWorkspaceServices } from '../../../../hooks/useAllWorkspaceServices';
import { Search, Users, DollarSign, Building2, MapPin, Star, Clock, Wifi, Car, Coffee, X } from 'lucide-react';
import { db } from '../../../../lib/Firebase';
import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import ServiceDetailsBottomSheet from './_components/ServiceDetailsBottomSheet';
import { Service } from '../../../../types/Workspace';
import ServiceBookingBottomSheet from './_components/ServiceBookingBottomSheet';
import { toast } from 'sonner';

const SpaceServicePage = () => {
  // State for search and filters
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    capacity: '',
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const [workspaceNames, setWorkspaceNames] = useState<Record<string, string>>({});
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [bookingSheetOpen, setBookingSheetOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Fetch all workspace services
  const { services, loading, error } = useAllWorkspaceServices();

  // Get unique types from services
  const uniqueTypes = Array.from(new Set(services.map(s => s.type).filter(Boolean)));

  // Filter logic (simple client-side for now)
  const filteredServices = services.filter(service => {
    const matchesSearch =
      !search ||
      service.name?.toLowerCase().includes(search.toLowerCase()) ||
      service.address?.toLowerCase().includes(search.toLowerCase()) ||
      service.features?.some((f: string) => f.toLowerCase().includes(search.toLowerCase()));
    const matchesType = !filters.type || service.type === filters.type;
    const matchesCapacity = !filters.capacity || Number(service.capacity) >= Number(filters.capacity);
    const matchesMinPrice = !filters.minPrice || Number(service.minCharge) >= Number(filters.minPrice);
    return matchesSearch && matchesType && matchesCapacity && matchesMinPrice;
  });

  // Clear filter handler
  const handleClearFilter = () => {
    setTempFilters({ type: '', minPrice: '', capacity: '' });
  };

  // Apply filter handler
  const handleApplyFilter = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
  };

  // Helper function to get feature icon
  const getFeatureIcon = (feature: string) => {
    const featureLower = feature.toLowerCase();
    if (featureLower.includes('wifi') || featureLower.includes('internet')) return <Wifi className="w-3 h-3" />;
    if (featureLower.includes('parking') || featureLower.includes('car')) return <Car className="w-3 h-3" />;
    if (featureLower.includes('coffee') || featureLower.includes('kitchen')) return <Coffee className="w-3 h-3" />;
    return <Star className="w-3 h-3" />;
  };

  useEffect(() => {
    // Fetch workspace names for all unique workspaceIds in services
    const fetchWorkspaceNames = async () => {
      const ids = Array.from(new Set(services.map(s => s.workspaceId).filter(Boolean)));
      if (ids.length === 0) return;
      // Firestore: get all workspaces, then filter locally for the needed IDs
      const snapshot = await getDocs(collection(db, 'workspaces'));
      const names: Record<string, string> = {};
      snapshot.forEach(doc => {
        if (ids.includes(doc.id)) {
          const data = doc.data() as DocumentData;
          names[doc.id] = data.name;
        }
      });
      setWorkspaceNames(names);
    };
    fetchWorkspaceNames();
  }, [services]);

  // Add handler for booking
  const handleBook = (bookingData) => {
    toast.success(`Booking submitted!${bookingData?.serviceName ? ' (' + bookingData.serviceName + ')' : ''}`);
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section with Image Background */}
      <section className="relative w-full max-w-7xl mx-auto py-8 mb-8 overflow-hidden rounded-2xl mt-10">
        <img
          src="/digital-art-style-illustration-graphic-designer.jpg"
          alt="Workspace Hero"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D3A8A] via-[#214cc3] to-[#1D3A8A] opacity-90 z-10"></div>
        
        <div className="relative z-30 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Find Your Perfect
            <span className="block text-blue-200">Workspace</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed opacity-90">
            Discover inspiring workspaces designed for productivity, creativity, and collaboration in premium locations
          </p>
          <a
            href="#services"
            className="bg-white text-[#1D3A8A] font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Explore Workspaces
          </a>
        </div>
      </section>

      {/* Filter Bar: Search left, Filter button right */}
      <section className="w-full max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D3A8A] w-5 h-5" />
            <input
              type="text"
              placeholder="Search workspaces, locations, amenities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D3A8A] focus:border-transparent text-gray-700"
            />
          </div>
          <button
            type="button"
            className="bg-[#1D3A8A] hover:bg-[#214cc3] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            onClick={() => setShowFilterModal(true)}
          >
            Filter
          </button>
        </div>
      </section>

      {/* Filter Modal/Popover */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowFilterModal(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-[#1D3A8A] mb-6 text-center">Filter Workspaces</h2>
            <form className="space-y-5" onSubmit={e => { e.preventDefault(); handleApplyFilter(); }}>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D3A8A] w-4 h-4" />
                <select
                  value={tempFilters.type}
                  onChange={e => setTempFilters(f => ({ ...f, type: e.target.value }))}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D3A8A] text-gray-700 bg-white w-full"
                >
                  <option value="">All Types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
            </select>
          </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D3A8A] w-4 h-4" />
            <input
              type="number"
              min={1}
                  value={tempFilters.capacity}
                  onChange={e => setTempFilters(f => ({ ...f, capacity: e.target.value }))}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D3A8A] text-gray-700 w-full"
                  placeholder="Capacity"
            />
          </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D3A8A] w-4 h-4" />
              <input
                type="number"
                min={0}
                  value={tempFilters.minPrice}
                  onChange={e => setTempFilters(f => ({ ...f, minPrice: e.target.value }))}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D3A8A] text-gray-700 w-full"
                  placeholder="Amount ₦"
              />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1D3A8A] hover:bg-[#214cc3] text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Grid */}
      <section id="services" className="max-w-7xl mx-auto pb-12 border-t py-6 border-gray-300">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A8A] mb-4"></div>
            <p className="text-gray-600 text-lg">Loading amazing workspaces...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No workspaces match your criteria</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map(service => (
              <div key={service.id} className="group bg-white rounded-2xl shadow-SM hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1 flex flex-col h-full">
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden">
                  {service.images && service.images.length > 0 && typeof service.images[0] === 'string' ? (
                    <>
                      <img 
                        src={service.images[0]} 
                        alt={service.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1D3A8A] to-[#214cc3] flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white opacity-60" />
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1D3A8A] px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {service.type}
                  </div>
                  {/* Organization Name Badge */}
                  {service.workspaceId && workspaceNames[service.workspaceId] && (
                    <div className="absolute bottom-3 left-3 bg-blue-100 flex items-center gap-2   text-[#214cc3] px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      <Building2 className='w-5 h-5  felx'/> {workspaceNames[service.workspaceId]}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-[#1D3A8A] mb-2 line-clamp-1 group-hover:text-[#214cc3] transition-colors">
                    {service.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <p className="text-sm line-clamp-1">{service.address}</p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features?.slice(0, 3).map((feature: string, index: number) => (
                      <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                        {getFeatureIcon(feature)}
                        <span className="ml-1">{feature}</span>
                      </div>
                    ))}
                    {service.features?.length > 3 && (
                      <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                        +{service.features.length - 3} more
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    {/* Pricing and Capacity */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[#1D3A8A] font-bold text-lg">
                          ₦{service.minCharge?.toLocaleString()}/ <span className='text-sm font-normal'>{service.durationUnit}</span>
                        </p>
                      </div>
                      {service.capacity && (
                        <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{service.capacity}</span>
                        </div>
                      )}
                    </div>
                    {/* Book Button always at bottom */}
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-[#1D3A8A] hover:bg-[#214cc3] text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        onClick={() => { setSelectedService(service); setDetailsSheetOpen(true); }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        )}
      </section>
      </div>
      <ServiceDetailsBottomSheet
        open={detailsSheetOpen}
        onClose={() => setDetailsSheetOpen(false)}
        service={selectedService}
        onBookNow={() => {
          setDetailsSheetOpen(false);
          setBookingSheetOpen(true);
        }}
      />
      <ServiceBookingBottomSheet
        open={bookingSheetOpen}
        onClose={() => setBookingSheetOpen(false)}
        service={selectedService}
        onBook={handleBook}
      />
    </UserLayout>
  );
};

export default SpaceServicePage; 