import { Controller, Req, Res, All } from "@nestjs/common";
import { BullBoardService } from "./bull-board.service";
import { Request, Response } from "express";

@Controller("admin/queues")
export class BullBoardController {
  constructor(private readonly bullBoardService: BullBoardService) {}

  @All("*path")
  serveBullBoard(@Req() req: Request, @Res() res: Response) {
    const serverAdapter = this.bullBoardService.getServerAdapter();
    serverAdapter.getRouter()(req, res);
  }
}
