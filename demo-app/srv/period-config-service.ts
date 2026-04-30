import cds from "@sap/cds";
import { Pagination } from "../model/pagination";

export class PeriodConfigService extends cds.ApplicationService {
  async init() {
    const { PeriodConfigs } = this.entities;

    // ─── Function: periodConfigsPaginated ────────────────────────────────────────────

    this.on("paginated", async (req) => {
      const reqPage = <Pagination>req.data;
      const rawLimit = reqPage?.limit || 5;
      const limit = Number.isFinite(rawLimit)
        ? Math.max(1, Math.min(rawLimit, 100))
        : 5;

      return SELECT.from(PeriodConfigs)
        .columns(
          "payrollPeriod",
          "payrollPeriodFrom",
          "payrollPeriodTo",
          "confirmStartDate",
          "confirmEndDate",
        )
        .limit(limit);
    });

    return super.init();
  }
}
