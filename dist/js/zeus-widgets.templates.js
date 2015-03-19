angular.module('zeus.widgets.templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("html/checkbox.html",
    "<div class=\"zs-checkbox\"\n" +
    "    ng-class=\"{'zs-checkbox-lg': size == 'large',\n" +
    "                'zs-checkbox-sm': size == 'small',\n" +
    "                'zs-checkbox-md': size == 'medium'}\">\n" +
    "    <input type=\"checkbox\"\n" +
    "            ng-model=\"itemValue\"/>\n" +
    "    <label for=\"cb\" ng-click=\"itemValue = !itemValue\"\n" +
    "        ng-class=\"{'is-active': itemValue == true}\"></label>\n" +
    "</div>\n" +
    "");
  $templateCache.put("html/flip_card.html",
    "<div class=\"zs-flip-card\">\n" +
    "    <div class=\"face-container\">\n" +
    "        <div class=\"face face-front\">\n" +
    "            <div class=\"header clearfix\">\n" +
    "                <h6 class=\"pull-left\">\n" +
    "\n" +
    "                </h6>\n" +
    "                <span class=\"flip-btn pull-right\">\n" +
    "                    &#10149\n" +
    "                </span>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <div class=\"face face-back\">\n" +
    "            <div class=\"header clearfix\">\n" +
    "                <h6 class=\"pull-left\">\n" +
    "\n" +
    "                </h6>\n" +
    "                <span class=\"flip-btn pull-right\">\n" +
    "                    &#10149\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("html/radio_tabs.html",
    "<div class=\"radio-tab-container\">\n" +
    "    <div class=\"pull-right close-content\"\n" +
    "        ng-show=\"!!selection\" ng-click=\"deselectAll()\" data-role=\"deselect\">\n" +
    "        <span class=\"fa text-danger fa-reply\"></span>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Radio Tabs Option start -->\n" +
    "    <nav class=\"radio-tab-options\">\n" +
    "\n" +
    "        <ul class=\"radio-tabs-row\" ng-class=\"{'has-selection': selection}\">\n" +
    "\n" +
    "            <li class=\"radio-tab-option tab-header\" ng-repeat=\"p in panes\"\n" +
    "            ng-click=\"selectTab( p )\"\n" +
    "            ng-class=\"{'is-selected': selection == p.itemId }\">\n" +
    "                <div class=\"radio-tab-option-heading\">\n" +
    "                    <div class=\"selected-mark fa fa-check\"></div>\n" +
    "                    <div class=\"radio-tab-heading\">{{ p.heading }}</div>\n" +
    "                </div>\n" +
    "                <div class=\"radio-tab-subheading\">\n" +
    "                    {{ p.subHeading }}\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </nav>\n" +
    "\n" +
    "    <!-- Radio Tabs Option end -->\n" +
    "\n" +
    "    <!-- Radio Tabs Content blocks start -->\n" +
    "    <div class=\"radio-tab-content-container\"\n" +
    "        ng-show=\"selection\" data-role=\"pane-holder\">\n" +
    "        <div class=\"radio-tab-content\" ng-repeat=\"p in panes\"\n" +
    "            data-role=\"pane\" data-index=\"{{ $index }}\"\n" +
    "            ng-show=\"selection == p.itemId\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- Radio Tabs Content blocks end -->\n" +
    "</div>\n" +
    "");
  $templateCache.put("html/simple_toggle.html",
    "<div class=\"btn btn-sm simple-toggle-wrap\">\n" +
    "    <span data-role=\"icon\" class=\"toggle-icon\">&nbsp;</span>\n" +
    "    <span class=\"text-message\">{{text}}</span>\n" +
    "</div>\n" +
    "");
  $templateCache.put("html/zs_text.html",
    "<div class=\"form-group has-feedback\"\n" +
    "    ng-class=\"{'has-warning': validation.level == 'warning',\n" +
    "            'has-error': validation.level == 'error',\n" +
    "            'has-success': ( validation.level == 'success' && showTick )}\">\n" +
    "\n" +
    "    <label>\n" +
    "        {{ label }}\n" +
    "        <span class=\"mandatory-asterisk text-danger\" ng-if=\"mandatory\">\n" +
    "            *\n" +
    "        </span>\n" +
    "    </label>\n" +
    "\n" +
    "    <input type=\"text\" class=\"form-control\" ng-blur=\"validationHandler()\"\n" +
    "        placeholder=\"{{ placeholder }}\" ng-model=\"zsModel\" ng-disabled=\"isDisabled\">\n" +
    "\n" +
    "    <span data-role=\"icon\"\n" +
    "        class=\"fa form-control-feedback\"\n" +
    "        ng-class=\"{'fa-exclamation-triangle': validation.level == 'warning',\n" +
    "            'fa-times': validation.level == 'error',\n" +
    "            'fa-check': ( validation.level == 'success' && showTick ),\n" +
    "            'fa-spin': validation.inprogress,\n" +
    "            'text-muted': validation.inprogress,\n" +
    "            'fa-circle-o-notch': validation.inprogress}\">\n" +
    "    </span>\n" +
    "\n" +
    "    <div class=\"error-msg-block\"\n" +
    "        data-role=\"errorBlck\"\n" +
    "        ng-class=\"{'validation-warning': validation.level == 'warning',\n" +
    "            'validation-error': validation.level == 'error'}\">\n" +
    "\n" +
    "        <span class=\"error-sign fa\"\n" +
    "            ng-show=\"validation.level != 'success'\"\n" +
    "            ng-class=\"{'fa-exclamation-triangle': validation.level == 'warning',\n" +
    "            'fa-times': validation.level == 'error'}\">\n" +
    "        </span>\n" +
    "\n" +
    "        <span data-role=\"errormsg\">{{ validation.msg }}</span>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
