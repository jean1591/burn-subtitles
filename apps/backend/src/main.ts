import { AppModule } from "./app.module";
import { BullBoardService } from "./queue/bull-board.service";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Mount Bull Board UI
  const bullBoardService = app.get(BullBoardService);
  app.use("/admin/queues", bullBoardService.getServerAdapter().getRouter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
