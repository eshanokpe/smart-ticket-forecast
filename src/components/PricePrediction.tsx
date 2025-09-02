import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PricePredictionProps {
  basePrice: number;
  busData: any;
  searchData: any;
  onPriceCalculated: (price: number) => void;
}

const PricePrediction = ({ basePrice, busData, searchData, onPriceCalculated }: PricePredictionProps) => {
  const [predictedPrice, setPredictedPrice] = useState(basePrice);
  const [priceFactors, setPriceFactors] = useState<any[]>([]);

  useEffect(() => {
    const calculatePrice = () => {
      let finalPrice = basePrice;
      const factors: any[] = [];
      
      // Decision Tree Algorithm Implementation for Lagos Traffic & Transport
      
      // Factor 1: Time of Travel (Lagos Traffic Patterns)
      const hour = parseInt(busData.departure.split(':')[0]);
      if (hour >= 6 && hour <= 10) {
        // Morning rush hour - Lagos heavy traffic
        finalPrice *= 1.25;
        factors.push({ name: "Morning Rush", change: "+25%", type: "increase" });
      } else if (hour >= 16 && hour <= 20) {
        // Evening rush hour - Lagos heavy traffic
        finalPrice *= 1.20;
        factors.push({ name: "Evening Rush", change: "+20%", type: "increase" });
      } else if (hour >= 22 || hour <= 5) {
        // Night travel - less traffic but safety premium
        finalPrice *= 1.05;
        factors.push({ name: "Night Service", change: "+5%", type: "increase" });
      }
      
      // Factor 2: Availability (Lagos High Demand Routes)
      if (busData.seatsAvailable <= 5) {
        finalPrice *= 1.30;
        factors.push({ name: "Very High Demand", change: "+30%", type: "increase" });
      } else if (busData.seatsAvailable <= 10) {
        finalPrice *= 1.15;
        factors.push({ name: "High Demand", change: "+15%", type: "increase" });
      } else if (busData.seatsAvailable >= 20) {
        finalPrice *= 0.90;
        factors.push({ name: "Good Availability", change: "-10%", type: "decrease" });
      }
      
      // Factor 3: Bus Type Premium (Lagos Transport Classes)
      if (busData.type.includes("Executive")) {
        finalPrice *= 1.15;
        factors.push({ name: "Executive Class", change: "+15%", type: "increase" });
      } else if (busData.type.includes("Premium")) {
        finalPrice *= 1.08;
        factors.push({ name: "Premium Service", change: "+8%", type: "increase" });
      }
      
      // Factor 4: Day of Week (Lagos Weekend Patterns)
      const travelDate = new Date(searchData.date);
      const dayOfWeek = travelDate.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        // Friday/Saturday - Weekend travel
        finalPrice *= 1.10;
        factors.push({ name: "Weekend Travel", change: "+10%", type: "increase" });
      } else if (dayOfWeek === 0) {
        // Sunday - Church/event traffic
        finalPrice *= 1.08;
        factors.push({ name: "Sunday Premium", change: "+8%", type: "increase" });
      }
      
      // Factor 5: Advance Booking Incentive
      const today = new Date();
      const daysDifference = Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (daysDifference >= 3) {
        finalPrice *= 0.85;
        factors.push({ name: "Early Booking", change: "-15%", type: "decrease" });
      } else if (daysDifference <= 0) {
        finalPrice *= 1.20;
        factors.push({ name: "Same Day Booking", change: "+20%", type: "increase" });
      }
      
      // Factor 6: Service Rating Premium
      if (busData.rating >= 4.5) {
        finalPrice *= 1.05;
        factors.push({ name: "Premium Operator", change: "+5%", type: "increase" });
      }
      
      // Factor 7: Route Distance/Traffic (Lagos Specific)
      if (searchData.from === "lekki" || searchData.to === "lekki" || 
          searchData.from === "victoria-island" || searchData.to === "victoria-island") {
        finalPrice *= 1.12;
        factors.push({ name: "Premium Route", change: "+12%", type: "increase" });
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
      <div className="flex items-center justify-center space-x-2 mb-1">
        <span className="text-slate-500 text-sm line-through">₦{basePrice.toLocaleString()}</span>
        {priceDifference > 0 ? (
          <TrendingUp className="h-4 w-4 text-red-500" />
        ) : priceDifference < 0 ? (
          <TrendingDown className="h-4 w-4 text-green-500" />
        ) : (
          <Minus className="h-4 w-4 text-slate-400" />
        )}
      </div>
      
      <div className="text-2xl font-bold text-slate-800">₦{predictedPrice.toLocaleString()}</div>
      
      <div className={`text-sm font-medium mb-3 ${priceDifference > 0 ? 'text-red-500' : priceDifference < 0 ? 'text-green-500' : 'text-slate-500'}`}>
        {priceDifference > 0 ? '+' : ''}₦{Math.abs(priceDifference).toLocaleString()} ({percentageChange > 0 ? '+' : ''}{percentageChange}%)
      </div>
      
      <TooltipProvider>
        <div className="flex flex-wrap justify-center gap-1 mb-2">
          {priceFactors.slice(0, 3).map((factor, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Badge 
                  variant="secondary" 
                  className={`text-xs cursor-help ${
                    factor.type === 'increase' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {factor.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{factor.name}: {factor.change}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {priceFactors.length > 3 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-slate-100 text-slate-600 text-xs cursor-help">
                  +{priceFactors.length - 3} more
                  <Info className="h-3 w-3 ml-1" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs font-medium mb-1">All price factors:</p>
                <div className="space-y-1">
                  {priceFactors.map((factor, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-xs">{factor.name}</span>
                      <span className={`text-xs ${factor.type === 'increase' ? 'text-red-500' : 'text-green-500'}`}>
                        {factor.change}
                      </span>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
      
      <div className="text-xs text-slate-500 mt-1">
        AI-powered price prediction
      </div>
    </div>
  );
};

export default PricePrediction;