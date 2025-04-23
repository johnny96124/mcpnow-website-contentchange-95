
import React, { useRef, useEffect, useState } from "react";

// MCP server logo 及信息占位
const mcpServers = [
  {
    name: "黑白LOGO",
    desc: "演示LOGO介绍内容...",
    img: "/lovable-uploads/888ae2df-5f1b-4ce5-8d4e-6517d4432938.png"
  },
  {
    name: "A 形",
    desc: "占位mcp server，支持AI应用。",
    img: "/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png"
  },
  {
    name: "Adobe",
    desc: "Adobe风格LOGO，用于占位MCP server。",
    img: "/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png"
  },
  {
    name: "Atlassian",
    desc: "示例server，支持多协议。",
    img: "/lovable-uploads/223666e0-b3d5-4b6e-9f8f-c85eea51d4ab.png"
  },
  {
    name: "Airbnb",
    desc: "Airbnb风格，占位说明。",
    img: "/lovable-uploads/5ebbe2a4-57d7-4db0-98c4-34fc93af0c58.png"
  },
  {
    name: "Amazon",
    desc: "电商风格LOGO举例，MCP扩展。",
    img: "/lovable-uploads/5f93fbdd-00d5-49db-862d-e4b247e975d7.png"
  },
  {
    name: "Amplitude",
    desc: "Amplitude style, 数据分析相关MCP应用。",
    img: "/lovable-uploads/4fecf049-ca5f-4955-a38c-4506556886d2.png"
  },
  {
    name: "Discord",
    desc: "社交类server，也可用于演示。",
    img: "/lovable-uploads/60892b6e-18d9-4bbc-869b-df9d6adecf7d.png"
  },
  {
    name: "1Password",
    desc: "1Password风格server，安全相关。",
    img: "/lovable-uploads/2edef556-b3cc-440b-90c0-af33a7a3730f.png"
  },
];

// 滚动动画CSS in JS
const SLIDE_SECONDS = 22; // 可调节：越小越快
const LOOP_REPEAT = 2; // 拼接一倍后repeat，保证循环流畅

const McpServerLogosCarousel: React.FC = () => {
  // 悬浮的server下标
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  // CSS 动画使用自定义属性
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    // 动画暂停/播放
    slider.style.animationPlayState = isPaused ? "paused" : "running";
  }, [isPaused]);

  // 合成LOGO列表以实现无缝滚动
  const displayServers = Array(LOOP_REPEAT).fill(null).flatMap(() => mcpServers);

  return (
    <div className="relative w-full max-w-5xl overflow-hidden py-2 px-2 rounded-xl border bg-muted/60 shadow-sm">
      {/* 滚动区域 */}
      <div
        ref={sliderRef}
        className="flex gap-12 items-center cursor-pointer select-none"
        style={{
          animation: `logos-slide ${SLIDE_SECONDS}s linear infinite`,
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoverIndex(null);
        }}
      >
        {displayServers.map((srv, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center min-w-[90px] relative"
            onMouseEnter={() => { setHoverIndex(idx % mcpServers.length); setIsPaused(true); }}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <img
              src={srv.img}
              alt={srv.name}
              className="h-12 w-12 object-contain rounded-lg shadow border bg-white hover-scale"
              draggable={false}
            />
            {/* tips */}
            {(hoverIndex === (idx % mcpServers.length)) && (
              <div className="absolute left-1/2 -bottom-20 z-20 min-w-[120px] max-w-xs -translate-x-1/2 bg-white text-gray-800 rounded-xl shadow-md p-2 border text-xs animate-fade-in whitespace-pre-line font-medium pointer-events-none">
                <span className="font-bold text-blue-600">{srv.name}</span>
                <div className="mt-0.5 text-gray-500">{srv.desc}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <style>
        {`
        @keyframes logos-slide {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        `}
      </style>
    </div>
  );
};

export default McpServerLogosCarousel;
