
import React from "react";

// 假设有部分 mcp server logo SVG/CSS，下面用彩色圆形代替，可更换成真实 Logo 图片
const servers = [
  { color: "#9b87f5" },
  { color: "#1EAEDB" },
  { color: "#F97316" },
  { color: "#D946EF" },
  { color: "#8E9196" },
  { color: "#FEC6A1" },
  { color: "#F2FCE2" },
  { color: "#6E59A5" },
  { color: "#D3E4FD" },
];

const ServerMarquee: React.FC = () => {
  // 补充动效：左右滚动动画
  return (
    <div className="relative w-full max-w-4xl py-3 mx-auto">
      <div className="overflow-x-hidden">
        <div className="flex whitespace-nowrap gap-6 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
          {servers.concat(servers).map((s, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-12 h-12 rounded-full shadow-lg border-2 border-white"
              style={{ background: s.color }}
              aria-label={`Server logo ${i+1}`}
            />
          ))}
        </div>
      </div>
      {/* marquee keyframes in tailwind.config.ts or add a style below */}
      <style>
        {`
        @keyframes marquee {
          0% { transform: translateX(0%);}
          100% { transform: translateX(-50%);}
        }
        `}
      </style>
    </div>
  );
};

export default ServerMarquee;
