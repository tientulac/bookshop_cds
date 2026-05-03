using { sap.capire.bookshop as my } from '../db/schema';

service PeriodConfigService @(odata:'/period') {
  entity PeriodConfigs as projection on my.PeriodConfigs;

  function paginated(
    limit: Integer default 5,
    offset: Integer default 0,
    payrollPeriod: String,
    payrollPeriodFrom: String,
    payrollPeriodTo: String,
    confirmStartDate: String,
    confirmEndDate: String
  ) returns array of PeriodConfigs;
}