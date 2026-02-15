import { useState, useEffect, useCallback } from "react";
import { useNavigate, createSearchParams } from "react-router";
import { Input } from "../components/ui/input";
import type { VehicleCategory } from "~/lib/types";
import {
  XIcon,
  SearchIcon,
  Motorbike,
  CarIcon,
  CheckIcon,
  BuildingIcon,
  MapPinIcon,
} from "lucide-react";
import { useRentVehicles } from "../context/rent-vehicles-context";

interface UnifiedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "location" | "vehicle";

export function UnifiedSearchModal({
  isOpen,
  onClose,
}: UnifiedSearchModalProps) {
  const navigate = useNavigate();

  const { setIsModalOpen } = useRentVehicles();
  // Local state
  const [activeTab, setActiveTab] = useState<TabType>("location");
  const [searchQuery, setSearchQuery] = useState("");

  // City-based location state (fetched from API)
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<VehicleCategory>("motorcycle");

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
    setActiveTab("vehicle");
  }, []);

  // Filter cities by search query
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hasResults = filteredCities.length > 0;

  // Check if search is ready
  const canSearch = selectedCity !== null && selectedCategory;

  const handleSearch = () => {
    if (canSearch) {
      const searchParams = createSearchParams({
        city: selectedCity || "", // Ensure empty string if null, though check ensures not null
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
