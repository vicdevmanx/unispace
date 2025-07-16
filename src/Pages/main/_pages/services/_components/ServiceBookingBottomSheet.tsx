import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Tag,
  CheckCircle,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Discount, Service } from "../../../../../types/Workspace";
import { useBooking } from "../../../../../hooks/useBooking";
import { Booking } from "../../../../../types/Workspace";
import { useUser } from "../../../../../hooks/useUser";
import { useNavigate } from "react-router-dom";

interface ServiceBookingBottomSheetProps {
  open: boolean;
  onClose: () => void;
  service: Service | null;
  onBook: (bookingData: any) => void;
}

const getDayOfWeek = (dateStr: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });
};

const ServiceBookingBottomSheet: React.FC<ServiceBookingBottomSheetProps> = ({
  open,
  onClose,
  service,
  onBook,
}) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [numSeats, setNumSeats] = useState(1);
  const [step, setStep] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [checkingDiscount, setCheckingDiscount] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [dragY, setDragY] = useState<number>(0);

  const {
    checkDiscountCode,
    applyDiscountUsage,
    createBooking,
    loading,
    error,
  } = useBooking();
  const { user } = useUser();
  const userId = user?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  // Clear discountError when discountCode is cleared
  useEffect(() => {
    if (!discountCode) setDiscountError("");
  }, [discountCode]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!open || !service) return null;

  // Calculate price
  const totalMinutes = Number(duration);
  let basePrice = service.minCharge * (totalMinutes / service.minDuration);
  if (service.maxCharge && basePrice > service.maxCharge)
    basePrice = service.maxCharge;
  let totalPrice = basePrice * numSeats - discountAmount;
  if (totalPrice < 0) totalPrice = 0;

  // Validate date and time
  const selectedDay = getDayOfWeek(date);
  const isWorkingDay = service.workingDays?.includes(selectedDay);
  const minDuration = service.minDuration;
  const maxDuration = service.maxDuration;
  const durationUnit = (service as any).durationUnit || "minutes";
  const openTime = service.workingTime?.start || "08:00";
  const closeTime = service.workingTime?.end || "18:00";

  const canBook =
    date &&
    startTime &&
    duration &&
    Number(duration) >= minDuration &&
    Number(duration) <= maxDuration &&
    isWorkingDay &&
    startTime >= openTime &&
    startTime < closeTime;

  // Clamp values to max/min
  const handleDurationChange = (val: string) => {
    let num = Number(val);
    if (num < minDuration) num = minDuration;
    if (num > maxDuration) num = maxDuration;
    setDuration(num.toString());
  };

  const handleNumSeatsChange = (val: number) => {
    let num = Number(val);
    if (num < 1) num = 1;
    if (num > service.capacity) num = service.capacity;
    setNumSeats(num);
  };

  const handleStartTimeChange = (val: string) => {
    if (val < openTime) setStartTime(openTime);
    else if (val > closeTime) setStartTime(closeTime);
    else setStartTime(val);
  };

  // Discount code validation
  const handleCheckDiscount = async () => {
    setCheckingDiscount(true);
    setDiscountError("");
    setDiscountAmount(0);
    if (!service.workspaceId) {
      setDiscountError("Workspace ID missing.");
      setCheckingDiscount(false);
      return;
    }
    const { discount, error: discountCheckError } = await checkDiscountCode(
      service.workspaceId,
      discountCode
    );
    setDiscount(discount);
    if (discount && discount.id === "default") {
      setDiscountMessage(
        "No discount code entered. A default 0% discount has been applied!"
      );
      setDiscountAmount(0); // Default discount is 0% currently
    } else if (discountCheckError) {
      setDiscountError(discountCheckError);
      setDiscountAmount(0);
    } else if (discount) {
      setDiscountAmount(
        Math.round(basePrice * numSeats * ((discount.percentage ?? 0) / 100))
      );
      setDiscountMessage("Discount code applied!");
    }
    setCheckingDiscount(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canBook) {
      setFormError(
        "Please fill all fields correctly and select a valid date/duration."
      );
      return;
    }
    if (!userId) {
      setFormError("You must be logged in to book a workspace.");
      return;
    }
    if (!service.workspaceId) {
      setFormError("Workspace ID missing.");
      return;
    }
    setFormError("");
    setSuccessMsg("");
    setDiscountError("");

    let finalTotalPrice = totalPrice;
    if (discountCode) {
      const { discount, error: discountCheckError } = await checkDiscountCode(
        service.workspaceId,
        discountCode
      );
      if (discount) {
        finalTotalPrice =
          basePrice * numSeats -
          Math.round(basePrice * numSeats * ((discount.percentage ?? 0) / 100));
        if (finalTotalPrice < 0) finalTotalPrice = 0;
        await applyDiscountUsage(service.workspaceId, discount.id);
      } else {
        setFormError(discountCheckError || "Invalid or expired code");
        setDiscountError(discountCheckError || "Invalid or expired code");
        return;
      }
    }
    // If discountCode is empty, just proceed with booking (no error, no return)
    // Prepare booking payload
    const booking: Booking = {
      userId,
      serviceId: service.id,
      workspaceId: service.workspaceId || "",
      date,
      startTime,
      duration: Number(duration),
      numSeats,
      totalPrice: finalTotalPrice,
      discountCode: discountCode || "DEFAULT",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      durationUnit: service.durationUnit || "",
    };
    try {
      await createBooking(service.workspaceId, booking);
      setSuccessMsg("Booking successful!");
      setDate("");
      setStartTime("");
      setDuration("");
      setNumSeats(1);
      setDiscountCode("");
      setDiscountAmount(0);
      setStep(0);
      onBook(booking);
      setTimeout(() => {
        setSuccessMsg("");
        handleClose();
        navigate("/user-home");
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Failed to create booking");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-out ${
        isVisible
          ? "bg-black/60 backdrop-blur-sm"
          : "bg-transparent pointer-events-none"
      }`}
      onClick={handleClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ease-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-white rounded-t-[50px] shadow-2xl w-full max-h-[90vh] max-w-7xl mx-auto relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
            transition: dragY === 0 ? "transform 0.2s ease-out" : undefined,
          }}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#1D3A8A] to-[#214cc3] px-6 py-8 text-white">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full"></div>
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold mb-2">Book Your Space</h2>
              <p className="text-blue-100 text-sm">{service.name}</p>
            </div>

            {/* Price Display */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Amount</p>
                  <p className="text-3xl font-bold">
                    ₦{totalPrice.toLocaleString()}
                  </p>
                  {discountAmount > 0 && (
                    <p className="text-green-300 text-sm flex items-center gap-1 mt-1">
                      <Tag size={14} />₦{discountAmount} discount applied
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-xs">per {durationUnit}</p>
                  <p className="text-lg font-semibold">₦{service.minCharge}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-12 max-h-[60vh] overflow-y-auto">
            {/* Success Message */}
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-green-800 font-medium">{successMsg}</span>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === 0
                      ? "bg-[#1D3A8A] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-12 h-0.5 transition-colors ${
                    step === 1 ? "bg-[#1D3A8A]" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === 1
                      ? "bg-[#1D3A8A] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {step === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Input */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Calendar size={16} className="text-[#1D3A8A]" />
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                      {!isWorkingDay && date && (
                        <div className="flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle size={12} />
                          Not a working day for this workspace
                        </div>
                      )}
                    </div>

                    {/* Time Input */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Clock size={16} className="text-[#1D3A8A]" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={startTime}
                        min={openTime}
                        max={closeTime}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Business hours: {openTime} - {closeTime}
                      </p>
                      {startTime &&
                        (startTime < openTime || startTime >= closeTime) && (
                          <div className="flex items-center gap-1 text-xs text-red-500">
                            <AlertCircle size={12} />
                            Start time must be within business hours
                          </div>
                        )}
                    </div>

                    {/* Duration Input */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        Duration ({durationUnit})
                      </label>
                      <input
                        type="number"
                        min={minDuration}
                        max={maxDuration}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={duration}
                        onChange={(e) => handleDurationChange(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Range: {minDuration} - {maxDuration} {durationUnit}
                      </p>
                    </div>

                    {/* Seats Input */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Users size={16} className="text-[#1D3A8A]" />
                        Number of Seats
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          onClick={() => handleNumSeatsChange(numSeats - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={service.capacity}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={numSeats}
                          onChange={(e) =>
                            handleNumSeatsChange(Number(e.target.value))
                          }
                          required
                        />
                        <button
                          type="button"
                          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          onClick={() => handleNumSeatsChange(numSeats + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Maximum capacity: {service.capacity}
                      </p>
                    </div>
                  </div>

                  {formError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                      <AlertCircle className="text-red-600" size={20} />
                      <span className="text-red-800 text-sm">{formError}</span>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  {/* Discount Code */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Tag size={16} className="text-[#1D3A8A]" />
                      Discount Code (optional)
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Enter discount code"
                      />
                      <button
                        type="button"
                        className="px-6 py-3 bg-[#1D3A8A] text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        onClick={handleCheckDiscount}
                        disabled={checkingDiscount || !discountCode}
                      >
                        {checkingDiscount ? "Checking..." : "Apply"}
                      </button>
                    </div>
                    {discountError && (
                      <div className="flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle size={16} />
                        {discountError}
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle size={16} />
                        Discount of ₦{discountAmount} applied successfully!
                      </div>
                    )}
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800">
                      Booking Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {date} ({selectedDay})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{startTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {duration} {durationUnit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seats:</span>
                        <span className="font-medium">{numSeats}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          ₦{(basePrice * numSeats).toLocaleString()}
                        </span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-₦{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total:</span>
                        <span>₦{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 border-t">
                {step === 1 && (
                  <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    onClick={() => setStep(0)}
                    disabled={loading}
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                )}

                {step === 0 && (
                  <button
                    type="button"
                    className="ml-auto flex items-center gap-2 px-8 py-3 bg-[#1D3A8A] text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    onClick={() => setStep(1)}
                    disabled={!canBook || loading}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                )}

                {step === 1 && (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1D3A8A] to-[#214cc3] text-white rounded-xl hover:from-blue-700 hover:to-[#214cc3]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                    disabled={
                      !canBook || loading || (!!discountCode && !!discountError)
                    }
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Confirm Booking
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingBottomSheet;
