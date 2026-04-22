using HrService from '../../srv/hr-service';

annotate HrService.NoConfirmEmpConfigs with @(UI: {
  HeaderInfo             : {
    TypeName      : 'Employee',
    TypeNamePlural: 'Employees',
    Title         : {Value: payrollPeriod},
    Description   : {Value: employeeName}
  },
  HeaderFacets           : [],
  Facets                 : [{
    $Type : 'UI.ReferenceFacet',
    Label : 'Details',
    Target: '@UI.FieldGroup#Information'
  }],
  FieldGroup #Information: {Data: [
    {Value: employeeID},
    {Value: payrollPeriod},
    {Value: employeeName},
    {Value: payrollPeriodFrom},
    {Value: payrollPeriodTo}
  ]}
});

annotate HrService.NoConfirmEmpConfigs with @odata.draft.enabled;
