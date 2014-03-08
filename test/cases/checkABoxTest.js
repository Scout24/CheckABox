/*global YUI*/

YUI.add('checkABoxTest', function (Y) {
    var assertEquals = Y.Assert.areEqual,
        assertTrue = Y.Assert.isTrue,
        assertFalse = Y.Assert.isFalse;

    Y.namespace("IS24Test");

    Y.IS24Test.checkABoxTest = new Y.Test.Case({
        name: "checkABoxTest",
        
        setUp: function () {
            var testDiv = $('<div id="' + this.name + '" />');
            
            testDiv.append('<form action="./" method="get">' +
                '<label for="checkBox"><input id="checkBox" type="checkbox" />Label</label>' +
                '<label for="radioBoxA"><input name="chooseMe" value="a" id="radioBoxA" type="radio" /></label>' +
                '<label for="radioBoxB"><input name="chooseMe" value="b" id="radioBoxB" type="radio" /></label>' +
                '<label for="radioBoxC"><input name="chooseMe" value="c" id="radioBoxC" type="radio" /></label>' +
                '<input type="submit" />' +
            '</form>');
            $(document.body).append(testDiv);
        },

        tearDown:function () {
            $("#" + this.name).remove();
        },
        
        assertNotChecked: function (element) {
            var icon = this.getIcon(element);
            assertTrue(!icon.hasClass("ui-icon-on"), "missing class ui-icon-checkbox-off for span");
            assertEquals(false, element.is(":checked"), "element was checked");
        },
        
        assertChecked: function (element) {
            var icon = this.getIcon(element);
            assertTrue(icon.hasClass("ui-icon-on"), "missing class ui-icon-checkbox-on for span");
            assertEquals(true, element.is(":checked"), "checkBoxes was not checked");
        },
        
        getIcon: function (el) {
            return el.prev();
        },
        
        touch: function (element) {
            element.trigger("click");
        },

        "test checkbox is checked after click": function () {
            var icon, 
                checkBoxes = $("#checkBox");
            
            checkBoxes.checkABox("bind");
            icon = this.getIcon(checkBoxes);
            this.touch(icon);
            
            this.assertChecked(checkBoxes);
        },
        
        "test checkbox is not checked after double click": function () {
            var icon, 
                checkBoxes = $("#checkBox");
            
            checkBoxes.checkABox("bind");
            icon = this.getIcon(checkBoxes);
			
            this.touch(icon);
            this.touch(icon);
            
            this.assertNotChecked(checkBoxes);
        },        
        
        "test checkbox should be checked after toggle": function () {
            var checkBoxes = $("#checkBox");                
            
            checkBoxes.checkABox("bind");
            checkBoxes.checkABox("toggle");
            
            this.assertChecked(checkBoxes);
        },        
        
        "test checkbox should not be checked after toggled twice": function () {
            var checkBoxes = $("#checkBox");                
            
            checkBoxes.checkABox("bind");
            checkBoxes.checkABox("toggle");
            checkBoxes.checkABox("toggle");
            
            this.assertNotChecked(checkBoxes);
        },
        
        "test set checkbox checked": function () {
            var checkBoxes = $("#checkBox");                
            
            checkBoxes.checkABox("bind");
            checkBoxes.checkABox(true);
            
            this.assertChecked(checkBoxes);
        },
       
        "test set checkbox unchecked": function () {
            var checkBoxes = $("#checkBox");                
            
            checkBoxes.checkABox("bind");
            checkBoxes.checkABox(true);
            checkBoxes.checkABox(false);
            
            this.assertNotChecked(checkBoxes);
        },
        
        "test click on label should check the checkbox": function () {
            var checkBoxes = $("#checkBox");                
            
            checkBoxes.checkABox("bind");
            this.touch($("label[for='checkBox']"));

            this.assertChecked(checkBoxes);
        },
        
        "test click on first radio": function () {
            var $radioBoxA = $("#radioBoxA");
            
            $("input[type='radio']", "#" + this.name).checkABox("bind");
			this.touch($radioBoxA);

            this.assertChecked($radioBoxA);
            this.assertNotChecked($("#radioBoxB"));
            this.assertNotChecked($("#radioBoxC"));
        },
        
        "test click on first radio twice": function () {
            var $radioBoxA = $("#radioBoxA");
            
            $("input[type='radio']", "#" + this.name).checkABox("bind");
			this.touch($radioBoxA);
			this.touch($radioBoxA);

            this.assertChecked($radioBoxA);
            this.assertNotChecked($("#radioBoxB"));
            this.assertNotChecked($("#radioBoxC"));
        },
        
        "test click on second radio": function () {
            var $radioBoxB = $("#radioBoxB");
            
            $("input[type='radio']", "#" + this.name).checkABox("bind");
			this.touch($radioBoxB);

            this.assertChecked($radioBoxB);
            this.assertNotChecked($("#radioBoxA"));
            this.assertNotChecked($("#radioBoxC"));
        },
        
        "test click on third radio": function () {
            var $radioBoxC = $("#radioBoxC");
            
            $("input[type='radio']", "#" + this.name).checkABox("bind");
            this.touch($radioBoxC);

            this.assertChecked($radioBoxC);
            this.assertNotChecked($("#radioBoxA"));
            this.assertNotChecked($("#radioBoxB"));
        },
        
        "test change radio selection": function () {
            var $radioBoxA = $("#radioBoxA"),
                $radioBoxB = $("#radioBoxB"),
                $radioBoxC = $("#radioBoxC");
            
            $("input[type='radio']", "#" + this.name).checkABox("bind");
            
            this.touch($radioBoxA);
            this.touch($radioBoxB);
            this.touch($radioBoxC);

            this.assertChecked($radioBoxC);
            this.assertNotChecked($radioBoxA);
            this.assertNotChecked($radioBoxB);
        }
    });

}, '0.0.1', {
    requires: ['test']
});