using { PeriodConfigService } from './period-config-service';

annotate PeriodConfigService.PeriodConfigs with {
	payrollPeriod @mandatory;
	payrollPeriod @mandatory.message: 'Payroll period không được để trống';

	payrollPeriodFrom @mandatory;
	payrollPeriodFrom @mandatory.message: 'Payroll period from không được để trống';

	payrollPeriodTo @assert: (case
		when payrollPeriodTo < payrollPeriodFrom
			then 'Payroll period to không được nhỏ hơn Payroll period from'
	end);
	payrollPeriodTo @mandatory;
	payrollPeriodTo @mandatory.message: 'Payroll period to không được để trống';

	confirmStartDate @mandatory;
	confirmStartDate @mandatory.message: 'Confirm start date không được để trống';

	confirmEndDate @assert: (case
		when confirmEndDate < confirmStartDate
			then 'Confirm end date không được nhỏ hơn Confirm start date'
	end);
	confirmEndDate @mandatory;
	confirmEndDate @mandatory.message: 'Confirm end date không được để trống';
};
