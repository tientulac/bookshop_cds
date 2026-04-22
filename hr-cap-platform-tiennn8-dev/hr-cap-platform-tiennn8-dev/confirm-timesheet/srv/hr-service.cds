using {hrcap.cts as my} from '../db/schema';

service HrService {
  entity PeriodConfigs          as projection on my.PeriodConfigs;

  entity NoConfirmEmpConfigs    as projection on my.NoConfirmEmpConfigs;

  entity TimesheetConfirmations as projection on my.TimesheetConfirmations;
};
