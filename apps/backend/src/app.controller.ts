// src/app.controller.ts
import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return "🔥 Backend is running!";
  }

  @Get("ping")
  ping(): string {
    return "🏓 Pong from NestJS!";
  }
}
