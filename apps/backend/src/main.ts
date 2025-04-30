import * as fs from "fs";

import { AppModule } from "./app.module";
import { IoAdapter } from "@nestjs/platform-socket.io";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
  // Ensure uploads directory exists
  const uploadsPath = require("path").resolve(__dirname, "../../uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS globally
  app.enableCors({
    origin: "*",
  });

  // Serve static files from uploads directory at /videos
  app.useStaticAssets(uploadsPath, {
    prefix: "/videos/",
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  // Mount Bull Board UI
  // const bullBoardService = app.get(BullBoardService);
  // app.use("/admin/queues", bullBoardService.getServerAdapter().getRouter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
