using {hrcap.cts as my} from '../db/schema';

// NoConfirmEmpConfigs Elements
annotate my.NoConfirmEmpConfigs with {
  employeeID        @title: 'Employee ID';
  payrollPeriod     @title: 'Payroll period';
  employeeName      @title: 'Employee name';
  payrollPeriodFrom @title: 'Payroll period from';
  payrollPeriodTo   @title: 'Payroll period to';
};

// NoConfirmEmpConfigs Lists
annotate my.NoConfirmEmpConfigs with @(
  Common.SemanticKey: [ID],
  UI                : {
    SelectionFields: [payrollPeriod],
    LineItem       : [
      {Value: employeeID},
      {Value: employeeName},
      {Value: payrollPeriod},
      {Value: payrollPeriodFrom},
      {Value: payrollPeriodTo},
    ]
  }
);

// NoConfirmEmpConfigs Details
annotate my.NoConfirmEmpConfigs with @(UI: {HeaderInfo: {
  TypeName      : 'Employee',
  TypeNamePlural: 'Employees',
  Title         : {Value: payrollPeriod},
  Description   : {Value: employeeName}
}});
