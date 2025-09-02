import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bus, Ticket, TrendingUp, Clock, MapPin, Users, ArrowRight, ChevronRight, Star } from "lucide-react";
import PricePrediction from "@/components/PricePrediction";
import SeatSelection from "@/components/SeatSelection";
import BookingForm from "@/components/BookingForm";

const Index = () => {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1"
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [predictedPrice, setPredictedPrice] = useState(null);

  // Lagos State cities and major destinations
  const lagosStateCities = [
    { value: "ikeja", label: "Ikeja" },
    { value: "lagos-island", label: "Lagos Island" },
    { value: "victoria-island", label: "Victoria Island" },
    { value: "ikoyi", label: "Ikoyi" },
    { value: "surulere", label: "Surulere" },
    { value: "yaba", label: "Yaba" },
    { value: "mushin", label: "Mushin" },
    { value: "alaba", label: "Alaba" },
    { value: "ajah", label: "Ajah" },
    { value: "lekki", label: "Lekki" },
    { value: "epe", label: "Epe" },
    { value: "badagry", label: "Badagry" },
    { value: "ikorodu", label: "Ikorodu" },
    { value: "agege", label: "Agege" },
    { value: "oshodi", label: "Oshodi" },
    { value: "festac", label: "Festac Town" },
    { value: "maryland", label: "Maryland" },
    { value: "gbagada", label: "Gbagada" }
  ];

  // Helper to generate random duration and calculate arrival time
  const generateBusTimings = (departureTime: string) => {
    const minMinutes = 90; // 1h 30m
    const maxMinutes = 210; // 3h 30m
    const totalMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const duration = `${hours}h ${minutes}m`;

    const [depHours, depMinutes] = departureTime.split(':').map(Number);
    const departureDate = new Date();
    departureDate.setHours(depHours, depMinutes, 0, 0);

    const arrivalDate = new Date(departureDate.getTime() + totalMinutes * 60000);
    const arrHours = arrivalDate.getHours().toString().padStart(2, '0');
    const arrMinutes = arrivalDate.getMinutes().toString().padStart(2, '0');
    const arrival = `${arrHours}:${arrMinutes}`;

    return { duration, arrival };
  };

  const buses = [
    {
      id: 1,
      operator: "BRT Lagos",
      departure: "06:00",
      ...generateBusTimings("06:00"),
      type: "AC Standard",
      basePrice: 800,
      seatsAvailable: 15,
      rating: 4.5,
      amenities: ["WiFi", "AC", "CCTV", "Comfortable Seats"]
    },
    {
      id: 2,
      operator: "Primero Transport",
      departure: "08:15",
      ...generateBusTimings("08:15"),
      type: "AC Premium",
      basePrice: 1200,
      seatsAvailable: 8,
      rating: 4.2,
      amenities: ["WiFi", "AC", "USB Charging", "Entertainment"]
    },
    {
      id: 3,
      operator: "Lagos Ride",
      departure: "07:30",
      ...generateBusTimings("07:30"),
      type: "Executive",
      basePrice: 1500,
      seatsAvailable: 22,
      rating: 4.7,
      amenities: ["WiFi", "AC", "Leather Seats", "Refreshments", "Entertainment"]
    }
  ];

  const handleSearch = () => {
    if (searchData.from && searchData.to && searchData.date) {
      setCurrentStep(2);
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      // Reset state for subsequent steps
      if (step < 4) {
        setSelectedSeats([]);
      }
      if (step < 3) {
        setSelectedBus(null);  
      }
    }
  };

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    setCurrentStep(3);
  };

  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
    if (seats.length > 0) {
      setCurrentStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Bus className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Lagos SmartBus</h1>
                <p className="text-slate-600 text-sm">AN INTELLIGENT BUS TICKET BOOKING SYSTEM WITH PRICE PREDICTION USING DECISION TREES ALGORITHM</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-600">Live Booking</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {["Search", "Select Bus", "Select Seats", "Payment"].map((label, index) => {
              const step = index + 1;
              return (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center text-center w-24">
                    <div
                      onClick={() => handleStepClick(step)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        currentStep >= step
                          ? "bg-green-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      } transition-all duration-300 font-medium ${
                        step < currentStep
                          ? "cursor-pointer hover:bg-green-700"
                          : "cursor-default"
                      }`}
                    >
                      {step}
                    </div>
                    <p className={`mt-2 text-xs font-medium ${currentStep >= step ? 'text-slate-700' : 'text-slate-500'}`}>
                      {label}
                    </p>
                  </div>

                  {index < 3 && (
                    <div className={`w-12 h-0.5 mb-6 ${currentStep > step ? 'bg-green-600' : 'bg-slate-200'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Search */}
        {currentStep === 1 && (
          <Card className="max-w-4xl mx-auto shadow-lg border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-slate-800 text-center text-2xl">
                Find Your Journey in Lagos State
              </CardTitle>
              <p className="text-center text-slate-600 mt-2">Plan your trip with our intelligent booking system</p>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="from" className="text-slate-700 font-medium mb-2 block">From</Label>
                  <Select onValueChange={(value) => setSearchData({...searchData, from: value})}>
                    <SelectTrigger className="bg-white border-slate-300 text-slate-800 h-12">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {lagosStateCities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="to" className="text-slate-700 font-medium mb-2 block">To</Label>
                  <Select onValueChange={(value) => setSearchData({...searchData, to: value})}>
                    <SelectTrigger className="bg-white border-slate-300 text-slate-800 h-12">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {lagosStateCities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="date" className="text-slate-700 font-medium mb-2 block">Travel Date</Label>
                  <Input
                    type="date"
                    value={searchData.date}
                    onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                    className="bg-white border-slate-300 text-slate-800 h-12"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="passengers" className="text-slate-700 font-medium mb-2 block">Passengers</Label>
                  <Select onValueChange={(value) => setSearchData({...searchData, passengers: value})}>
                    <SelectTrigger className="bg-white border-slate-300 text-slate-800 h-12">
                      <SelectValue placeholder="1" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleSearch}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 h-auto"
                disabled={!searchData.from || !searchData.to || !searchData.date}
              >
                <Ticket className="mr-2 h-5 w-5" />
                Search Buses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Bus Selection */}
        {currentStep === 2 && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {lagosStateCities.find(c => c.value === searchData.from)?.label} 
                <ChevronRight className="inline mx-2 h-5 w-5 text-slate-500" />
                {lagosStateCities.find(c => c.value === searchData.to)?.label}
              </h2>
              <div className="flex flex-wrap gap-4">
                <p className="text-slate-600 flex items-center">
                  <span className="font-medium">{new Date(searchData.date).toLocaleDateString()}</span>
                </p>
                <p className="text-slate-600 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="font-medium">{searchData.passengers}</span> passenger(s)
                </p>
              </div>
            </div>
            
            <div className="grid gap-4">
              {buses.map((bus) => (
                <Card key={bus.id} className="border-slate-200 hover:border-green-300 hover:shadow-md transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      <div className="lg:col-span-3 p-6 border-r border-slate-100">
                        <h3 className="text-slate-800 font-semibold text-lg">{bus.operator}</h3>
                        <p className="text-slate-600">{bus.type}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(bus.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-slate-600 text-sm ml-1">{bus.rating}</span>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-4 p-6 border-r border-slate-100">
                        <div className="flex items-center justify-center space-x-6">
                          <div className="text-center">
                            <p className="text-slate-800 font-bold text-xl">{bus.departure}</p>
                            <p className="text-slate-600 text-sm mt-1">{lagosStateCities.find(c => c.value === searchData.from)?.label}</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-24 border-t border-slate-300 relative">
                              <Bus className="absolute -top-2 left-1/2 transform -translate-x-1/2 h-4 w-4 text-slate-500 bg-slate-100 rounded-full p-0.5" />
                            </div>
                            <p className="text-slate-500 text-xs mt-1">{bus.duration}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-800 font-bold text-xl">{bus.arrival}</p>
                            <p className="text-slate-600 text-sm mt-1">{lagosStateCities.find(c => c.value === searchData.to)?.label}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-3 p-6 border-r border-slate-100">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {bus.amenities.map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="bg-slate-100 text-slate-700 text-xs font-normal">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-slate-600 text-sm">
                          <Users className="inline h-4 w-4 mr-1" />
                          {bus.seatsAvailable} seats available
                        </p>
                      </div>
                      
                      <div className="lg:col-span-2 p-6">
                        <PricePrediction 
                          basePrice={bus.basePrice}
                          busData={bus}
                          searchData={searchData}
                          onPriceCalculated={setPredictedPrice}
                        />
                        <Button 
                          onClick={() => handleBusSelect(bus)}
                          className="w-full bg-green-600 hover:bg-green-700 mt-3"
                        >
                          Select Seats
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Seat Selection */}
        {currentStep === 3 && selectedBus && (
          <SeatSelection 
            bus={selectedBus}
            passengers={parseInt(searchData.passengers)}
            onSeatsSelected={handleSeatSelection}
          />
        )}

        {/* Step 4: Booking Form */}
        {currentStep === 4 && selectedBus && selectedSeats.length > 0 && (
          <BookingForm  
            bus={selectedBus}
            seats={selectedSeats}
            searchData={searchData}
            predictedPrice={predictedPrice}
          />
        )}
      </div>
    </div>
  );
};

export default Index;