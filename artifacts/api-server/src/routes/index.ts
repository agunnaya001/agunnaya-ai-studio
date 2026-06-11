import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import previewRouter from "./preview";
import debugRouter from "./debug";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chatRouter);
router.use("/preview", previewRouter);
router.use("/debug", debugRouter);

export default router;
