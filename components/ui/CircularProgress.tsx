import React from "react";

interface CircularProgressProps {
  //나중에 progress는 삭제가능 아바타를 위한것
  progress: number; // 0~100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 40,
  strokeWidth = 6,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "#fecaca";     // red-100
    if (progress < 60) return "#fef9c3";     // yellow-100
    return "#bbf7d0";                        // green-100
  };

  const progressColor = getProgressColor(progress);

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="gray"
          strokeWidth={strokeWidth}
          opacity="0.2"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-700">
        {progress}%
      </div>
    </div>
  );
};

export default CircularProgress;
