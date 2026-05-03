import cds from "@sap/cds";
import { Pagination } from "../model/pagination";
import { PeriodConfig } from "../model/period-config";

const FILTER_DEFINITIONS = {
  payrollPeriod: "like",
  payrollPeriodFrom: "eq",
  payrollPeriodTo: "eq",
  confirmStartDate: "eq",
  confirmEndDate: "eq",
};

export type FilterField = keyof typeof FILTER_DEFINITIONS;

const FILTER_FIELDS = <FilterField[]>Object.keys(FILTER_DEFINITIONS);

export class PeriodConfigService extends cds.ApplicationService {
  async init() {
    const { PeriodConfigs } = this.entities;

    // ─── Function: periodConfigsPaginated ────────────────────────────────────────────

    this.on("paginated", async (req) => {
      const reqPage = <Pagination & Partial<PeriodConfig>>req.data;
      const limit = reqPage.limit;
      const offset = reqPage.offset;

      const query = SELECT.from(PeriodConfigs)
        .columns(
          "ID",
          "payrollPeriod",
          "payrollPeriodFrom",
          "payrollPeriodTo",
          "confirmStartDate",
          "confirmEndDate",
          "createdAt",
          "createdBy",
          "modifiedAt",
          "modifiedBy",
        )
        .limit(limit, offset)
        .orderBy("modifiedAt desc");

      const normalizedFilters = FILTER_FIELDS.reduce<
        Record<FilterField, string | undefined>
      >(
        (acc, field) => {
          acc[field] = reqPage?.[field];
          return acc;
        },
        {} as Record<FilterField, string | undefined>,
      );

      const wherePayload = FILTER_FIELDS.reduce<Record<string, unknown>>(
        (acc, field) => {
          const value = normalizedFilters[field];
          if (!value) {
            return acc;
          }

          acc[field] =
            FILTER_DEFINITIONS[field] === "like"
              ? { like: `%${value}%` }
              : value;

          return acc;
        },
        {},
      );

      if (Object.keys(wherePayload).length > 0) {
        query.where(wherePayload);
      }

      return query;
    });

    return super.init();
  }
}
