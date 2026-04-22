import cds from "@sap/cds";
import dayjs from "dayjs";

export class HrService extends cds.ApplicationService {
  async init() {
    const { NoConfirmEmpConfigs } = this.entities;

    this.before(["CREATE", "UPDATE"], NoConfirmEmpConfigs, async (request) => {
      const { employeeID, payrollPeriod, payrollPeriodFrom, payrollPeriodTo } =
        request.data;

      const isExisting = await SELECT.one([1])
        .from(NoConfirmEmpConfigs)
        .where({ employeeID, payrollPeriod });

      if (isExisting) {
        return request.reject(
          400,
          "Đã tồn tại bản ghi mã nhân viên cho cùng kỳ lương này",
        );
      }

      if (dayjs(payrollPeriodFrom).isAfter(dayjs(payrollPeriodTo), "day")) {
        return request.reject(
          400,
          "Payroll period to không được nhỏ hơn Payroll period from",
        );
      }

      console.log({ isExisting, employeeID, payrollPeriod });
    });

    return super.init();
  }
}
