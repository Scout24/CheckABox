/*globals $*/

/**
 * Check A Box v0.1.4
 * http://immobilienscout24.github.io/CheckABox/
 *
 */
$.fn.checkABox = function (action, options) {
    "use strict";

    var defaultOptions = {
            checkedClass: "ui-icon-on",
            uncheckedClass: "",
            iconClass: "ui-icon icon-ok",
            iconHtml: '<span></span>'
        },
        $attachedElements = $(this),
        iconPropertyName = "relatedIcon";

    function getRelatedIconFrom(checkbox) {
        return checkbox.prop(iconPropertyName);
    }

    function isInputChecked(input) {
        return input.is(":checked");
    }

    function handleInputState(checkbox, checked) {
        checkbox.prop("checked", checked);
        checkbox.trigger("change");
    }

    function setIconClass(checkbox, state) {
        var currentIcon = getRelatedIconFrom(checkbox);

        currentIcon.toggleClass(defaultOptions.checkedClass, state);
        currentIcon.toggleClass(defaultOptions.uncheckedClass, !state);
    }

    function syncButtonGroup() {
        $attachedElements.each(function (index, input) {
            input = $(input);
            setIconClass(input, isInputChecked(input));
        });
    }

    function setChecked(input, action) {
        handleInputState(input, action);
        setIconClass(input, action);
    }

    function toggleCheckState(input) {
        setChecked(input, !isInputChecked(input));
    }

    function syncInputIconClass(input) {
        return (isInputChecked(input) ? defaultOptions.checkedClass : defaultOptions.uncheckedClass);
    }

    function stopEvents(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    function isCheckedRadio(el) {
        return (el.is("input[type='radio']") && isInputChecked(el));
    }

    function createClickEventCallback($input) {
        var lastEventType;
        return function (event) {
            stopEvents(event);

            //only accept one event type and stick to it
            if (!lastEventType || lastEventType === event.type) {
                lastEventType = event.type;
                stopEvents(event);

                //radio buttons have always one element checked, so we filter them
                if (!isCheckedRadio($input)) {
                    toggleCheckState($input);
                    syncButtonGroup();
                }
            }
        };
    }

    function attachEventListener(el) {
        el.each(function (index, input) {
            var icon, parent, $input = $(input);

            if (!$input.prop("checkABoxEnabled")) {
                $input.prop("checkABoxEnabled", true);

                icon = $(defaultOptions.iconHtml);
                icon.addClass(syncInputIconClass($input) + ' ' + defaultOptions.iconClass);
                $input.prop(iconPropertyName, icon);
                parent = $input.parent();

                parent.on("mousedown click touchstart", createClickEventCallback($input));
                icon.insertBefore($input);
            }
        });
    }

    function apply(action) {
        options = options || {};
        $.extend(defaultOptions, options);

        if (typeof action === "boolean") {
            setChecked($attachedElements, action);
        } else if (action === "toggle") {
            toggleCheckState($attachedElements);
        } else if (action === "bind") {
            attachEventListener($attachedElements);
        } else if (action === "refresh") {
            syncButtonGroup();
        }
    }

    apply(action);

    return $attachedElements;
};