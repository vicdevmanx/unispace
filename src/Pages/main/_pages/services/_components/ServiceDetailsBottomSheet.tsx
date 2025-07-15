import React, { useState } from "react";
import { Service } from "../../../../../types/Workspace";
import {
  X,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Phone,
  Calendar,
  Star,
  Wifi,
  Car,
  Coffee,
  Building2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { useAuthContext } from "../../../../../contexts/AuthContext";

interface ServiceDetailsBottomSheetProps {
  open: boolean;
  onClose: () => void;
  service: Service | null;
  onBookNow?: () => void;
}

const ServiceDetailsBottomSheet: React.FC<ServiceDetailsBottomSheetProps> = ({
  open,
  onClose,
  service,
  onBookNow,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startY, setStartY] = useState<number | null>(null);
  const [dragY, setDragY] = useState<number>(0);

  const { user } = useAuthContext();

  if (!open || !service) return null;

  const handleImageClick = (img: string, index: number) => {
    setLightboxImg(img);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    if (service?.images) {
      const nextIndex = (currentImageIndex + 1) % service.images.length;
      setCurrentImageIndex(nextIndex);
      setLightboxImg(service.images[nextIndex] as string);
    }
  };

  const prevImage = () => {
    if (service?.images) {
      const prevIndex =
        currentImageIndex === 0
          ? service.images.length - 1
          : currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setLightboxImg(service.images[prevIndex] as string);
    }
  };

  const getFeatureIcon = (feature: string) => {
    const featureLower = feature.toLowerCase();
    if (featureLower.includes("wifi") || featureLower.includes("internet"))
      return <Wifi className="w-4 h-4" />;
    if (featureLower.includes("parking") || featureLower.includes("car"))
      return <Car className="w-4 h-4" />;
    if (featureLower.includes("coffee") || featureLower.includes("kitchen"))
      return <Coffee className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startY !== null) {
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) setDragY(deltaY);
    }
  };
  const onTouchEnd = () => {
    if (dragY > 50) {
      onClose();
    }
    setStartY(null);
    setDragY(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-t-[50px] shadow-2xl w-full h-[92vh] max-w-7xl mx-auto relative animate-slide-up overflow-hidden touch-none"
        // 👉 Mobile drag:
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
       
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: dragY === 0 ? "transform 0.2s ease-out" : undefined,
        }}
      >
        {/* Header with Close Button */}
        <div className="sticky top-2 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-6 flex items-center justify-between">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto cursor-pointer" />

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-32">
          {/* Hero Image Section */}
          {service.images && service.images.length > 0 && (
            <div className="relative h-64 bg-gradient-to-br from-[#1D3A8A] to-[#214cc3]">
              <img
                src={service.images[0] as string}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                <div className="flex items-center text-white/90">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{service.address}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#1D3A8A] px-3 py-1 rounded-full text-sm font-semibold">
                {service.type}
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="px-6 py-6 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <Users className="w-6 h-6 text-[#1D3A8A] mx-auto mb-2" />
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-bold text-[#1D3A8A]">{service.capacity}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">From</p>
                <p className="font-bold text-green-600">
                  {formatPrice(service.minCharge)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Min Duration</p>
                <p className="font-bold text-purple-600">
                  {service.minDuration} {service.durationUnit}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl text-center">
                <Building2 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-bold text-orange-600">{service.type}</p>
              </div>
            </div>

            {/* Description */}
            {service.description && (
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-[#1D3A8A] mb-3">
                  About This Space
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>
            )}

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#1D3A8A] mb-4">
                  Amenities & Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white border border-gray-200 p-3 rounded-xl hover:border-[#1D3A8A] transition-colors"
                    >
                      <div className="text-[#1D3A8A] mr-3">
                        {getFeatureIcon(feature)}
                      </div>
                      <span className="text-gray-700 text-sm font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing & Duration */}
            <div className="bg-gradient-to-r from-[#1D3A8A] to-[#214cc3] p-6 rounded-2xl text-white">
              <h3 className="text-lg font-semibold mb-4">Pricing & Duration</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Price Range</p>
                  <p className="text-2xl font-bold">
                    {formatPrice(service.minCharge)} -{" "}
                    {formatPrice(service.maxCharge)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Duration</p>
                  <p className="text-xl font-semibold">
                    {service.minDuration} - {service.maxDuration}{" "}
                    {service.durationUnit}
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-[#1D3A8A] mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Working Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-items-end ">
                  <span className="text-gray-600">Days</span>
                  <span className="font-medium grid grid-cols-2 gap-2 justify-items-start ml- ">
                    {service.workingDays?.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hours</span>
                  <span className="font-medium">
                    {service.workingTime?.start} - {service.workingTime?.end}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-[#1D3A8A] mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <a
                    href={`tel:${service.contactLine}`}
                    className="text-[#1D3A8A] hover:text-[#214cc3] font-medium transition-colors"
                  >
                    {service.contactLine}
                  </a>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                  <div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        service.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1D3A8A] hover:text-[#214cc3] font-medium transition-colors"
                    >
                      {service.address}
                    </a>
                    {service.geoAddress && (
                      <p className="text-sm text-gray-500 mt-1">
                        {service.geoAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {service.images && service.images.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-[#1D3A8A] mb-4">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {service.images.slice(1).map((img, idx) =>
                    typeof img === "string" ? (
                      <div
                        key={idx}
                        className="relative group cursor-pointer"
                        onClick={() => handleImageClick(img, idx + 1)}
                      >
                        <img
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl flex items-center justify-center">
                          <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3">
            {user && (
              <button
                className="flex-1 bg-[#1D3A8A] hover:bg-[#214cc3] text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
                onClick={onBookNow}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Lightbox Modal */}
      {lightboxOpen && lightboxImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              src={lightboxImg}
              alt="Large view"
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Navigation Buttons */}
            {service?.images && service.images.length > 1 && (
              <>
                <button
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 sm:p-3 transition"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 sm:p-3 transition"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Close Button - always visible */}
            <button
              className="fixed top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 sm:p-3 transition"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close image preview"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 bg-black/40 text-white px-3 py-1 rounded-full text-xs sm:text-sm">
              {currentImageIndex + 1} / {service?.images?.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailsBottomSheet;
