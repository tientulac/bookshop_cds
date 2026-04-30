using { Currency, managed, sap, cuid } from '@sap/cds/common';
using {
  Types.ConfirmStatus,
  Types.PayrollPeriod
} from './types';

namespace sap.capire.bookshop;

entity PeriodConfigs : cuid, managed {
  key payrollPeriod     : PayrollPeriod;
  payrollPeriodFrom     : Date @mandatory;
  payrollPeriodTo       : Date @mandatory;
  confirmStartDate      : Date @mandatory;
  confirmEndDate        : Date @mandatory;
}