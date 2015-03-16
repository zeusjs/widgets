'use strict';

/**
 *  @ngdoc directive
 *  @name zsApp.directive:zsSimpleToggle
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
 *  @param {string=} switch-color Accept color code and get applied to border, checkmark
 *  etc
 *  @param {boolean=} inactive This disables the toggler and hide the border
 *  @param {function()=} zsChange Callback function to handle change event from
 *  controller.
 *  @example
<example module="zsApp">
    <file name="index.html">
        <div ng-controller="myCtrl">
            <zs-simple-toggle text="{{ toggle.label }}"
                switch-color="#9c27b0"
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
        angular.module( 'zsApp' ).controller( 'myCtrl', function ( $scope ) {

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
  .directive( 'zsSimpleToggle', [ 'lightenFilter', function ( lighten ) {
    return {
        templateUrl: 'templates/directives/simple_toggle.html',
        restrict: 'E',
        replace: true,
        scope: {
            text: '@',
            state: '=?',
            color: '@switchColor',
            zsChange: '&',
            inactive: '@'
        },

        link: function ( scope, element ) {
            var wrap = $( element ),
                icon = wrap.find( '[data-role="icon"]' ),
                toggleState,
                recalcStyles,
                attachEvents;

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
                    console.log( '------Mouse over------' );
                    $( this ).css( {
                        backgroundColor: lighten( scope.color, 60 )
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
                    icon.addClass( ' glyphicon-ok' );
                    bgColor = scope.color;
                    icon.html( '' );

                } else {
                    wrap.addClass( 'state-off' );
                    wrap.removeClass( 'state-on' );
                    icon.removeClass( 'glyphicon-ok' );
                    icon.html( '&nbsp;' );
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
