using { sap.capire.bookshop as my } from '../db/schema';

service PeriodConfigService @(odata:'/period') {
  entity PeriodConfigs as projection on my.PeriodConfigs;

  function paginated(
    limit: Integer default 5,
    payrollPeriod: String,
    payrollPeriodFrom: String,
    payrollPeriodTo: String,
    confirmStartDate: String,
    confirmEndDate: String
  ) returns array of PeriodConfigs;

  action save(periodConfig: PeriodConfigs) returns PeriodConfigs;
  function remove(ID: UUID) returns Boolean;
}