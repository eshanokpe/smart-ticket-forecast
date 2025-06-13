
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Phone, Mail, User, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  bus: any;
  seats: string[];
  searchData: any;
  predictedPrice: number;
}

const BookingForm = ({ bus, seats, searchData, predictedPrice }: BookingFormProps) => {
  const { toast } = useToast();
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [passengers, setPassengers] = useState(
    Array.from({ length: seats.length }, () => ({
      name: "",
      age: "",
      gender: ""
    }))
  );
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: ""
  });

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const totalPrice = predictedPrice * seats.length;
  const taxes = Math.round(totalPrice * 0.05);
  const convenience = 50;
  const finalAmount = totalPrice + taxes + convenience;

  const isFormValid = () => {
    return passengers.every(p => p.name && p.age && p.gender) && 
           contactInfo.email && contactInfo.phone;
  };

  const handleBooking = async () => {
    if (!isFormValid()) return;
    
    setIsBooking(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsBooked(true);
    setIsBooking(false);
    
    toast({
      title: "Booking Confirmed!",
      description: `Your tickets have been booked successfully. Booking ID: #BK${Date.now()}`,
    });
  };

  if (isBooked) {
    return (
      <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-blue-100 mb-6">
            Your ticket has been sent to {contactInfo.email}
          </p>
          
          <div className="bg-white/5 p-4 rounded-lg mb-6">
            <div className="text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-100">Booking ID:</span>
                <span className="text-white font-mono">#BK{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Route:</span>
                <span className="text-white">{searchData.from} → {searchData.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Date:</span>
                <span className="text-white">{new Date(searchData.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Seats:</span>
                <span className="text-white">{seats.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Total Amount:</span>
                <span className="text-white font-semibold">₹{finalAmount}</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.reload()}
            className="bg-white text-blue-900 hover:bg-blue-50"
          >
            Book Another Ticket
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Passenger Details Form */}
      <div className="lg:col-span-2">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Passenger Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {passengers.map((passenger, index) => (
              <div key={index} className="space-y-4 p-4 bg-white/5 rounded-lg">
                <h3 className="text-white font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Passenger {index + 1} - Seat {seats[index]}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`name-${index}`} className="text-white">Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Full Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`age-${index}`} className="text-white">Age</Label>
                    <Input
                      id={`age-${index}`}
                      type="number"
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Age"
                      min="1"
                      max="120"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`gender-${index}`} className="text-white">Gender</Label>
                    <Select onValueChange={(value) => handlePassengerChange(index, "gender", value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            
            <Separator className="bg-white/20" />
            
            <div className="space-y-4">
              <h3 className="text-white font-medium flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-white">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Summary */}
      <div>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 sticky top-4">
          <CardHeader>
            <CardTitle className="text-white">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-100">Operator:</span>
                <span className="text-white font-medium">{bus.operator}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-100">Route:</span>
                <span className="text-white">{searchData.from} → {searchData.to}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-100">Date:</span>
                <span className="text-white">{new Date(searchData.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-100">Time:</span>
                <span className="text-white">{bus.departure} - {bus.arrival}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-100">Seats:</span>
                <div className="flex flex-wrap gap-1">
                  {seats.map((seat) => (
                    <Badge key={seat} className="bg-green-500 text-white text-xs">
                      {seat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator className="bg-white/20" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-100">Base Fare ({seats.length} × ₹{predictedPrice}):</span>
                <span className="text-white">₹{totalPrice}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-100">Taxes & Fees:</span>
                <span className="text-white">₹{taxes}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-100">Convenience Fee:</span>
                <span className="text-white">₹{convenience}</span>
              </div>
            </div>
            
            <Separator className="bg-white/20" />
            
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Total Amount:</span>
              <span className="text-white">₹{finalAmount}</span>
            </div>
            
            <Button 
              onClick={handleBooking}
              disabled={!isFormValid() || isBooking}
              className="w-full bg-white text-blue-900 hover:bg-blue-50 py-6 text-lg"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              {isBooking ? "Processing..." : `Pay ₹${finalAmount}`}
            </Button>
            
            <p className="text-xs text-blue-200 text-center">
              Secure payment powered by 256-bit SSL encryption
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingForm;
