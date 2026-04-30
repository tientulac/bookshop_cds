using { sap.capire.bookshop as my } from '../db/schema';

service AdminService @(odata:'/admin') {
  entity PeriodConfigs as projection on my.PeriodConfigs;
}