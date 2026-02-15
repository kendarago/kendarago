import { useState, useEffect, useCallback } from "react";
import { useNavigate, createSearchParams } from "react-router";
import { Input } from "../components/ui/input";
import type { VehicleCategory } from "~/lib/types";
import {
  XIcon,
  SearchIcon,
  CalendarIcon,
  Motorbike,
  CarIcon,
  ChevronLeftIcon,
  CheckIcon,
  BuildingIcon,
  MapPinIcon,
} from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { useRentVehicles } from "../context/rent-vehicles-context";

// Date range type
interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface UnifiedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "location" | "dates" | "vehicle";

export function UnifiedSearchModal({
  isOpen,
  onClose,
}: UnifiedSearchModalProps) {
  const navigate = useNavigate();

  const { setIsModalOpen } = useRentVehicles();
  // Local state
  const [activeTab, setActiveTab] = useState<TabType>("location");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // City-based location state (fetched from API)
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [rentalDateRange, setRentalDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [selectedCategory, setSelectedCategory] =
    useState<VehicleCategory>("motorcycle");

  const today = startOfDay(new Date());

  // Fetch cities from API on mount
  useEffect(() => {
    if (isOpen) {
      setIsModalOpen(isOpen);
      setIsLoadingCities(true);
      fetch(import.meta.env.VITE_BACKEND_API_URL + "/rental-companies/cities")
        .then((res) => res.json())
        .then((data: string[]) => {
          setCities(data);
          setIsLoadingCities(false);
        })
        .catch((err) => {
          console.error("Failed to fetch cities", err);
          setIsLoadingCities(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // City selection handler
  const handleSelectCity = useCallback((city: string) => {
    setSelectedCity(city);
    setActiveTab("dates");
  }, []);

  // Date handlers
  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;

    if (!selectingEnd) {
      setRentalDateRange({ startDate: date, endDate: null });
      setSelectingEnd(true);
    } else {
      if (
        rentalDateRange.startDate &&
        isBefore(date, rentalDateRange.startDate)
      ) {
        setRentalDateRange({ startDate: date, endDate: null });
      } else {
        setRentalDateRange({
          startDate: rentalDateRange.startDate,
          endDate: date,
        });
        setSelectingEnd(false);
        setActiveTab("vehicle");
      }
    }
  };

  const handleQuickSelect = (days: number) => {
    const start = today;
    const end = addDays(today, days - 1);
    setRentalDateRange({ startDate: start, endDate: end });
    setSelectingEnd(false);
    setActiveTab("vehicle");
  };

  // Filter cities by search query
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hasResults = filteredCities.length > 0;

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isInRange = (date: Date) => {
    if (!rentalDateRange.startDate || !rentalDateRange.endDate) return false;
    return date >= rentalDateRange.startDate && date <= rentalDateRange.endDate;
  };

  const isSelected = (date: Date) => {
    if (
      rentalDateRange.startDate &&
      date.toDateString() === rentalDateRange.startDate.toDateString()
    )
      return true;
    if (
      rentalDateRange.endDate &&
      date.toDateString() === rentalDateRange.endDate.toDateString()
    )
      return true;
    return false;
  };

  const getDayCount = () => {
    if (!rentalDateRange.startDate || !rentalDateRange.endDate) return null;
    const diff =
      Math.ceil(
        (rentalDateRange.endDate.getTime() -
          rentalDateRange.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;
    return diff;
  };

  const dayCount = getDayCount();

  // Check if search is ready
  const canSearch =
    selectedCity !== null &&
    rentalDateRange.startDate &&
    rentalDateRange.endDate;

  const handleSearch = () => {
    if (canSearch) {
      if (!rentalDateRange.startDate || !rentalDateRange.endDate) {
        alert("Please select both start and end dates.");
        return;
      }
      const searchParams = createSearchParams({
        city: selectedCity || "", // Ensure empty string if null, though check ensures not null
        startDate: rentalDateRange.startDate.toISOString(),
        endDate: rentalDateRange.endDate.toISOString(),
        category: selectedCategory,
      });
      setIsModalOpen(false);
      onClose();
      navigate({
        pathname: "/result-search",
        search: `?${searchParams.toString()}`,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
          >
            <XIcon className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">
            Search Vehicles
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("location")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "location"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <MapPinIcon className="h-5 w-5" />
              <span>City</span>
              {selectedCity && (
                <CheckIcon className="h-3 w-3 text-primary absolute top-2 right-4" />
              )}
            </div>
            {activeTab === "location" && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("dates")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "dates" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <CalendarIcon className="h-5 w-5" />
              <span>Dates</span>
              {rentalDateRange.startDate && rentalDateRange.endDate && (
                <CheckIcon className="h-3 w-3 text-primary absolute top-2 right-4" />
              )}
            </div>
            {activeTab === "dates" && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("vehicle")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "vehicle" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Motorbike className="h-5 w-5" />
              <span>Vehicle</span>
              <CheckIcon className="h-3 w-3 text-primary absolute top-2 right-4" />
            </div>
            {activeTab === "vehicle" && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Location Tab */}
          {activeTab === "location" && (
            <div>
              {/* Search Input */}
              <div className="p-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-secondary/50 border-0"
                    autoFocus
                  />
                </div>
              </div>

              {/* All Cities option */}
              <div className="border-b border-border">
                <button
                  onClick={() => handleSelectCity("")}
                  className={`flex items-center gap-4 w-full px-4 py-3 hover:bg-secondary/50 transition-colors text-left ${
                    selectedCity === "" ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                    <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground">All Cities</p>
                  {selectedCity === "" && (
                    <CheckIcon className="h-5 w-5 text-primary ml-auto" />
                  )}
                </button>
              </div>

              {/* Cities from API */}
              {isLoadingCities ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Loading cities...</p>
                </div>
              ) : filteredCities.length > 0 ? (
                <div className="border-b border-border">
                  <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Cities
                  </p>
                  {filteredCities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectCity(city)}
                      className={`flex items-center gap-4 w-full px-4 py-3 hover:bg-secondary/50 transition-colors text-left ${
                        selectedCity === city ? "bg-primary/10" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                        <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground">{city}</p>
                      {selectedCity === city && (
                        <CheckIcon className="h-5 w-5 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              ) : null}

              {/* No Results */}
              {searchQuery && !hasResults && (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <SearchIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-foreground font-medium mb-1">
                    No cities found
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    Try a different search term
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Dates Tab */}
          {activeTab === "dates" && (
            <div>
              {/* Selected Dates Display */}
              <div className="px-4 py-4 border-b border-border">
                <div className="flex gap-3">
                  <div
                    className={`flex-1 p-3 rounded-xl border-2 transition-colors ${
                      !selectingEnd
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      Start date
                    </p>
                    <p className="font-medium text-foreground">
                      {rentalDateRange.startDate
                        ? format(rentalDateRange.startDate, "MMM d, yyyy")
                        : "Select date"}
                    </p>
                  </div>
                  <div
                    className={`flex-1 p-3 rounded-xl border-2 transition-colors ${
                      selectingEnd
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      End date
                    </p>
                    <p className="font-medium text-foreground">
                      {rentalDateRange.endDate
                        ? format(rentalDateRange.endDate, "MMM d, yyyy")
                        : "Select date"}
                    </p>
                  </div>
                </div>
                {dayCount && (
                  <p className="text-sm text-primary font-medium mt-3 text-center">
                    {dayCount} days rental
                  </p>
                )}
              </div>

              {/* Quick Select */}
              <div className="px-4 py-4 border-b border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  Quick select
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Today", days: 1 },
                    { label: "3 days", days: 3 },
                    { label: "1 week", days: 7 },
                    { label: "2 weeks", days: 14 },
                  ].map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleQuickSelect(option.days)}
                      className="px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary/5 text-sm font-medium text-foreground transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                      ),
                    )
                  }
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <h3 className="font-semibold text-foreground">
                  {format(currentMonth, "MMMM yyyy")}
                </h3>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                      ),
                    )
                  }
                  className="p-2 hover: bg-secondary rounded-full transition-colors rotate-180"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Calendar */}
              <div className="px-4 pb-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="h-10 flex items-center justify-center"
                    >
                      <span className="text-xs font-medium text-muted-foreground">
                        {day}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="h-10" />;
                    }

                    const isPast = isBefore(date, today);
                    const selected = isSelected(date);
                    const inRange = isInRange(date);

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDateClick(date)}
                        disabled={isPast}
                        className={`h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          isPast
                            ? "text-muted-foreground/40 cursor-not-allowed"
                            : selected
                              ? "bg-primary text-primary-foreground"
                              : inRange
                                ? "bg-primary/20 text-primary"
                                : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Tab */}
          {activeTab === "vehicle" && (
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                What would you like to rent?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory("motorcycle")}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    selectedCategory === "motorcycle"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      selectedCategory === "motorcycle"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <Motorbike className="h-7 w-7" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground">Motorbike</p>
                    <p className="text-sm text-muted-foreground">
                      Scooters, sport bikes & more
                    </p>
                  </div>
                  {selectedCategory === "motorcycle" && (
                    <CheckIcon className="h-6 w-6 text-primary" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedCategory("car")}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    selectedCategory === "car"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      selectedCategory === "car"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <CarIcon className="h-7 w-7" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground">Car</p>
                    <p className="text-sm text-muted-foreground">
                      Sedans, SUVs, MPVs & more
                    </p>
                  </div>
                  {selectedCategory === "car" && (
                    <CheckIcon className="h-6 w-6 text-primary" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-area-bottom">
          {/* TODO: Make this button work */}
          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
              canSearch
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {canSearch ? "Search" : "Complete all steps to search"}
          </button>
        </div>
      </div>
    </div>
  );
}
