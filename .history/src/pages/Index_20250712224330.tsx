
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bus, Ticket, TrendingUp, Clock, MapPin, Users } from "lucide-react";
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

  const buses = [
    {
      id: 1,
      operator: "BRT Lagos",
      departure: "06:00",
      arrival: "07:30",
      duration: "1h 30m",
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
      arrival: "10:00",
      duration: "1h 45m",
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
      arrival: "09:15",
      duration: "1h 45m",
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-700">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Bus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Lagos SmartBus</h1>
              <p className="text-green-100 text-sm">AN INTELLIGENT BUS TICKET BOOKING SYSTEM WITH PRICE
PREDICTION USING DECISION TREES ALGORITHM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step
                    ? "bg-white text-green-900"
                    : "bg-white/20 text-white/60"
                } transition-all duration-300`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Search */}
        {currentStep === 1 && (
          <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center text-2xl">
                Find Your Journey in Lagos State
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="from" className="text-white">From</Label>
                  <Select onValueChange={(value) => setSearchData({...searchData, from: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                  <Label htmlFor="to" className="text-white">To</Label>
                  <Select onValueChange={(value) => setSearchData({...searchData, to: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                  <Label htmlFor="date" className="text-white">Travel Date</Label>
                  <Input
                    type="date"
                    value={searchData.date}
                    onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="passengers" className="text-white">Passengers</Label>
                  <Select onValueChange={(value) => setSearchData({...searchData, passengers: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                className="w-full bg-white text-green-900 hover:bg-green-50 text-lg py-6"
                disabled={!searchData.from || !searchData.to || !searchData.date}
              >
                <Ticket className="mr-2 h-5 w-5" />
                Search Buses
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Bus Selection */}
        {currentStep === 2 && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {lagosStateCities.find(c => c.value === searchData.from)?.label} → {lagosStateCities.find(c => c.value === searchData.to)?.label}
              </h2>
              <p className="text-green-100">
                {new Date(searchData.date).toLocaleDateString()} • {searchData.passengers} passenger(s)
              </p>
            </div>
            
            <div className="grid gap-4">
              {buses.map((bus) => (
                <Card key={bus.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{bus.operator}</h3>
                        <p className="text-green-100">{bus.type}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-white ml-1">{bus.rating}</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-4">
                          <div>
                            <p className="text-white font-semibold">{bus.departure}</p>
                            <p className="text-green-100 text-sm">{lagosStateCities.find(c => c.value === searchData.from)?.label}</p>
                          </div>
                          <div className="flex-1 border-t border-white/30 relative">
                            <Bus className="absolute -top-2 left-1/2 transform -translate-x-1/2 h-4 w-4 text-white bg-green-800 rounded-full p-1" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{bus.arrival}</p>
                            <p className="text-green-100 text-sm">{lagosStateCities.find(c => c.value === searchData.to)?.label}</p>
                          </div>
                        </div>
                        <p className="text-green-100 text-sm mt-2">{bus.duration}</p>
                      </div>
                      
                      <div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {bus.amenities.map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="bg-white/20 text-white text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-green-100">
                          <Users className="inline h-4 w-4 mr-1" />
                          {bus.seatsAvailable} seats available
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <PricePrediction 
                          basePrice={bus.basePrice}
                          busData={bus}
                          searchData={searchData}
                          onPriceCalculated={setPredictedPrice}
                        />
                        <Button 
                          onClick={() => handleBusSelect(bus)}
                          className="bg-white text-green-900 hover:bg-green-50 mt-3"
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
