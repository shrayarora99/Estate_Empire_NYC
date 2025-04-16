import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg"; 
  showLabel?: boolean;
  className?: string;
  animate?: boolean;
}

export default function ScoreRing({ 
  score, 
  size = "md", 
  showLabel = true, 
  className,
  animate = true
}: ScoreRingProps) {
  const [animated, setAnimated] = useState(false);
  
  // Calculate the circumference and offset based on score
  const getCircleParams = () => {
    let radius, strokeWidth, fontSize;
    
    switch (size) {
      case "sm":
        radius = 8;
        strokeWidth = 3;
        fontSize = "text-xs";
        break;
      case "lg":
        radius = 35;
        strokeWidth = 6;
        fontSize = "text-2xl";
        break;
      case "md":
      default:
        radius = 30;
        strokeWidth = 5;
        fontSize = "text-lg";
        break;
    }
    
    const normalizedScore = Math.max(0, Math.min(100, score));
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (normalizedScore / 100) * circumference;
    
    return { radius, strokeWidth, fontSize, circumference, dashOffset };
  };
  
  const { radius, strokeWidth, fontSize, circumference, dashOffset } = getCircleParams();
  const svgSize = radius * 2 + strokeWidth * 2;
  const center = svgSize / 2;
  
  // Score color based on value
  const getScoreColor = () => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimated(true);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setAnimated(true);
    }
  }, [animate]);
  
  return (
    <div className={cn("relative inline-flex", className)}>
      <svg className={`w-[${svgSize}px] h-[${svgSize}px]`} width={svgSize} height={svgSize}>
        <circle 
          className="text-gray-200" 
          strokeWidth={strokeWidth} 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx={center} 
          cy={center}
        />
        <circle 
          className={cn(
            getScoreColor(), 
            "transition-all duration-1500 ease-out",
            "score-ring"
          )} 
          strokeWidth={strokeWidth} 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx={center} 
          cy={center} 
          strokeDasharray={circumference} 
          strokeDashoffset={animated ? dashOffset : circumference}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold font-mono", fontSize)}>{score}</span>
        </div>
      )}
    </div>
  );
}
