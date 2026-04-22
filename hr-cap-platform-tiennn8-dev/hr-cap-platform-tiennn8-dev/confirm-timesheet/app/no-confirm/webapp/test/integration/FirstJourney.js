sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheNoConfirmEmpConfigsList.iSeeThisPage();
            Then.onTheNoConfirmEmpConfigsList.onFilterBar().iCheckFilterField("Payroll period");
            Then.onTheNoConfirmEmpConfigsList.onTable().iCheckColumns(5, {"employeeID":{"header":"Employee ID"},"employeeName":{"header":"Employee name"},"payrollPeriod":{"header":"Payroll period"},"payrollPeriodFrom":{"header":"Payroll period from"},"payrollPeriodTo":{"header":"Payroll period to"}});

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheNoConfirmEmpConfigsList.onFilterBar().iExecuteSearch();
            
            Then.onTheNoConfirmEmpConfigsList.onTable().iCheckRows();

            When.onTheNoConfirmEmpConfigsList.onTable().iPressRow(0);
            Then.onTheNoConfirmEmpConfigsObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});