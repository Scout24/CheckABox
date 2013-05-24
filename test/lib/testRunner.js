/*global YUI, allIS24TestCaseModules*/

YUI.GlobalConfig = {
    modules: {
        testCaseModules: {
            use: []
        }
    }
};

YUI().use(["node"], function (Y) {
    var testCaseModules = window.allITestCases.testCases,
        testCasesModulesBase = window.allITestCases.basePath;
  
    function byName(a, b) {
       var compA = a.toUpperCase();
       var compB = b.toUpperCase();
       return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    }

    function addTestModulesToYuiConfig() {
        var name, i;

        for (i = 0; i < testCaseModules.length; i += 1) {
            name = testCaseModules[i];
            YUI.GlobalConfig.modules[name] = {
                requires: ['test'],
                fullpath: "./cases/"+testCasesModulesBase+"/" + name + '.js?time=' + new Date().getTime()
            };
            
            YUI.GlobalConfig.modules.testCaseModules.use.push(name);
        }
    }

    testCaseModules = testCaseModules.sort(byName);
    addTestModulesToYuiConfig();

    YUI().use(["testCaseModules", "test-console"], function (Y) {
        "use strict";
        var yconsole,
            moduleCounter = 0;

        yconsole = new Y.Test.Console({
            verbose: true,
            newestOnTop: false,
            width: "600px",
            filters: {pass: true, status: false}
        });
        yconsole.render("testLogger");

        Y.each(Y.IS24Test, function (test) {
            Y.Test.Runner.add(test);
            yconsole.log("added test case module: " + test.name);
            moduleCounter++;
        });

        if (testCaseModules.length === moduleCounter) {
            Y.Test.Runner.run();
        } else {
            yconsole.log("defined and loaded test case modules should be equal. " +
                "module and file must have the same name (example: searchGeoCoderTest => searchGeoCoderTest.js). " +
                "expected/current: " + testCaseModules.length + "/" + moduleCounter, "error");
        }
    });
});