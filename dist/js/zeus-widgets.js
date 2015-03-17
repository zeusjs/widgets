'use strict';

angular.module( 'zeus.widgets', [ 'zeus.widgets.templates' ] );

'use strict';


/**
 *  @ngdoc directive
 *  @name zeus.widgets.directive:btnAsync
 *  @restrict C
 *
 *  @description
 *  A directive that provides a loading spinner to buttons
 *
 *  @scope
 *
 *  @param {boolean=} indicateLoading A two-way bound boolean that controls
 *    whether or not the spinner is shown
 *
 *  @example
 <example module="zeus.widgets">
    <file name="index.html">
        <div ng-controller="myCtrl">
            <div class="alert alert-warning">
                Releasing the Kraken takes 5 seconds
            </div>

            <button class="btn btn-lg btn-danger btn-async"
                indicate-loading="isLoading" ng-click="releaseKraken()">
                Release the Kraken!
            </button>
        </div>
    </file>
    <file name="myCtrl.js">
        angular.module( 'zeus.widgets' ).controller( 'myCtrl', function ( $scope, $timeout ){
            $scope.releaseKraken = function () {
                $scope.isLoading = true;

                $timeout( function () {
                    $scope.isLoading = false;
                }, 5000 );
            };
        } );
    </file>
 </example>
 **/
angular.module( 'zeus.widgets' ).directive( 'btnAsync', [ function () {
    var SPINNER_TEMPLATE = '<div class="btn-async-spinner">' +
                            '<div class="dot bounce1"></div>' +
                            '<div class="dot bounce2"></div>' +
                            '<div class="dot bounce3"></div></div>',
        preLink, postLink;

    postLink = function ( scope, element, attrs, ctrl, transcludeFn ) {
        var el = $( element );

        if ( !el.is( 'button' ) ) {
            return;
        }

        transcludeFn( function ( clone ) {
            var btnText = $( '<span class="btn-async-text"></span>' );

            el.html( SPINNER_TEMPLATE );
            btnText.append( clone );
            el.append( btnText );
        } );


        scope.$watch( 'indicateLoading', function ( val ) {
            if ( val ) {
                el.addClass( 'is-loading' );
            } else {
                el.removeClass( 'is-loading' );
            }
        } );
    };


    preLink = function ( scope, element ) {
        element.on( 'click touchstart', function ( e ) {
            if ( scope.indicateLoading ) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        } );
    };


    return {
        restrict: 'C',
        transclude: true,
        link: {
            pre: preLink,
            post: postLink
        },
        scope: {
            indicateLoading: '=?'
        }
    };
} ] );

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
