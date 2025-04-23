
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

// MCP server logos, replace src with actual server logos or demo logos as needed
const mcpServers = [
  { name: "OpenRouter", img: "https://cdn.openrouter.ai/static/favicon-96x96.png" },
  { name: "MoonShot", img: "https://moonshotplatform.ai/favicon.ico" },
  { name: "MCShell", img: "https://assets-global.website-files.com/650c31b94a3b53c4e4182a26/650c31b94a3b53c4e4182a65_mcshell-favicon.png" },
  { name: "Firefly", img: "https://avatars.githubusercontent.com/u/151080772?s=48&v=4" },
  { name: "Marketplace", img: "https://static-1308011752.cos.ap-shanghai.myqcloud.com/favicon-32x32.png" },
  { name: "mcpAPI", img: "https://mcpapi.com/favicon.ico" },
  { name: "MCP-Fast", img: "https://mcphub.org/favicon.ico" },
];

const McpServerLogosCarousel: React.FC = () => {
  return (
    <div className="w-full rounded-lg border bg-muted/40 px-3 py-2 shadow-sm">
      <Carousel opts={{ align: "start", loop: true }}>
        <CarouselContent className="h-20">
          {mcpServers.map((srv, idx) => (
            <CarouselItem key={srv.name} className="basis-1/4 lg:basis-1/7 flex items-center justify-center">
              <img
                src={srv.img}
                alt={srv.name}
                className="h-11 w-11 object-contain rounded-xl shadow border bg-white mx-auto hover-scale"
                style={{ transition: "transform 0.25s" }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default McpServerLogosCarousel;

