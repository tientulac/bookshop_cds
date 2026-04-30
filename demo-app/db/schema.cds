using { Currency, managed, sap, cuid } from '@sap/cds/common';
using {
  Types.ConfirmStatus,
  Types.PayrollPeriod
} from './types';

namespace sap.capire.bookshop;

entity Books : managed {
  key ID : Integer;
  title  : localized String;
  descr  : localized String;
  author : Association to Authors;
  genre  : Association to Genres;
  stock  : Integer;
  price  : Decimal;
  currency : Currency;
}

entity Authors : managed {
  key ID : Integer;
  name   : String;
  books  : Association to many Books on books.author = $self;
}

entity Genres : sap.common.CodeList {
  key ID : Integer;
  parent : Association to Genres;
}

entity PeriodConfigs : cuid, managed {
  key payrollPeriod     : PayrollPeriod;
  payrollPeriodFrom     : Date @mandatory;
  payrollPeriodTo       : Date @mandatory;
  confirmStartDate      : Date @mandatory;
  confirmEndDate        : Date @mandatory;
}