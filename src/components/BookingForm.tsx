import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Phone, Mail, User, CreditCard, ArrowLeft, MapPin, Calendar, Clock } from "lucide-react";
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

  // Lagos State cities for display
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

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const totalPrice = predictedPrice * seats.length;
  const taxes = Math.round(totalPrice * 0.075); // 7.5% VAT in Nigeria
  const convenience = 100; // ₦100 convenience fee
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
      description: `Your Lagos bus tickets have been booked successfully. Booking ID: #LG${Date.now()}`,
    });
  };

  if (isBooked) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg border-slate-200">
        <CardContent className="p-8 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
          <p className="text-slate-600 mb-6">
            Your ticket has been sent to {contactInfo.email}
          </p>
          
          <div className="bg-slate-50 p-6 rounded-lg mb-6 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Booking ID:</span>
                <span className="text-slate-800 font-mono">#LG{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Route:</span>
                <span className="text-slate-800">
                  {lagosStateCities.find(c => c.value === searchData.from)?.label} → {lagosStateCities.find(c => c.value === searchData.to)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date:</span>
                <span className="text-slate-800">{new Date(searchData.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Seats:</span>
                <span className="text-slate-800">{seats.join(", ")}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span className="text-slate-800">Total Amount:</span>
                <span className="text-slate-800">₦{finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700"
            >
              Book Another Ticket
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
            >
              Print Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="text-slate-600 hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to bus selection
        </Button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Complete Your Booking</h2>
        <p className="text-slate-600">Fill in passenger details to secure your seats</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Passenger Details Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-slate-800">Passenger Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {passengers.map((passenger, index) => (
                <div key={index} className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <h3 className="text-slate-800 font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-slate-500" />
                    Passenger {index + 1} - Seat {seats[index]}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`} className="text-slate-700">Full Name *</Label>
                      <Input
                        id={`name-${index}`}
                        value={passenger.name}
                        onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                        className="border-slate-300 text-slate-800"
                        placeholder="Enter full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`age-${index}`} className="text-slate-700">Age *</Label>
                      <Input
                        id={`age-${index}`}
                        type="number"
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                        className="border-slate-300 text-slate-800"
                        placeholder="Age"
                        min="1"
                        max="120"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`gender-${index}`} className="text-slate-700">Gender *</Label>
                      <Select onValueChange={(value) => handlePassengerChange(index, "gender", value)}>
                        <SelectTrigger className="border-slate-300 text-slate-800">
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
              
              <Separator className="bg-slate-200" />
              
              <div className="space-y-4">
                <h3 className="text-slate-800 font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-slate-500" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-slate-700">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      className="border-slate-300 text-slate-800"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-slate-700">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      className="border-slate-300 text-slate-800"
                      placeholder="+234 8012345678"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Booking Summary */}
        <div>
          <Card className="border-slate-200 shadow-sm sticky top-4">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-slate-800">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-slate-600 block text-sm">Operator:</span>
                    <span className="text-slate-800 font-medium">{bus.operator}</span>
                  </div>
                  <Badge variant="outline" className="bg-slate-100 text-slate-700">
                    {bus.type}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-slate-800 text-sm">
                      {lagosStateCities.find(c => c.value === searchData.from)?.label} → {lagosStateCities.find(c => c.value === searchData.to)?.label}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-slate-600 mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">Date</span>
                    </div>
                    <span className="text-slate-800 text-sm font-medium">{new Date(searchData.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-slate-600 mb-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">Time</span>
                    </div>
                    <span className="text-slate-800 text-sm font-medium">{bus.departure} - {bus.arrival}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-slate-600 block text-sm mb-1">Seats:</span>
                  <div className="flex flex-wrap gap-1">
                    {seats.map((seat) => (
                      <Badge key={seat} className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator className="bg-slate-200" />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Fare ({seats.length} × ₦{predictedPrice.toLocaleString()}):</span>
                  <span className="text-slate-800">₦{totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">VAT (7.5%):</span>
                  <span className="text-slate-800">₦{taxes.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Service Fee:</span>
                  <span className="text-slate-800">₦{convenience.toLocaleString()}</span>
                </div>
              </div>
              
              <Separator className="bg-slate-200" />
              
              <div className="flex justify-between text-lg font-bold">
                <span className="text-slate-800">Total Amount:</span>
                <span className="text-slate-800">₦{finalAmount.toLocaleString()}</span>
              </div>
              
              <Button 
                onClick={handleBooking}
                disabled={!isFormValid() || isBooking}
                className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {isBooking ? "Processing..." : `Pay ₦${finalAmount.toLocaleString()}`}
              </Button>
              
              <p className="text-xs text-slate-500 text-center">
                Secure payment with bank transfer, card, or mobile money
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;