"use client";

import type React from "react";

interface CustomLoaderProps {
  message: string;
}

export const CustomLoader: React.FC<CustomLoaderProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      {/* Cube Loader Container */}
      <div className="relative">
        {/* Project Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-mono tracking-wider">
            Decentralized Naming Registry
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Loading {message}...
          </p>
        </div>

        {/* Cube Loader */}
        <div className="cube-loader">
          <div className="cube-top"></div>
          <div className="cube-wrapper">
            <span
              style={{ "--i": 0 } as React.CSSProperties}
              className="cube-span"
            ></span>
            <span
              style={{ "--i": 1 } as React.CSSProperties}
              className="cube-span"
            ></span>
            <span
              style={{ "--i": 2 } as React.CSSProperties}
              className="cube-span"
            ></span>
            <span
              style={{ "--i": 3 } as React.CSSProperties}
              className="cube-span"
            ></span>
          </div>
        </div>

        {/* Custom CSS for the cube loader */}
        <style jsx>{`
          .cube-loader {
            position: relative;
            width: 75px;
            height: 75px;
            transform-style: preserve-3d;
            transform: rotateX(-30deg);
            animation: animate 4s linear infinite;
            margin: 0 auto;
          }

          @keyframes animate {
            0% {
              transform: rotateX(-30deg) rotateY(0);
            }
            100% {
              transform: rotateX(-30deg) rotateY(360deg);
            }
          }

          .cube-loader .cube-wrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
          }

          .cube-loader .cube-wrapper .cube-span {
            position: absolute;
            width: 100%;
            height: 100%;
            transform: rotateY(calc(90deg * var(--i))) translateZ(37.5px);
            background: linear-gradient(
              to bottom,
              hsl(260, 60%, 15%) 0%,
              hsl(260, 65%, 25%) 5.5%,
              hsl(260, 70%, 35%) 12.1%,
              hsl(260, 75%, 45%) 19.6%,
              hsl(260, 80%, 50%) 27.9%,
              hsl(260, 85%, 55%) 36.6%,
              hsl(260, 90%, 60%) 45.6%,
              hsl(260, 95%, 65%) 54.6%,
              hsl(260, 100%, 70%) 63.4%,
              hsl(260, 95%, 65%) 71.7%,
              hsl(260, 90%, 60%) 79.4%,
              hsl(260, 85%, 55%) 86.2%,
              hsl(260, 80%, 50%) 91.9%,
              hsl(260, 75%, 45%) 96.3%,
              hsl(260, 70%, 40%) 99%,
              hsl(260, 65%, 35%) 100%
            );
          }

          .cube-top {
            position: absolute;
            width: 75px;
            height: 75px;
            background: hsl(260, 60%, 15%);
            transform: rotateX(90deg) translateZ(37.5px);
            transform-style: preserve-3d;
          }

          .cube-top::before {
            content: "";
            position: absolute;
            width: 75px;
            height: 75px;
            background: hsl(260, 80%, 50%);
            transform: translateZ(-90px);
            filter: blur(10px);
            box-shadow: 0 0 10px #323232, 0 0 20px hsl(260, 80%, 50%),
              0 0 30px #323232, 0 0 40px hsl(260, 80%, 50%);
          }
        `}</style>
      </div>
    </div>
  );
}
