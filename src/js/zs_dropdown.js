/**
 * Copyright 2015, Symantec Corporation
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 */

'use strict';

/**
 *  @ngdoc directive
 *  @name zeus.widgets.directive:zsDropdown
 *  @restrict AE
 *
 *  @description
 *  A directive for rendering an animated dropdown menu with option
 *  for single or multiple selection
 *
 *  @scope
 *
 *  @param {Array.<object>} listItems List of values to be displayed in menu
 *  @param {function($selectedItem)=} onItemClick Callbak to be executed on
 *  selecting an option
 *  @param {boolean=} updateMenuLabel Title should be updated or not
 *  @param {function($item)=} labelGenerator Callback to provide labels for
 *  dropdown menu options
 *  @param {function($item)=} idGenerator Callback to provide ids for
 *  dropdown menu options
 *  @param {boolean=} multiSelect Should mulitple selection be allowed
 *  @param {string=} defaultLabel default value for dropdown header
 *  @param {string=} fieldLabel Text label to show in form.
 *
 *  @example
 <example module="zeus.widgets">
    <file name="index.html">
        <div ng-controller="myCtrl" style="padding-bottom:200px;">
            <zs-dropdown
                list-items="data"
                on-item-click="getDetails($selectedItem)"
                label-generator="getItemLabel($item)"
                id-generator="getItemId($item)"
                update-menu-label="true"
                zs-model="mySelection"
                default-label="Select an Option"
                field-label="">
            </zs-dropdown>
        </div>
    </file>
    <file name="myCtrl.js">
        angular.module( 'zeus.widgets' ).controller( 'myCtrl', function ( $scope ) {
            var itemId = 0;
            $scope.isMulti = false;
            $scope.data = [ 'option1', 'option2', 'option3' ];
            $scope.getItemLabel = function ( $item ) { return $item };
            $scope.getItemId = function ( $item ) { return $item };
            $scope.getDetails = function ( item ) { alert( item ) };
        } );
    </file>
 </example>
 */

angular.module( 'zeus.widgets' )
  .directive( 'zsDropdown', function () {

    var postLink;

    postLink = function ( scope, elem, attrs ) {
        var updateSelection;

        if ( angular.isDefined( attrs.multiSelect ) ) {
            scope.multiSelect = true;
        }

        updateSelection = function ( val ) {
            var itemId = scope.idGenerator( { $item: val } );

            angular.forEach( scope.items, function ( item ) {
                if ( itemId === item.id ) {

                    if ( !scope.multiSelect ) {
                        if ( !item.isChecked ) {
                            item.isChecked = true;
                            ++scope.selectionCount;
                            scope.selectedItem = item.textValue;
                        }
                    } else {
                        item.isChecked = true;
                        ++scope.selectionCount;
                    }
                } else {
                    if ( !scope.multiSelect ) {
                        if ( item.isChecked ) {
                            item.isChecked = false;
                            --scope.selectionCount;
                        }
                    }
                }
            } );
        };

        if ( !scope.defaultLabel ) {
            scope.defaultLabel = 'Select an item';
        }
        scope.items = [];
        scope.isOpen = false;
        scope.selectionCount = 0;
        scope.selectedItem = null;

        angular.forEach( scope.listItems, function ( item ) {
            var newObj = {};
            newObj.item = item;
            newObj.textValue = scope.labelGenerator( { $item: item } );
            newObj.id = scope.idGenerator( { $item: item } );
            scope.items.push( newObj );
        } );

        $( elem ).on( 'click.' + scope.$id, function ( event ) {
            var element = $( elem ).find( '.zs-dropdown-wrapper' ),
                menus = $( document ).find( '.zs-dropdown-wrapper' ),
                isElemActive = false;

            if ( element.hasClass( 'is-active' ) ) {
                isElemActive = true;
            }

            angular.forEach( menus, function ( menu ) {
                //Remove all the active menus
                if ( $( menu ).hasClass( 'is-active' ) ) {
                    $( menu ).removeClass( 'is-active' );
                }
            } );

            if ( !isElemActive ) {
                //If clicked menu was not active, make it active
                element.addClass ( 'is-active' );
            }

            event.stopPropagation();
        } );

        $( document ).on( 'click.' + scope.$id, function () {
            var element = $( elem ).find( '.zs-dropdown-wrapper' );
            if ( !$( event.target ).hasClass( 'zs-dropdown-wrapper' ) ) {
                if ( element.hasClass( 'is-active' ) ) {
                    element.removeClass( 'is-active' );
                }
            }
        } );

        scope.$on( '$destroy', function () {
            $( document ).off( 'click.' + scope.$id );
            $( elem ).off( 'click.' + scope.$id );
        } );

        if ( angular.isArray( scope.zsModel ) ) {
            //In case of multiple selection zsModel will be an array
            scope.$watchCollection( 'zsModel', function () {
                //Clear all checkmarks before updating.
                angular.forEach( scope.items, function ( item ) {
                    if ( scope.multiSelect && item.isChecked ) {
                        item.isChecked = false;
                    }
                } );
                //For each item in zsModel array, set the tick mark
                angular.forEach( scope.zsModel, function ( val ) {
                    updateSelection( val );
                } );
            } );
        } else {
            scope.$watch( 'zsModel', function ( val ) {
                if ( val ) {
                    updateSelection( val );
                }
            } );
        }

        scope.itemClick = function ( selectedItem ) {
            if ( angular.isArray( scope.zsModel ) ) {
                var index = scope.zsModel.indexOf( selectedItem.item );

                if ( index === -1 ) {
                    scope.zsModel.push( selectedItem.item );
                } else {
                    scope.zsModel.splice( index, 1 );
                }
            } else {
                scope.zsModel = selectedItem.item;
                scope.onItemClick( { $selectedItem: selectedItem.item } );
            }

        };
    };

    return {
        templateUrl: 'html/zs_dropdown.html',
        restrict: 'AE',
        scope: {
            listItems: '=',
            updateMenuLabel: '=?',
            labelGenerator: '&',
            idGenerator: '&',
            multiSelect: '@',
            defaultLabel: '@?',
            zsModel: '=?',
            onItemClick: '&?',
            fieldLabel: '=?'
        },
        link: postLink
    };
} );
