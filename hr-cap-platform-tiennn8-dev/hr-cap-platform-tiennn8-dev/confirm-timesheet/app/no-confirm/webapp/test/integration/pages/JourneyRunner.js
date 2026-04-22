sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"hrcap/cts/noconfirm/test/integration/pages/NoConfirmEmpConfigsList",
	"hrcap/cts/noconfirm/test/integration/pages/NoConfirmEmpConfigsObjectPage"
], function (JourneyRunner, NoConfirmEmpConfigsList, NoConfirmEmpConfigsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('hrcap/cts/noconfirm') + '/test/flp.html#app-preview',
        pages: {
			onTheNoConfirmEmpConfigsList: NoConfirmEmpConfigsList,
			onTheNoConfirmEmpConfigsObjectPage: NoConfirmEmpConfigsObjectPage
        },
        async: true
    });

    return runner;
});

