
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    if (seat.isOccupied) return "bg-red-500 cursor-not-allowed";
    if (selectedSeats.includes(seat.number)) return "bg-green-500 text-white";
    return "bg-white/80 hover:bg-blue-200 cursor-pointer";
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
    <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-center">
          Select Seats - {bus.operator}
        </CardTitle>
        <div className="text-center text-blue-100">
          {bus.departure} → {bus.arrival} • {bus.type}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 p-6 rounded-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-600 px-4 py-2 rounded text-white text-sm">
                  Driver
                </div>
              </div>
              
              <div className="space-y-4">
                {Array.from({length: 10}, (_, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center space-x-2">
                    <div className="flex space-x-1">
                      {seats.slice(rowIndex * 4, rowIndex * 4 + 2).map((seat) => (
                        <div
                          key={seat.number}
                          onClick={() => handleSeatClick(seat.number)}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${getSeatColor(seat)}`}
                        >
                          {seat.number}
                        </div>
                      ))}
                    </div>
                    
                    <div className="w-8"></div> {/* Aisle */}
                    
                    <div className="flex space-x-1">
                      {seats.slice(rowIndex * 4 + 2, rowIndex * 4 + 4).map((seat) => (
                        <div
                          key={seat.number}
                          onClick={() => handleSeatClick(seat.number)}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${getSeatColor(seat)}`}
                        >
                          {seat.number}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex justify-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white/80 rounded"></div>
                  <span className="text-white text-sm">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-white text-sm">Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-white text-sm">Occupied</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Selection Summary */}
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Selection Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-white">
                  <span>Passengers:</span>
                  <span>{passengers}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Selected:</span>
                  <span>{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Remaining:</span>
                  <span>{passengers - selectedSeats.length}</span>
                </div>
              </div>
              
              {selectedSeats.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-white text-sm mb-2">Selected Seats:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedSeats.map((seat) => (
                      <Badge key={seat} className="bg-green-500 text-white">
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total:</span>
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleConfirmSelection}
              disabled={selectedSeats.length !== passengers}
              className="w-full bg-white text-blue-900 hover:bg-blue-50"
            >
              {selectedSeats.length === passengers 
                ? "Proceed to Booking" 
                : `Select ${passengers - selectedSeats.length} more seat(s)`
              }
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeatSelection;
