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
 *  @name zeus.widgets.directive:zsRadioTabs
 *  @restrict E
 *  @requires $interpolate
 *  @requires $timeout
 *
 *  @description
 *  A directive that provides tab like radio buttons
 *
 *  @scope
 *
 *  @param { function=} ondeselect Callback fired when selection is cleared
 *  @param { string } selection A two-way bound string that holds the identifier
 *    of current selection
 *
 *  @example
 <example module="zeus.widgets">
    <file name="index.html">
        <div ng-controller="myCtrl">
            <zs-radio-tabs selection="currentTab" ondeselect="onDeselect()">
                <zs-radio-tab-pane heading="Foo" item="foo"
                    subheading="This is a subheading for Foo">
                    <div class="nested-block">
                        This is foo
                    </div>
                </zs-radio-tab-pane>

                <zs-radio-tab-pane heading="Bar"
                    item="bar"
                    subheading="This is a subheading for Bar">
                    <div class="nested-block">
                        This is bar
                    </div>
                </zs-radio-tab-pane>
            </zs-radio-tabs>
        </div>
    </file>
    <file name="myCtrl.js">
        angular.module( 'zeus.widgets' ).controller( 'myCtrl', function ( $scope ) {
            $scope.currentTab = null;
            $scope.onDeselect = function () {
                console.log( 'Deselected!' );
            };
        } );
    </file>
 </example>
 **/
angular.module( 'zeus.widgets' )
    .directive( 'zsRadioTabs', [ '$interpolate', '$timeout',
        function ( $interpolate, $timeout ) {

        var postLinkFn, controller;

        controller = [ '$scope', function ( $scope ) {
            $scope.deselectAll = function () {
                $scope.selection = null;
                $scope.ondeselect();
            };

            $scope.selectTab = function ( tab ) {
                $scope.selection = tab.itemId;
            };
        } ];

        postLinkFn = function ( scope, elem, attrs, ctrl, transcludeFn ) {
            var paneInfo = [],
                paneHolder = $( elem.find( '[data-role="pane-holder"]' ) );

            transcludeFn( function ( clone ) {

                var i = 0,
                    paneItems;

                paneItems = clone.filter( 'zs-radio-tab-pane' );

                angular.forEach( paneItems, function ( p ) {

                    var itemId;

                    p = angular.element( p );
                    itemId = p.attr( 'item' );

                    paneInfo.push( {
                        heading: $interpolate( p.attr( 'heading' ) )(),
                        subHeading: $interpolate( p.attr( 'subheading' ) )(),
                        itemId: itemId
                    } );

                } );

                scope.panes = paneInfo;

                // XXX Hack. Find a better way of of trancluding after DOM render
                $timeout( function () {
                    angular.forEach( paneItems, function ( p ) {

                        var attachedPane;

                        p = angular.element( p );

                        attachedPane = paneHolder.find(
                            '[data-index="' + i + '"]' );

                        attachedPane.append( p.contents() );

                        i++;
                    } );

                }, 0 );

            } );
        };

        return {
            templateUrl: 'html/radio_tabs.html',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                ondeselect: '&',
                selection: '='
            },
            controller: controller,
            link: postLinkFn
        };
    }
] );
