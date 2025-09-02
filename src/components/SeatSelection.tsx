import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SeatSelectionProps {
  bus: any;
  passengers: number;
  onSeatsSelected: (seats: string[]) => void;
}

const SeatSelection = ({ bus, passengers, onSeatsSelected }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  // Generate seat layout (2+2 configuration for AC buses)
  const generateSeats = () => {
    const seats = [];
    const totalSeats = 40;
    const occupiedSeats = Math.floor(Math.random() * 10) + 5; // Random occupied seats
    const occupiedSeatNumbers = Array.from({length: occupiedSeats}, () => 
      Math.floor(Math.random() * totalSeats) + 1
    );
    
    for (let i = 1; i <= totalSeats; i++) {
      const seatNumber = `${String.fromCharCode(65 + Math.floor((i-1)/4))}${((i-1)%4)+1}`;
      seats.push({
        number: seatNumber,
        position: (i-1) % 4,
        isOccupied: occupiedSeatNumbers.includes(i),
        isSleeper: bus.type.includes("Sleeper"),
        price: bus.basePrice + (Math.floor((i-1)/8) * 50) // Different price tiers
      });
    }
    return seats;
  };

  const seats = generateSeats();

  const handleSeatClick = (seatNumber: string) => {
    const seat = seats.find(s => s.number === seatNumber);
    if (seat?.isOccupied) return;
    
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < passengers) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const getSeatColor = (seat: any) => {
    if (seat.isOccupied) return "bg-slate-300 cursor-not-allowed border-slate-300";
    if (selectedSeats.includes(seat.number)) return "bg-green-500 text-white border-green-600 hover:bg-green-600";
    return "bg-white border-slate-300 hover:bg-slate-100 cursor-pointer";
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatNumber) => {
      const seat = seats.find(s => s.number === seatNumber);
      return total + (seat?.price || 0);
    }, 0);
  };

  const handleConfirmSelection = () => {
    if (selectedSeats.length === passengers) {
      onSeatsSelected(selectedSeats);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Your Seats</h2>
        <p className="text-slate-600">Choose {passengers} seat(s) for your journey</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seat Map */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <CardTitle className="text-slate-800">Seat Layout - {bus.operator}</CardTitle>
                <Badge variant="outline" className="bg-slate-100 text-slate-700">
                  {bus.type}
                </Badge>
              </div>
              <p className="text-slate-600 text-sm">
                {bus.departure} → {bus.arrival}
              </p>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="flex justify-center mb-6">
                <div className="bg-slate-800 px-6 py-3 rounded-lg text-white text-sm font-medium">
                  Driver's Cabin
                </div>
              </div>
              
              <div className="space-y-4">
                {Array.from({length: 10}, (_, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center space-x-4">
                    <div className="flex space-x-3">
                      {seats.slice(rowIndex * 4, rowIndex * 4 + 2).map((seat) => (
                        <TooltipProvider key={seat.number}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() => handleSeatClick(seat.number)}
                                className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 ${getSeatColor(seat)}`}
                              >
                                {seat.number}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                {seat.isOccupied ? "Occupied" : "Available"} - ₦{seat.price.toLocaleString()}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                    
                    <div className="w-12 flex items-center justify-center">
                      <div className="w-full h-1 bg-slate-200 rounded"></div>
                    </div>
                    
                    <div className="flex space-x-3">
                      {seats.slice(rowIndex * 4 + 2, rowIndex * 4 + 4).map((seat) => (
                        <TooltipProvider key={seat.number}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() => handleSeatClick(seat.number)}
                                className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 ${getSeatColor(seat)}`}
                              >
                                {seat.number}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                {seat.isOccupied ? "Occupied" : "Available"} - ₦{seat.price.toLocaleString()}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex justify-center space-x-8 mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-white border-2 border-slate-300 rounded"></div>
                  <span className="text-slate-600 text-sm">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 border-2 border-green-600 rounded"></div>
                  <span className="text-slate-600 text-sm">Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-slate-300 border-2 border-slate-300 rounded"></div>
                  <span className="text-slate-600 text-sm">Occupied</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Selection Summary */}
        <div>
          <Card className="border-slate-200 shadow-sm sticky top-4">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-slate-800">Selection Summary</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-slate-500 mr-2" />
                    <span className="text-slate-700">Passengers</span>
                  </div>
                  <span className="text-slate-800 font-semibold">{passengers}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Seats Selected</span>
                  <span className="text-slate-800 font-semibold">{selectedSeats.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Seats Remaining</span>
                  <span className="text-slate-800 font-semibold">{passengers - selectedSeats.length}</span>
                </div>
              </div>
              
              {selectedSeats.length > 0 && (
                <div>
                  <h4 className="text-slate-700 font-medium mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-slate-500" />
                    Selected Seats
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => {
                      const seatData = seats.find(s => s.number === seat);
                      return (
                        <TooltipProvider key={seat}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 cursor-default">
                                {seat} - ₦{seatData?.price.toLocaleString()}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Seat {seat}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-700 font-medium">Total Amount:</span>
                  <span className="text-slate-800 font-bold text-xl">₦{getTotalPrice().toLocaleString()}</span>
                </div>
                
                <Button 
                  onClick={handleConfirmSelection}
                  disabled={selectedSeats.length !== passengers}
                  className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                >
                  {selectedSeats.length === passengers 
                    ? "Continue to Payment" 
                    : `Select ${passengers - selectedSeats.length} more seat(s)`
                  }
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <p className="text-xs text-slate-500 text-center mt-3">
                  Seats are reserved for 10 minutes during booking
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;