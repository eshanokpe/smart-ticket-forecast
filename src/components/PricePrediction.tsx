
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PricePredictionProps {
  basePrice: number;
  busData: any;
  searchData: any;
  onPriceCalculated: (price: number) => void;
}

const PricePrediction = ({ basePrice, busData, searchData, onPriceCalculated }: PricePredictionProps) => {
  const [predictedPrice, setPredictedPrice] = useState(basePrice);
  const [priceFactors, setPriceFactors] = useState([]);

  useEffect(() => {
    const calculatePrice = () => {
      let finalPrice = basePrice;
      const factors = [];
      
      // Decision Tree Algorithm Implementation
      
      // Factor 1: Time of Travel
      const hour = parseInt(busData.departure.split(':')[0]);
      if (hour >= 6 && hour <= 10) {
        // Morning peak
        finalPrice *= 1.15;
        factors.push({ name: "Morning Peak", change: "+15%", type: "increase" });
      } else if (hour >= 18 && hour <= 22) {
        // Evening peak
        finalPrice *= 1.10;
        factors.push({ name: "Evening Peak", change: "+10%", type: "increase" });
      } else if (hour >= 22 || hour <= 5) {
        // Night travel discount
        finalPrice *= 0.95;
        factors.push({ name: "Night Travel", change: "-5%", type: "decrease" });
      }
      
      // Factor 2: Availability (Scarcity Pricing)
      if (busData.seatsAvailable <= 5) {
        finalPrice *= 1.20;
        factors.push({ name: "High Demand", change: "+20%", type: "increase" });
      } else if (busData.seatsAvailable <= 10) {
        finalPrice *= 1.10;
        factors.push({ name: "Limited Seats", change: "+10%", type: "increase" });
      } else if (busData.seatsAvailable >= 20) {
        finalPrice *= 0.90;
        factors.push({ name: "Good Availability", change: "-10%", type: "decrease" });
      }
      
      // Factor 3: Bus Type Premium
      if (busData.type.includes("Sleeper")) {
        finalPrice *= 1.08;
        factors.push({ name: "Sleeper Premium", change: "+8%", type: "increase" });
      }
      
      // Factor 4: Day of Week
      const travelDate = new Date(searchData.date);
      const dayOfWeek = travelDate.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        // Friday/Saturday
        finalPrice *= 1.12;
        factors.push({ name: "Weekend", change: "+12%", type: "increase" });
      } else if (dayOfWeek === 0) {
        // Sunday
        finalPrice *= 1.05;
        factors.push({ name: "Sunday", change: "+5%", type: "increase" });
      }
      
      // Factor 5: Advance Booking
      const today = new Date();
      const daysDifference = Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (daysDifference >= 7) {
        finalPrice *= 0.88;
        factors.push({ name: "Early Booking", change: "-12%", type: "decrease" });
      } else if (daysDifference <= 1) {
        finalPrice *= 1.15;
        factors.push({ name: "Last Minute", change: "+15%", type: "increase" });
      }
      
      // Factor 6: Rating Premium
      if (busData.rating >= 4.5) {
        finalPrice *= 1.05;
        factors.push({ name: "Premium Service", change: "+5%", type: "increase" });
      }
      
      const roundedPrice = Math.round(finalPrice);
      setPredictedPrice(roundedPrice);
      setPriceFactors(factors);
      onPriceCalculated(roundedPrice);
    };
    
    calculatePrice();
  }, [basePrice, busData, searchData, onPriceCalculated]);

  const priceDifference = predictedPrice - basePrice;
  const percentageChange = parseFloat(((priceDifference / basePrice) * 100).toFixed(1));

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2 mb-2">
        <span className="text-white/60 line-through">₹{basePrice}</span>
        {priceDifference > 0 ? (
          <TrendingUp className="h-4 w-4 text-red-400" />
        ) : priceDifference < 0 ? (
          <TrendingDown className="h-4 w-4 text-green-400" />
        ) : (
          <Minus className="h-4 w-4 text-white" />
        )}
      </div>
      
      <div className="text-2xl font-bold text-white">₹{predictedPrice}</div>
      
      <div className="text-sm text-blue-100 mb-3">
        {priceDifference > 0 ? '+' : ''}₹{priceDifference} ({percentageChange > 0 ? '+' : ''}{percentageChange}%)
      </div>
      
      <div className="space-y-1">
        {priceFactors.slice(0, 3).map((factor, index) => (
          <Badge 
            key={index}
            variant="secondary" 
            className={`text-xs ${
              factor.type === 'increase' 
                ? 'bg-red-500/20 text-red-200' 
                : 'bg-green-500/20 text-green-200'
            }`}
          >
            {factor.name} {factor.change}
          </Badge>
        ))}
        {priceFactors.length > 3 && (
          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
            +{priceFactors.length - 3} more factors
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PricePrediction;
