using {
  User,
  cuid,
  managed
} from '@sap/cds/common';
using {
  Types.ConfirmStatus,
  Types.PayrollPeriod
} from './types';

namespace hrcap.cts;

entity PeriodConfigs : cuid, managed {
  key payrollPeriod     : PayrollPeriod;
      payrollPeriodFrom : Date @mandatory;
      payrollPeriodTo   : Date @mandatory;
      confirmStartDate  : Date @mandatory;
      confirmEndDate    : Date @mandatory;
}

entity NoConfirmEmpConfigs : cuid, managed {
  key employeeID        : User;
  key payrollPeriod     : PayrollPeriod;
      employeeName      : String @mandatory;
      payrollPeriodFrom : Date   @mandatory;
      payrollPeriodTo   : Date   @mandatory;
};

entity TimesheetConfirmations : cuid, managed {
  employeeId      : User;
  employeeName    : String;
  managerId       : User;
  managerName     : String;
  positionText    : String;
  orgUnitId       : String;
  orgLayerFull    : String;
  payrollPeriod   : PayrollPeriod;
  periodStartDate : Date;
  periodEndDate   : Date;
  confirmStatus   : ConfirmStatus default 'NOT_YET_APPROVED';
  confirmedBy     : String;
  confirmedOn     : DateTime;
  timesheetRef    : String;
};

entity MSSTimesheetOverview as
  select from TimesheetConfirmations
  where
    managerId = $user.id;

entity HRTimesheetOverview  as select from TimesheetConfirmations;
