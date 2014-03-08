/*global YUI, allIS24TestCaseModules*/

YUI.GlobalConfig = {
    modules: {
        testCaseModules: {
            use: []
        }
    }
};

YUI().use(["node"], function (Y) {
    "use strict";
    
    var testCaseModules = window.allITestCases.testCases,
        testSuiteName = window.allITestCases.name,
        testCasesModulesBase = window.allITestCases.basePath,
        isFiltered = false,
        template = '<div id="filterContainer">' +
            '<h3>Test case filter</h3>' +
            '<form action="" method="get">' +
                '<select id="testSelect" name="testName" multiple></select>' +
                '<input type="submit" value="Filter & Run"/>' +
                '<input id="removeFilterButton" class="hide" type="submit" value="Remove Filter"/>' +
            '</form>' +
            '<div class="separator"></div>' +
        '</div>';
    
    document.title = testSuiteName;
  
    function byName(a, b) {
       var compA = a.toUpperCase();
       var compB = b.toUpperCase();
       return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    }    

    function addButtonHandler() {
        var removeFilterButton;
        
        if (isFiltered) { 
            removeFilterButton = Y.one("#removeFilterButton");
            removeFilterButton.removeClass("hide");
            removeFilterButton.on("click", function (event) {
                event.preventDefault();
                window.location.href = window.location.href.split('?')[0];
            });
        }
    }

    function filterTestModules() {
        var runTests = [], param = window.location.href.split("?")[1];

        if (param) {
            Y.Array.each(param.split("&"), function (parameter, index) {
                var split, key, value;    
                
                split = parameter.split("=");
                key = split[0];
                value = split[1];

                if (key === "testName") {
                    runTests.push(value);
                }
            });

            if (runTests.length > 0) {
                isFiltered = true;
                testCaseModules = runTests;
            }
        }
    }

    function addTestModulesToYuiConfig() {
        var name, i;

        for (i = 0; i < testCaseModules.length; i += 1) {
            name = testCaseModules[i];
            YUI.GlobalConfig.modules[name] = {
                requires: ['test'],
                fullpath: "./" + testCasesModulesBase + "/" + name + '.js?time=' + new Date().getTime()
            };
            
            YUI.GlobalConfig.modules.testCaseModules.use.push(name);
        }
    }    
    
    function fillSelectBox() {
        var name, i, testSelectBox;

        testSelectBox = Y.one("#testSelect");
        for (i = 0; i < testCaseModules.length; i += 1) {
            name = testCaseModules[i];
            testSelectBox.appendChild("<option selected>" + name + "</option>");
        }
        testSelectBox.set("size", (i < 15) ? i : 15);
    }
    
    function addFilterTemplateIntoDom() {
        Y.one(".yui3-console-ft").prepend(template);
        Y.one(".yui3-console").setStyle("height", "auto");
    }

    function sortCases() {
        testCaseModules = testCaseModules.sort(byName);
    }
    
    function showFilterBox() {
        if (testCaseModules.length > 1 || isFiltered) {
            addFilterTemplateIntoDom();
            fillSelectBox();
            addButtonHandler();
            
            Y.one("#filterContainer").setStyle("display", "block");
        }
    }

    sortCases();
    filterTestModules();
    addTestModulesToYuiConfig();
    
    YUI().use(["testCaseModules", "node", "test-console"], function (Y) {
        var yconsole,
            suite = new Y.Test.Suite(testSuiteName),
            moduleCounter = 0;

        yconsole = new Y.Test.Console({
            newestOnTop: false,
            width: "600px",
            filters: {pass: true, status: true}
        });
        yconsole.render("testLogger");

        Y.each(Y.IS24Test, function (test) {
            suite.add(test);
            yconsole.log("added test case module: " + test.name);
            moduleCounter++;
        });

        Y.Test.Runner.add(suite);
        Y.Test.Runner.subscribe(Y.Test.Runner.TEST_FAIL_EVENT, function (data) {
            if (window.console && typeof console.log === "function") {
                console.log(data.testName + ": failed.");
                console.log(data.error.stack);
            }
        });

        if (testCaseModules.length === moduleCounter) {
            Y.Test.Runner.run();
        } else {
            yconsole.log("defined and loaded test case modules should be equal. " +
                "module and file must have the same name (example: searchGeoCoderTest => searchGeoCoderTest.js). " +
                "expected/current: " + testCaseModules.length + "/" + moduleCounter, "error");
        }
        
        showFilterBox();
    });
});