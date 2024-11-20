'use client';
import React, { useRef, useState, useEffect } from 'react';

const VirusDashboard = () => {
  const svgRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // メトリクスデータの定義 (0-10のスケール)
  const metrics = [
    { label: "時間効率", value: 10 },
    { label: "限界トロ", value: 10 },
    { label: "疲労度", value: 10 },
    { label: "飽きやすさ", value: 10 },
    { label: "勝率", value: 10 }
  ];

  // 五角形の基本サイズ定義
  const BASE_SIZE = 160;
  
  useEffect(() => {
    const newParticles = [...Array(15)].map(() => ({
      cx: Math.random() * 1000,
      cy: Math.random() * 600
    }));
    setParticles(newParticles);
  }, []);

  // 値を0-10のスケールから座標に変換する関数
  const calculateDataPoints = () => {
    const angles = [270, 342, 54, 126, 198].map(angle => angle * Math.PI / 180);
    return metrics.map((metric, i) => {
      const scaleFactor = (metric.value / 10) * BASE_SIZE;
      return {
        x: Math.cos(angles[i]) * scaleFactor,
        y: Math.sin(angles[i]) * scaleFactor
      };
    });
  };

  const dataPoints = calculateDataPoints();

  const exportToImage = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 600;
      ctx.fillStyle = '#0A192F';
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#1a1a1a] p-4">
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
        className="w-full max-w-[90vw] max-h-[90vh]"
      >
        <defs>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="strongGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1000" height="600" fill="#0A192F" />

        <g filter="url(#neonGlow)">
          {particles.map((particle, i) => (
            <circle
              key={i}
              cx={particle.cx}
              cy={particle.cy}
              r="1"
              fill="#ffffff"
              opacity="0.3"
            />
          ))}
        </g>

        <rect
          x="50"
          y="50"
          width="400"
          height="300"
          rx="10"
          fill="none"
          stroke="#00FF9D"
          strokeWidth="2"
          filter="url(#strongGlow)"
        />

        <rect
          x="500"
          y="50"
          width="450"
          height="450"
          rx="10"
          fill="none"
          stroke="#00FF9D"
          strokeWidth="2"
          filter="url(#strongGlow)"
        />

        <g transform="translate(725,250)" filter="url(#neonGlow)">
          {/* スケールグリッド (2単位ごと) */}
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

          {/* 軸線 */}
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

          {/* データプロット */}
          <path
            d={`M ${dataPoints.map(p => `${p.x},${p.y}`).join(' ')} Z`}
            fill="#00FF9D"
            fillOpacity="0.3"
            stroke="#00FF9D"
            strokeWidth="2"
            filter="url(#neonGlow)"
          />

          {/* 軸ラベル */}
          {metrics.map((metric, i) => {
            const angle = (270 + i * 72) * Math.PI / 180;
            const labelDistance = BASE_SIZE + 30;
            const x = Math.cos(angle) * labelDistance;
            const y = Math.sin(angle) * labelDistance;
            return (
              <text
                key={i}
                x={x}
                y={y}
                fill="#00FF9D"
                fontSize="12"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {metric.label}
              </text>
            );
          })}
        </g>

        {/* メトリクス値の表示 */}
        {metrics.map((metric, i) => (
          <text 
            key={i}
            x="70" 
            y={450 + i * 20} 
            fill="#00FF9D" 
            fontSize="14"
          >
            {`${metric.label}: ${metric.value.toFixed(1)}/10`}
          </text>
        ))}

        <rect
          x="50"
          y="400"
          width="900"
          height="150"
          rx="10"
          fill="none"
          stroke="#00FF9D"
          strokeWidth="2"
          filter="url(#strongGlow)"
        />
      </svg>
    </div>
  );
};

export default VirusDashboard;