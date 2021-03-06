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
  $templateCache.put("html/table_fragment.html",
    "<div class=\"table-fragment-wrap\">\n" +
    "    <div class=\"table-fragment-header\" ng-show=\"extractHeader\">\n" +
    "        <img ng-src=\"{{ headerIcon }}\" ng-if=\"headerIcon\"/>\n" +
    "        <h3 class=\"external-header\">{{ heading }}</h3>\n" +
    "        <div class=\"btn-group fragment-action-group\" dropdown ng-show=\"hidecolumn==='true'\">\n" +
    "            <button type=\"button\" class=\"dropdown-toggle fragment-action\" dropdown-toggle>\n" +
    "                <span class=\"fa fa-ellipsis-v icon\"></span>\n" +
    "            </button>\n" +
    "\n" +
    "            <ul class=\"dropdown-menu dropdown-menu-right column-container\" ng-if=\"extractHeader\" role=\"menu\">\n" +
    "                    <li ng-repeat=\"h in headers\"\n" +
    "                        ng-click=\"hideColumn(h.columnNumber, h)\"\n" +
    "                        ng-hide=\"h.allowed_hide\">\n" +
    "                        <a>\n" +
    "                            <i class=\"fa fa-check text-primary pull-right\"\n" +
    "                                ng-show=\"h.selected\"></i>\n" +
    "                            {{h.label}}\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card has-table table-fragment\"\n" +
    "        ng-class=\"{'no-header': extractHeader}\">\n" +
    "        <div class=\"card-head\" ng-if=\"!extractHeader\">\n" +
    "            <span class=\"fa {{headerIcon}} icon\"></span>\n" +
    "            <h4>{{heading}}</h4>\n" +
    "            <div class=\"btn-group pull-right\" dropdown ng-show=\"hidecolumn==='true'\">\n" +
    "                <button type=\"button\" class=\"dropdown-toggle fragment-action\" dropdown-toggle>\n" +
    "                    <span class=\"fa fa-ellipsis-v icon\">&#9776;</span>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu column-container\" role=\"menu\">\n" +
    "                        <li ng-repeat=\"h in headers\"\n" +
    "                            ng-click=\"hideColumn(h.columnNumber, h)\"\n" +
    "                            ng-hide=\"h.allowed_hide\">\n" +
    "                            <a class=\"column\">\n" +
    "                                <span class=\"fa fa-check text-primary pull-right\"\n" +
    "                                    ng-show=\"h.selected\">\n" +
    "                                    &#10003;\n" +
    "                                </span>\n" +
    "                                {{h.label}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card-body async-load\" data-role=\"table-holder\">\n" +
    "            <div class=\"load-mask\" data-role=\"load-mask\">\n" +
    "                <div class=\"loading-text\">\n" +
    "                    <span class=\"fa fa-spin fa-circle-o-notch\"></span>\n" +
    "                    Updating...\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"no-record-message\" ng-show=\"loadingStatus === 'failed'\">\n" +
    "                Some error occured while loading the data.\n" +
    "            </div>\n" +
    "            <div class=\"no-record-message\" ng-show=\"loadingStatus === 'empty'\">\n" +
    "                There are no records.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"loadMore\" ng-show=\"totalRecords>displayLimit\">\n" +
    "            <span class=\"pull-left\" ng-show=\"paginate\">\n" +
    "                {{ displayLimit }} per page.\n" +
    "            </span>\n" +
    "\n" +
    "<!--             <button type=\"button\" class=\"btn btn-primary btn-sm pull-right\"\n" +
    "                ng-click=\"showAllRecords()\" ng-show=\"showAll\">\n" +
    "                <span ng-hide=\"toggleShowText\">{{ 'TABLE.SHOW_ALL' | translate }}</span>\n" +
    "                <span ng-show=\"toggleShowText\">{{ 'TABLE.PAGINATED' | translate }}</span>\n" +
    "            </button> -->\n" +
    "\n" +
    "            <pagination total-items=\"totalRecords\" items-per-page=\"displayLimit\"\n" +
    "                ng-model=\"currentPage\" max-size=\"5\"\n" +
    "                class=\"pagination-small pull-right\" boundary-links=\"true\"\n" +
    "                ng-change=\"loadPrevNextPage()\"\n" +
    "                ng-show=\"paginate && !paginateMarker\">\n" +
    "            </pagination>\n" +
    "\n" +
    "            <pager total-items=\"totalRecords\" ng-model=\"currentPage\"\n" +
    "                items-per-page=\"displayLimit\"\n" +
    "                ng-change=\"loadPrevNextPage()\"\n" +
    "                ng-show=\"paginate && paginateMarker\"></pager>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("html/zs_dropdown.html",
    "<div ng-if=\"fieldLabel\">\n" +
    "    <label>{{ fieldLabel }}</label>\n" +
    "</div>\n" +
    "<div class=\"zs-dropdown-wrapper\"\n" +
    "    ng-class=\"{'is-active': isOpen == true}\">\n" +
    "    <div ng-show=\"selectionCount == 0 || multiSelect\">{{defaultLabel}}</div>\n" +
    "    <div ng-show=\"selectionCount > 0 && !multiSelect\">{{selectedItem}}</div>\n" +
    "    <ul class=\"zs-dropdown\">\n" +
    "        <li ng-repeat=\"item in items\"\n" +
    "            ng-click=\"itemClick( item )\">\n" +
    "            <a>{{item.textValue}}</a>\n" +
    "            <span class=\"pull-right selection-icon\"\n" +
    "                ng-show=\"item.isChecked\">\n" +
    "                &#10003\n" +
    "            </span>\n" +
    "        </li>\n" +
    "    </ul>\n" +
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
