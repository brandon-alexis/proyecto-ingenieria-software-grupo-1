import { useState, useMemo, useEffect } from "react";
import {
  Bus,
  MapPin,
  Navigation2,
  Menu,
  X,
  Settings,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { BusMapLeaflet } from "./components/BusMapLeaflet";
import { BusCard } from "./components/BusCard";
import { RouteSelector } from "./components/RouteSelector";
import { StopDetails } from "./components/StopDetails";
import { BusDetails } from "./components/BusDetails";
import { SearchBar } from "./components/SearchBar";
import { AdminPanel } from "./components/AdminPanel";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import {
  buses as mockBuses,
  busStops as mockStops,
  routes as mockRoutes,
  drivers as mockDrivers,
} from "./data/mockData";
import { Bus as BusType, BusStop, Route, Driver } from "./types/bus";
import { User, LoginData, RegisterData } from "./types/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { authService } from "./services/authService";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState<string>("");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  // State for managing buses, drivers, and stops
  const [buses, setBuses] = useState<BusType[]>(mockBuses);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [stops, setStops] = useState<BusStop[]>(mockStops);

  // Initialize auth service
  useEffect(() => {
    authService.initializeDefaultUsers();
  }, []);

  // Simulate real-time bus updates (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          // Simulate small movements
          const latChange = (Math.random() - 0.5) * 0.001;
          const lngChange = (Math.random() - 0.5) * 0.001;

          return {
            ...bus,
            currentLocation: {
              lat: bus.currentLocation.lat + latChange,
              lng: bus.currentLocation.lng + lngChange,
            },
          };
        }),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle login
  const handleLogin = (data: LoginData) => {
    try {
      const user = authService.login(data);
      setCurrentUser(user);
      setAuthError("");
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Error al iniciar sesión",
      );
    }
  };

  // Handle register
  const handleRegister = (data: RegisterData) => {
    try {
      const user = authService.register(data, "passenger");
      setCurrentUser(user);
      setAuthError("");
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Error al registrarse",
      );
    }
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setShowAdmin(false);
  };

  // Check if user is admin
  const isAdmin = authService.isAdmin(currentUser);

  // Add new bus
  const handleAddBus = (busData: {
    number: string;
    licensePlate: string;
    capacity: number;
    type: "express" | "local" | "shuttle";
    driverId?: string;
  }) => {
    const driver = busData.driverId
      ? drivers.find((d) => d.id === busData.driverId)
      : undefined;

    const newBus: BusType = {
      id: `bus-${Date.now()}`,
      number: busData.number,
      licensePlate: busData.licensePlate,
      capacity: busData.capacity,
      currentOccupancy: 0,
      status: "on-time",
      currentLocation: { lat: 40.7128, lng: -74.006 },
      nextStop: "Downtown Transit Center",
      estimatedArrival: "5 min",
      type: busData.type,
      driver,
      assignedStops: [],
    };

    setBuses([...buses, newBus]);
  };

  // Add new driver
  const handleAddDriver = (driverData: {
    name: string;
    licenseNumber: string;
    phone: string;
    email: string;
  }) => {
    const newDriver: Driver = {
      id: `driver-${Date.now()}`,
      ...driverData,
    };

    setDrivers([...drivers, newDriver]);
  };

  // Add new stop
  const handleAddStop = (stopData: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    amenities: string[];
  }) => {
    const newStop: BusStop = {
      id: `stop-${Date.now()}`,
      name: stopData.name,
      address: stopData.address,
      location: {
        lat: stopData.lat,
        lng: stopData.lng,
      },
      amenities: stopData.amenities,
    };

    setStops([...stops, newStop]);
  };

  // Assign stops to bus
  const handleAssignStops = (busId: string, stopIds: string[]) => {
    setBuses(
      buses.map((bus) =>
        bus.id === busId ? { ...bus, assignedStops: stopIds } : bus,
      ),
    );
  };

  // Delete bus
  const handleDeleteBus = (busId: string) => {
    setBuses(buses.filter((bus) => bus.id !== busId));
  };

  // Delete driver
  const handleDeleteDriver = (driverId: string) => {
    setDrivers(drivers.filter((driver) => driver.id !== driverId));
    // Remove driver assignment from buses
    setBuses(
      buses.map((bus) =>
        bus.driver?.id === driverId ? { ...bus, driver: undefined } : bus,
      ),
    );
  };

  // Delete stop
  const handleDeleteStop = (stopId: string) => {
    setStops(stops.filter((stop) => stop.id !== stopId));
    // Remove stop assignment from buses
    setBuses(
      buses.map((bus) => ({
        ...bus,
        assignedStops: bus.assignedStops?.filter((id) => id !== stopId) || [],
      })),
    );
  };

  // Filter buses based on search query
  const filteredBuses = useMemo(() => {
    if (!searchQuery) return buses;

    const query = searchQuery.toLowerCase();
    return buses.filter(
      (bus) =>
        bus.number.toLowerCase().includes(query) ||
        bus.nextStop.toLowerCase().includes(query) ||
        bus.type.toLowerCase().includes(query),
    );
  }, [searchQuery, buses]);

  // Filter routes based on search query
  const filteredRoutes = useMemo(() => {
    if (!searchQuery) return mockRoutes;

    const query = searchQuery.toLowerCase();
    return mockRoutes.filter(
      (route) =>
        route.number.toLowerCase().includes(query) ||
        route.name.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  // Filter stops based on search query
  const filteredStops = useMemo(() => {
    if (!searchQuery) return stops;

    const query = searchQuery.toLowerCase();
    return stops.filter((stop) => stop.name.toLowerCase().includes(query));
  }, [searchQuery, stops]);

  const handleStopClick = (stop: BusStop) => {
    setSelectedStop(stop);
    setSelectedBus(null);
  };

  const handleBusClick = (bus: BusType) => {
    setSelectedBus(bus);
    setSelectedStop(null);
  };

  // Show auth screen if not logged in
  if (!currentUser) {
    if (authView === "login") {
      return (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => {
            setAuthView("register");
            setAuthError("");
          }}
          error={authError}
        />
      );
    } else {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => {
            setAuthView("login");
            setAuthError("");
          }}
          error={authError}
        />
      );
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">BusTracker Pro</h1>
                <p className="text-xs text-slate-600">Real-time bus tracking</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live</span>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Navigation2 className="w-5 h-5 text-slate-700" />
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowAdmin(true)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Admin Panel"
              >
                <Settings className="w-5 h-5 text-slate-700" />
              </button>
            )}
            {currentUser && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm">
                  <UserIcon className="w-4 h-4" />
                  <span>{currentUser.name}</span>
                  <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-slate-700" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 transition-transform duration-300 flex flex-col`}
        >
          <div className="p-4 border-b border-slate-200">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          <div className="flex-1 overflow-auto">
            <Tabs defaultValue="buses" className="w-full">
              <TabsList className="w-full grid grid-cols-3 p-1 m-4 mb-0">
                <TabsTrigger value="buses" className="text-xs">
                  <Bus className="w-4 h-4 mr-1" />
                  Buses
                </TabsTrigger>
                <TabsTrigger value="routes" className="text-xs">
                  <Navigation2 className="w-4 h-4 mr-1" />
                  Routes
                </TabsTrigger>
                <TabsTrigger value="stops" className="text-xs">
                  <MapPin className="w-4 h-4 mr-1" />
                  Stops
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buses" className="p-4 space-y-3">
                {filteredBuses.length > 0 ? (
                  filteredBuses.map((bus) => (
                    <BusCard
                      key={bus.id}
                      bus={bus}
                      onClick={() => handleBusClick(bus)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No buses found
                  </div>
                )}
              </TabsContent>

              <TabsContent value="routes" className="p-4">
                <RouteSelector
                  routes={filteredRoutes}
                  selectedRoute={selectedRoute}
                  onSelectRoute={setSelectedRoute}
                />
              </TabsContent>

              <TabsContent value="stops" className="p-4 space-y-2">
                {filteredStops.length > 0 ? (
                  filteredStops.map((stop) => (
                    <button
                      key={stop.id}
                      onClick={() => handleStopClick(stop)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedStop?.id === stop.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-slate-700 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-semibold">{stop.name}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {stop.amenities.length} amenities
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No stops found
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Stats Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-semibold text-blue-600">
                  {buses.length}
                </div>
                <div className="text-xs text-slate-600">Active Buses</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-green-600">
                  {mockRoutes.length}
                </div>
                <div className="text-xs text-slate-600">Routes</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-purple-600">
                  {mockStops.length}
                </div>
                <div className="text-xs text-slate-600">Stops</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden">
          {/* Map */}
          <div className="absolute inset-0 p-4">
            <BusMapLeaflet
              buses={filteredBuses}
              stops={selectedRoute ? selectedRoute.stops : filteredStops}
              selectedRoute={selectedRoute}
              selectedBus={selectedBus}
              onStopClick={handleStopClick}
              onBusClick={handleBusClick}
              showAllRoutes={!selectedRoute && !selectedBus}
              allStops={stops}
            />
          </div>

          {/* Details Panel */}
          {(selectedStop || selectedBus) && (
            <>
              {/* Backdrop overlay para cerrar al hacer clic afuera */}
              <div
                className="absolute inset-0 bg-transparent z-[9999]"
                onClick={() => {
                  setSelectedStop(null);
                  setSelectedBus(null);
                }}
              />

              {/* Panel de detalles */}
              <div
                className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] overflow-auto z-[10000]"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedStop && (
                  <StopDetails
                    stop={selectedStop}
                    buses={buses}
                    onClose={() => setSelectedStop(null)}
                  />
                )}
                {selectedBus && (
                  <BusDetails
                    bus={selectedBus}
                    onClose={() => setSelectedBus(null)}
                  />
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel
          buses={buses}
          drivers={drivers}
          stops={stops}
          onAddBus={handleAddBus}
          onAddDriver={handleAddDriver}
          onAddStop={handleAddStop}
          onAssignStops={handleAssignStops}
          onDeleteBus={handleDeleteBus}
          onDeleteDriver={handleDeleteDriver}
          onDeleteStop={handleDeleteStop}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* Admin Button */}
      {isAdmin && !showAdmin && (
        <Button
          className="fixed bottom-20 right-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg z-50"
          onClick={() => setShowAdmin(true)}
        >
          <Settings className="w-5 h-5" />
        </Button>
      )}

      {/* User Panel */}
      {currentUser && (
        <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <UserIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs text-slate-500 capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
