using {hrcap.cts as my} from '../db/schema';

service MssService {
  entity TimesheetConfirmations as projection on my.TimesheetConfirmations;
};
