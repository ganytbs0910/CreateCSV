'use client';
import React, { useRef, useState, useEffect } from 'react';

const VirusDashboard = () => {
  const svgRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  const metrics = [
    { label: "時間効率", value: 2 },
    { label: "限界トロ", value: 6 },
    { label: "疲れない", value: 9 },
    { label: "飽きない", value: 5 },
    { label: "勝率", value: 9 }
  ];

  const BASE_SIZE = 140;
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateDataPoints = () => {
    const angles = [270, 342, 54, 126, 198].map(angle => angle * Math.PI / 180);
    return metrics.map((metric, i) => ({
      x: Math.cos(angles[i]) * (metric.value / 10) * BASE_SIZE,
      y: Math.sin(angles[i]) * (metric.value / 10) * BASE_SIZE,
      angle: angles[i]
    }));
  };

  const dataPoints = calculateDataPoints();

  const exportToImage = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 600;
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = 'virus-dashboard.png';
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  if (!isClient) return null;

  const getTextAnchor = (angle) => {
    if (angle > Math.PI/2 && angle < 3*Math.PI/2) {
      return "end";
    } else if (angle === Math.PI/2 || angle === 3*Math.PI/2) {
      return "middle";
    }
    return "start";
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-transparent p-4">
      <button
        onClick={exportToImage}
        className="px-4 py-2 bg-[#00FF9D] text-black rounded hover:bg-[#00CC7D] transition-colors mb-4"
      >
        Export as PNG
      </button>
      
      <svg 
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1000 600" 
        style={{ backgroundColor: 'transparent' }}
      >
        <defs>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(775,200)" filter="url(#neonGlow)">
          {[10, 8, 6, 4, 2].map((scale, i) => {
            const size = (scale / 10) * BASE_SIZE;
            const points = Array(5).fill(0).map((_, i) => {
              const angle = (270 + i * 72) * Math.PI / 180;
              return `${Math.cos(angle) * size},${Math.sin(angle) * size}`;
            });
            return (
              <path
                key={i}
                d={`M ${points.join(' L ')} Z`}
                fill="none"
                stroke="#00FF9D"
                strokeWidth="1"
                opacity="0.3"
              />
            );
          })}

          {Array(5).fill(0).map((_, i) => {
            const angle = (270 + i * 72) * Math.PI / 180;
            const x2 = Math.cos(angle) * BASE_SIZE;
            const y2 = Math.sin(angle) * BASE_SIZE;
            return (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={x2}
                y2={y2}
                stroke="#00FF9D"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}

          <path
            d={`M ${dataPoints.map(p => `${p.x},${p.y}`).join(' ')} Z`}
            fill="#00FF9D"
            fillOpacity="0.3"
            stroke="#00FF9D"
            strokeWidth="2"
            filter="url(#neonGlow)"
          />

          {dataPoints.map((point, i) => {
            const labelDistance = BASE_SIZE + 20;
            const x = Math.cos(point.angle) * labelDistance;
            const y = Math.sin(point.angle) * labelDistance;
            const anchor = getTextAnchor(point.angle);
            const boxWidth = 48;
            const boxHeight = 28;
            
            let boxX = x;
            if (anchor === "end") {
              boxX = x - boxWidth;
            } else if (anchor === "middle") {
              boxX = x - boxWidth/2;
            }

            return (
              <g key={i}>
                <rect
                  x={boxX}
                  y={y + 10}
                  width={boxWidth}
                  height={boxHeight}
                  rx="4"
                  fill="black"
                  stroke="#00FF9D"
                  strokeWidth="1"
                />
                <text
                  x={boxX + boxWidth/2}
                  y={y + 12 + boxHeight/2}
                  fill="#00FF9D"
                  fontSize="16"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {`${metrics[i].value}点`}
                </text>
                <text
                  x={x}
                  y={y}
                  fill="#00FF9D"
                  fontSize="15"
                  textAnchor={anchor}
                  dominantBaseline="middle"
                >
                  {metrics[i].label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default VirusDashboard;