import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import type { Location, Vehicle, VehicleCategory } from "~/lib/types";
import {
  XIcon,
  NavigationIcon,
  GlobeIcon,
  HistoryIcon,
  PlaneIcon,
  BuildingIcon,
  TrainIcon,
  HotelIcon,
  SearchIcon,
  CalendarIcon,
  Motorbike,
  CarIcon,
  ChevronLeftIcon,
  CheckIcon,
} from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";

// Location history type
interface LocationHistory {
  location: Location;
  dates?: string;
  timestamp: number;
}

// Date range type
interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface UnifiedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Predefined location suggestions
const airports = [
  {
    name: "DPS - Ngurah Rai International Airport",
    lat: -8.7467,
    lng: 115.1667,
  },
  { name: "SUB - Juanda International Airport", lat: -7.3797, lng: 112.7876 },
  {
    name: "CGK - Soekarno-Hatta International Airport",
    lat: -6.1256,
    lng: 106.6558,
  },
];

const cities = [
  { name: "Seminyak, Bali", lat: -8.6909, lng: 115.1639 },
  { name: "Ubud, Bali", lat: -8.5069, lng: 115.2624 },
  { name: "Kuta, Bali", lat: -8.718, lng: 115.1686 },
  { name: "Canggu, Bali", lat: -8.6478, lng: 115.1385 },
  { name: "Sanur, Bali", lat: -8.6783, lng: 115.2631 },
];

const trainStations = [
  { name: "Surabaya Gubeng Station", lat: -7.2653, lng: 112.7519 },
  { name: "Yogyakarta Station", lat: -7.7891, lng: 110.3634 },
];

const hotels = [
  { name: "W Bali - Seminyak", lat: -8.6853, lng: 115.1562 },
  { name: "The Mulia, Nusa Dua", lat: -8.8183, lng: 115.2278 },
];

type TabType = "location" | "dates" | "vehicle";

export function UnifiedSearchModal({
  isOpen,
  onClose,
}: UnifiedSearchModalProps) {
  const navigate = useNavigate();

  // Local state - replacing Zustand store
  const [activeTab, setActiveTab] = useState<TabType>("location");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Core state variables (previously from Zustand)
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationHistory[]>([]);
  const [rentalDateRange, setRentalDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [selectedCategory, setSelectedCategory] =
    useState<VehicleCategory>("motorcycle");

  const today = startOfDay(new Date());

  // Load data from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedHistory = localStorage.getItem("riderent-location-history");
      if (savedHistory) {
        try {
          setLocationHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Failed to parse location history", e);
        }
      }
    }
  }, [isOpen]);

  // Save location history to localStorage
  useEffect(() => {
    if (locationHistory.length > 0) {
      localStorage.setItem(
        "riderent-location-history",
        JSON.stringify(locationHistory),
      );
    }
  }, [locationHistory]);

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

  // Add location to history
  const addLocationToHistory = useCallback(
    (location: Location, dates?: string) => {
      setLocationHistory((prev) => {
        const filtered = prev.filter((h) => h.location.name !== location.name);
        return [{ location, dates, timestamp: Date.now() }, ...filtered].slice(
          0,
          5,
        );
      });
    },
    [],
  );

  // Location handlers
  const handleSelectLocation = useCallback(
    (location: Location) => {
      addLocationToHistory(location);
      setCurrentLocation(location);
      setActiveTab("dates");
    },
    [addLocationToHistory],
  );

  const handleCurrentLocation = useCallback(() => {
    setIsLoadingGPS(true);
    if (!navigator.geolocation) {
      setIsLoadingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          name: "Current Location",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        handleSelectLocation(location);
        setIsLoadingGPS(false);
      },
      () => {
        setIsLoadingGPS(false);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }, [handleSelectLocation]);

  const handleAnywhere = useCallback(() => {
    handleSelectLocation({ name: "Anywhere", lat: 0, lng: 0 });
  }, [handleSelectLocation]);

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

  // Filter locations
  const filterLocations = (locations: typeof airports) =>
    locations.filter((loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const filteredAirports = filterLocations(airports);
  const filteredCities = filterLocations(cities);
  const filteredTrainStations = filterLocations(trainStations);
  const filteredHotels = filterLocations(hotels);

  const hasResults =
    filteredAirports.length > 0 ||
    filteredCities.length > 0 ||
    filteredTrainStations.length > 0 ||
    filteredHotels.length > 0;

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
    currentLocation && rentalDateRange.startDate && rentalDateRange.endDate;

  const handleSearch = () => {
    if (canSearch) {
      // Save search data to localStorage for results page
      localStorage.setItem(
        "riderent-search-data",
        JSON.stringify({
          location: currentLocation,
          dateRange: {
            startDate: rentalDateRange.startDate?.toISOString(),
            endDate: rentalDateRange.endDate?.toISOString(),
          },
          category: selectedCategory,
        }),
      );

      onClose();
      navigate("/results");
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
              <NavigationIcon className="h-5 w-5" />
              <span>Location</span>
              {currentLocation && (
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
                    placeholder="City, airport, address or hotel"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-secondary/50 border-0"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Actions */}
              {!searchQuery && (
                <div className="border-b border-border">
                  <button
                    onClick={handleCurrentLocation}
                    disabled={isLoadingGPS}
                    className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <NavigationIcon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">
                      {isLoadingGPS
                        ? "Getting location..."
                        : "Current location"}
                    </span>
                  </button>

                  <button
                    onClick={handleAnywhere}
                    className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                      <GlobeIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Anywhere</p>
                      <p className="text-sm text-muted-foreground">
                        Browse all vehicles
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* History Section */}
              {!searchQuery && locationHistory.length > 0 && (
                <div className="border-b border-border">
                  <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    History
                  </p>
                  {locationHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectLocation(item.location)}
                      className="flex items-center gap-4 w-full px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                        <HistoryIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary truncate">
                          {item.location.name}
                        </p>
                        {item.dates && (
                          <p className="text-sm text-muted-foreground">
                            {item.dates}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Airports */}
              {filteredAirports.length > 0 && (
                <div className="border-b border-border">
                  <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Airports
                  </p>
                  {filteredAirports.map((airport, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectLocation(airport)}
                      className="flex items-center gap-4 w-full px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                        <PlaneIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground truncate">
                        {airport.name}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Cities */}
              {filteredCities.length > 0 && (
                <div className="border-b border-border">
                  <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Cities
                  </p>
                  {filteredCities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectLocation(city)}
                      className="flex items-center gap-4 w-full px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                        <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground">{city.name}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Train Stations */}
              {filteredTrainStations.length > 0 && (
                <div className="border-b border-border">
                  <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Train stations
                  </p>
                  {filteredTrainStations.map((station, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectLocation(station)}
                      className="flex items-center gap-4 w-full px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                        <TrainIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground">
                        {station.name}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Hotels */}
              {filteredHotels.length > 0 && (
                <div className="border-b border-border">
                  <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Hotels
                  </p>
                  {filteredHotels.map((hotel, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectLocation(hotel)}
                      className="flex items-center gap-4 w-full px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                        <HotelIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground">
                        {hotel.name}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {searchQuery && !hasResults && (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <SearchIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-foreground font-medium mb-1">
                    No locations found
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
