'use strict';

angular.module( 'zeus.widgets', [] );

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

'use strict';

/**
 *  @ngdoc directive
 *  @name zeus.widgets.directive:zsText
 *  @restrict E
 *
 *  @description
 *  That provides textbox along with label, placholder and custom validation
 *  capabilities
 *
 *  #How validation works
 *  The validator callback is triggered on blur and is passed the current text
 *  in the underlying text box. The directive interprets the return value
 *  of this callback using following logic:
 *
 *  - In the simplest case, the validator may return `undefined` or any falsy
 *    value. This is intrpreted as validation success.
 *  - If the validator returns a `string`, it is considered to be a validation
 *    error and the string is shown as validation error message and `isInvalid`
 *    is set to `true`.
 *  - If the validator may also return an `object` with following properties:
 *
 *      * **msg** - `string` - Validation failure message
 *      * **level** - `string` - This can take values `error` or `warning`.
 *        If level is `warning`, `isInvalid` is set to `false` ( permissible
 *        error )
 *  - Additionally, the validator may also return a {@link ng.$q promise }.
 *    This is useful in scenarios where validation is done via XHR.
 *  - If validator returns a promise:
 *
 *      * resolves with a `string`, it is considered to be a validation error. This is
 *        useful when API user is using {@link pascalprecht.translate.$translate $translate }
 *        that returns a promise.
 *      * resolves with anything other than string, its validation success.
 *      * rejects, the rules( 2 ) and( 3 ) mentioned above are applied with the
 *        result of rejection
 *
 *  @scope
 *
 *  @param {function($val)=} validator Callback function that accepts
 *  text entered in text box and returns a repsonse indicating validation success
 *  or failure. Value is passed in as `$val`.
 *  @param {string=} placholder Placeholder text for the text box
 *  @param {string=} label Label for the text box
 *  @param {boolean=} showTick controls whether a 'tick mark' should be shown inside
 *  text box on successful validation
 *  @param {boolean=} isInvalid set to true if validator returns validation error
 *  @param {string=} zsModel two way bound with the value entered in the text box
 *
 *
 *  @example
<example module="zeus.widgets">
    <file name="index.html">
        <div ng-controller="myCtrl">
            <zs-text validator="validate( $val )" label="My name"
                placeholder="Give me a name">
            </zs-text>
        </div>
    </file>
    <file name="myCtrl.js">
        angular.module( 'zeus.widgets' ).controller( 'myCtrl', function ( $scope ) {
            $scope.validate = function ( value ) {
                if ( value !== 'Amey' ) {
                    return 'You entered incorrect name';
                }
            };
        } );
    </file>
</example>
 */
angular.module( 'zeus.widgets' )
    .directive( 'zsText', function () {

        var postLink, unwrapMsg;

        unwrapMsg = function ( msgObj, scope ) {

            if ( angular.isString( msgObj ) ) {
                scope.validation.msg = msgObj;
            } else {
                msgObj.then( function ( msg ) {

                    scope.validation.msg = msg;
                } );
            }
        };

        postLink = function ( scope, elem, attrs ) {

            var element = $( elem[ 0 ] ),
                icon = element.find( '[data-role="icon"]' ),
                indicateSuccess, indicateWarning, indicateError;

            scope.validation = {
                msg: ' ',
                level: null,
                inprogress: false
            };

            if ( angular.isString( attrs.mandatory ) ) {
                scope.mandatory = true;
            }

            indicateSuccess = function () {

                scope.validation.msg = ' ';
                scope.validation.level = 'success';
                scope.validation.inprogress = false;
                scope.isInvalid = false;
            };

            indicateWarning = function ( msgObj ) {
                icon.show();

                unwrapMsg( msgObj, scope );
                scope.validation.level = 'warning';
                scope.validation.inprogress = false;
                scope.isInvalid = false;
            };

            indicateError = function ( msgObj ) {

                icon.show();
                unwrapMsg( msgObj, scope );
                scope.validation.level = 'error';
                scope.validation.inprogress = false;
                scope.isInvalid = true;
            };

            scope.validationHandler = function () {
                var textboxValue = element.find( 'input' )[ 0 ].value,
                    validationResult = scope.validateValue( { $val: textboxValue } );

                scope.validation.msg = ' ';
                scope.validation.level = '';
                scope.validation.inprogress = true;

                // In simplest case,
                // API user can returns `nothing` or falsy if successful
                if ( !validationResult ) {
                    indicateSuccess();
                    return;
                }

                // or a simple string as validation error....
                if ( angular.isString( validationResult ) ) {
                    indicateError( validationResult );
                    return;
                } else if ( validationResult.level && validationResult.msg ) {
                    switch ( validationResult.level ) {
                        case 'warning':
                            indicateWarning( validationResult.msg );
                            break;

                        case 'error':
                            indicateError( validationResult.msg );
                            break;
                    }
                }

                // or indicates validation problem through a
                // 1. Promise that REJECTS with an object of format { level:, msg:}
                // 2. Promise that RESOLVES with a string which be taken as validation error
                validationResult.then( function ( response ) {

                    if ( angular.isString( response ) ) {
                        indicateError( response );
                        return;
                    }
                    indicateSuccess();

                }, function ( response ) {

                    if ( angular.isString( response ) ) {
                        indicateError( response );
                        return;
                    } else {
                        switch ( response.level ) {
                            case 'warning':
                                indicateWarning( response.msg );
                                break;

                            case 'error':
                                indicateError( response.msg );
                                break;
                        }
                    }
                } );

            };
        };


        return {
            templateUrl: 'html/zs_text.html',
            replace: true,
            restrict: 'E',

            scope: {
                validateValue: '&validator',
                placeholder: '@',
                showTick: '@',
                isInvalid: '=',
                label: '@',
                zsModel: '=?',
                isDisabled: '=?'
            },

            link: postLink
        };
    }
);
