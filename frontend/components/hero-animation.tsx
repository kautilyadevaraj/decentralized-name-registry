"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Node class
    class Node {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      connections: number[];
      originalX: number;
      originalY: number;
      angle: number;
      angleSpeed: number;
      radius: number;

      constructor(x: number, y: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.size = size;
        this.color = color;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.connections = [];
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.01;
        this.radius = Math.random() * 20 + 10;
      }

      update(mouseX: number, mouseY: number) {
        // Orbital motion
        this.angle += this.angleSpeed;
        this.x = this.originalX + Math.cos(this.angle) * this.radius;
        this.y = this.originalY + Math.sin(this.angle) * this.radius;

        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.x -= dx * force * 0.03;
          this.y -= dy * force * 0.03;
        }

        // Bounce off edges with some padding
        const padding = 50;
          if (this.x <= padding || this.x >= canvas.clientWidth - padding) {
            this.angleSpeed *= -1;
          }
          if (this.y <= padding || this.y >= canvas.clientHeight - padding) {
            this.angleSpeed *= -1;
          }
        }
      

      draw() {
        if (!ctx) return;

        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
      }
    }

    // Create nodes
    const nodeCount = 20;
    const nodes: Node[] = [];
    const colors = ["#7c5cff", "#14b8a6", "#f59e0b", "#ec4899", "#06b6d4"];

    for (let i = 0; i < nodeCount; i++) {
      const size = Math.random() * 3 + 2;
      const x = Math.random() * (canvas.clientWidth - size * 2) + size;
      const y = Math.random() * (canvas.clientHeight - size * 2) + size;
      const color = colors[Math.floor(Math.random() * colors.length)];
      nodes.push(new Node(x, y, size, color));
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(mousePosition.x, mousePosition.y);
        nodes[i].draw();

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            // Gradient line
            const gradient = ctx.createLinearGradient(
              nodes[i].x,
              nodes[i].y,
              nodes[j].x,
              nodes[j].y
            );
            gradient.addColorStop(0, nodes[i].color);
            gradient.addColorStop(1, nodes[j].color);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5 * (1 - distance / 150);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      canvas?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border bg-background/50 glow">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-purple/20"
        >
          <h3 className="text-2xl font-bold mb-2 gradient-text">
            Decentralized Names
          </h3>
          <p className="text-muted-foreground">
            Your identity on the blockchain
          </p>
        </motion.div>
      </div>
    </div>
  );
}
