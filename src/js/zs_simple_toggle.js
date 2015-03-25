/**
 * Copyright 2015, Symantec Corporation
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 */

'use strict';
/*jshint bitwise: false */

/**
 *  @ngdoc directive
 *  @name zeus.widgets.directive:zsSimpleToggle
 *  @restrict E
 *
 *  @description
 *
 *  This provides the toggle componant which can be used as checkbox and customize
 *  with color, click callback etc.
 *
 *  @scope
 *
 *  @param {string=} text Sets the display text for toggle button.
 *  @param {boolean=} state Set/get the current state of the toggler. Also can set
 *  default state to true/false.
 *  @param {Number=} lighten Lignten ratio for mouseover background color. Can
 *  @param {string=} switch-color Accept color code and get applied to border, checkmark
 *  etc
 *  @param {boolean=} inactive This disables the toggler and hide the border
 *  @param {function()=} zsChange Callback function to handle change event from
 *  controller.
 *  @example
<example module="zeus.widgets">
    <file name="index.html">
        <div ng-controller="myCtrl">
            <zs-simple-toggle text="{{ toggle.label }}"
                switch-color="#9c27b0"
                lighten="50"
                zs-change="clickMe()"
                state="toggle.state">
            </zs-simple-toggle>

            <zs-simple-toggle text="Inactive"
                switch-color="#12287E"
                state="true"
                inactive="true">
            </zs-simple-toggle>

        </div>
    </file>
    <file name="myCtrl.js">
        angular.module( 'zeus.widgets' ).controller( 'myCtrl', function ( $scope ) {

            $scope.toggle = {
                label: "Demo Label",
                state: false
            };

            $scope.clickMe = function () {
                alert( 'You clicked Me...!!!' );
            };

        } );
    </file>
</example>
 */

angular.module( 'zeus.widgets' )
  .directive( 'zsSimpleToggle', [ function () {
    return {
        templateUrl: 'html/simple_toggle.html',
        restrict: 'E',
        replace: true,
        scope: {
            text: '@',
            state: '=?',
            lighten: '@',
            color: '@switchColor',
            zsChange: '&',
            inactive: '@'
        },

        link: function ( scope, element ) {
            var wrap = $( element ),
                icon = wrap.find( '[data-role="icon"]' ),
                toggleState,
                recalcStyles,
                attachEvents,
                lighten;

            lighten = function ( col, amt ) {
                var usePound = false,
                    num, r, b, g;

                if ( col[ 0 ] === '#' ) {
                    col = col.slice( 1 );
                    usePound = true;
                }

                num = parseInt( col, 16 );
                r = ( num >> 16 ) + amt;

                if ( r > 255 ) {
                    r = 255;
                } else if ( r < 0 ) {
                    r = 0;
                }

                b = ( ( num >> 8 ) & 0x00FF ) + amt;

                if ( b > 255 ) {
                    b = 255;
                } else if ( b < 0 ) {
                    b = 0;
                }

                g = ( num & 0x0000FF ) + amt;

                if ( g > 255 ) {
                    g = 255;
                } else if ( g < 0 ) {
                    g = 0;
                }

                return ( usePound ? '#' : '' ) +
                    ( g | ( b << 8 ) | ( r << 16 ) ).toString( 16 );
            };

            // Handler for state toggle.
            // Fired on click of slider
            toggleState = function () {
                scope.state = !scope.state;

                if ( scope.zsChange ) {
                    scope.zsChange();
                }

                recalcStyles();
            };

            attachEvents = function () {
                icon.css( {
                    borderColor: scope.color
                } );

                wrap.css( {
                    borderColor: scope.color
                } );

                wrap.click( function () {
                    scope.$apply( function () {
                        toggleState();
                    } );
                } );

                wrap.mouseover( function () {
                    $( this ).css( {
                        backgroundColor: lighten( scope.color, +( scope.lighten ) )
                    } );
                } );

                wrap.mouseout( function () {
                    $( this ).css( {
                        backgroundColor: '#FFF'
                    } );
                } );
            };

            recalcStyles = function () {
                var bgColor = '#FFF';

                if ( scope.state ) {
                    wrap.addClass( 'state-on' );
                    wrap.removeClass( 'state-off' );
                    bgColor = scope.color;

                } else {
                    wrap.addClass( 'state-off' );
                    wrap.removeClass( 'state-on' );
                }

                icon.css( {
                    backgroundColor: bgColor
                } );
            };

            scope.state = scope.state || false;

            if ( !scope.inactive ) {
                recalcStyles();
                attachEvents();
            } else {
                wrap.addClass( 'state-inactive' );
            }
            // Watch for changes in state
            scope.$watch( 'state', function () {
                recalcStyles();
            } );
        }
    };
} ] );
