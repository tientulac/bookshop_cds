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

const FILTER_FIELDS = Object.keys(FILTER_DEFINITIONS) as FilterField[];

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

    // ─── Function: save ────────────────────────────────────────────

    this.on("save", async (req) => {
      const payload = (<{ periodConfig?: PeriodConfig }>req.data)?.periodConfig;

      if (!payload || Object.keys(payload).length === 0) {
        return req.reject(
          400,
          "Missing periodConfig payload for createPeriodConfig",
        );
      }

      const tx = cds.tx(req);

      if (payload.ID) {
        const affectedRows = await tx.run(
          UPDATE(PeriodConfigs)
            .set({
              payrollPeriod: payload.payrollPeriod,
              payrollPeriodFrom: payload.payrollPeriodFrom,
              payrollPeriodTo: payload.payrollPeriodTo,
              confirmStartDate: payload.confirmStartDate,
              confirmEndDate: payload.confirmEndDate,
            })
            .where({ ID: payload.ID }),
        );

        if (!affectedRows) {
          return req.reject(
            404,
            `PeriodConfig with ID '${payload.ID}' not found`,
          );
        }
      } else {
        await tx.run(INSERT.into(PeriodConfigs).entries(payload));
      }

      return tx.run(
        SELECT.one.from(PeriodConfigs).where({
          payrollPeriod: payload.payrollPeriod,
        }),
      );
    });

    // ─── Action: deletePeriodConfig ────────────────────────────────────────────

    this.on("remove", async (req) => {
      const { ID } = req.data as { ID?: string };

      if (!ID) {
        return req.reject(400, "Missing ID for deletePeriodConfig");
      }

      const tx = cds.tx(req);
      const affectedRows = await tx.run(
        DELETE.from(PeriodConfigs).where({ ID }),
      );

      if (!affectedRows) {
        return req.reject(404, `PeriodConfig with ID '${ID}' not found`);
      }

      return true;
    });

    return super.init();
  }
}
