import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { Injectable } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { createBullBoard } from "@bull-board/api";

@Injectable()
export class BullBoardService {
  private serverAdapter: ExpressAdapter;

  constructor(private readonly queueService: QueueService) {
    this.serverAdapter = new ExpressAdapter();
    const videoQueue = (this.queueService as any).videoQueue;
    createBullBoard({
      queues: [new BullMQAdapter(videoQueue)],
      serverAdapter: this.serverAdapter,
    });
    this.serverAdapter.setBasePath("/admin/queues");
  }

  getServerAdapter() {
    return this.serverAdapter;
  }
}
