import { AppModule } from "./app.module";
import { BullBoardService } from "./queue/bull-board.service";
import { IoAdapter } from "@nestjs/platform-socket.io";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS globally
  app.enableCors({
    origin: "*",
  });

  // Serve static files from uploads directory at /videos
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/videos/",
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  // Mount Bull Board UI
  const bullBoardService = app.get(BullBoardService);
  app.use("/admin/queues", bullBoardService.getServerAdapter().getRouter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
