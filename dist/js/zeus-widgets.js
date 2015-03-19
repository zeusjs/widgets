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
 * @ngdoc directive
 * @name zeus.widgets.directive:zsCheckbox
 * @restrict E

 *  @description
 *  A directive that provides custom checkbox of varying size.
 *
 *  @scope
 *
 *  @param {boolean=} itemValue Current state of checkbox.
 *  @param {string=} size Size of the checkbox(small, medium or large).
 *  @param {function=} onValueChange Callback method to be executed every
 *  time the state of checkbox changes.
 *
 *  @example
 <example module="zeus.widgets">
    <file name="index.html">
        <div ng-controller="myCtrl">
            <zs-checkbox
                item-value="isSmallSelected"
                size="small"
                on-value-change="updateSelection()">
            </zs-checkbox>
            <zs-checkbox
                item-value="isMediumSelected"
                size="medium">
            </zs-checkbox>
            <zs-checkbox
                item-value="isLargeSelected"
                size="large">
            </zs-checkbox>
        </div>
    </file>
    <file name="myCtrl.js">
        angular.module( 'zeus.widgets' ).controller( 'myCtrl', function ( $scope ) {
            $scope.isSmallSelected = true;
            $scope.isMediumSelected = true;
            $scope.isLargeSelected = true;

            $scope.updateSelection = function() {
                console.log( 'value updated' );
            }
        } );
    </file>
 </example>
*/
angular.module( 'zeus.widgets' )
  .directive( 'zsCheckbox', function () {

    var postLink;

    postLink = function ( scope ) {
        scope.$watch( 'itemValue', function () {
            scope.onValueChange();
        } );
    };

    return {
        templateUrl: 'html/checkbox.html',
        restrict: 'E',
        replace: true,
        scope: {
            itemValue: '=',
            size: '@',
            onValueChange: '&?'
        },
        link: postLink
    };
} );

'use strict';

/**
 * @ngdoc directive
 * @name zeus.widgets.directive:zsFlipCard
 * @restrict E
 *
 * @description
 *
 * @param {boolean=} hideFlipButton Explicitly hide flipping button.
 *        Flips can only be done programmatically.
 * @param {string=} activeFace Face that is currently shown or to be shown. Two way bound.
 *
 * @example
 <example module="zeus.widgets">
    <file name="index.html">
        <div style="height:300px">
        <div class="row">
        <zs-flip-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div data-role="front-face" data-heading="Flip Card Demo">

                Hello, World!
            </div>
            <div data-role="back-face" data-heading="Lord of the Rings">
                <span>

                    <p>Three Rings for the Elven-kings under the sky,</p>
                    <p>Seven for the Dwarf-lords in their halls of stone,</p>
                    <p>Nine for Mortal Men doomed to die,</p>
                    <p>One for the Dark Lord on his dark throne</p>
                    <p>In the Land of Mordor where the Shadows lie.</p>
                    <p>One Ring to rule them all, One Ring to find them,</p>
                    <p>One Ring to bring them all and in the darkness bind them</p>
                    <p>In the Land of Mordor where the Shadows lie.</p>
                </span>
            </div>
        </zs-flip-card>
        </div>
        </div>
    </file>
 </example>
*/

angular.module( 'zeus.widgets' )
    .directive( 'zsFlipCard', [ '$timeout',
    function ( $timeout ) {

        var postLinkFn;

        postLinkFn = function ( scope, elem, attrs, nullCtrl, transcludeFn ) {

            var container = $( elem.find( '.face-container' ) ),
                win = $( window ),
                resizeWait, relayout, adjustHeights,
                frontFace, backFace,
                frontEl, backEl, fHeading, bHeading, doFlip;

            transcludeFn( function ( clone ) {
                var faces;

                faces = clone.filter( 'div' );
                angular.forEach( faces, function ( f ) {
                    f = $( f );

                    switch ( f.data( 'role' ) ) {
                        case 'front-face':
                            frontEl = f;
                            fHeading = f.data( 'heading' );
                            break;

                        case 'back-face':
                            backEl = f;
                            bHeading = f.data( 'heading' );
                            break;
                    }
                } );
            } );

            container.find( '.face-front' ).append( frontEl );
            container.find( '.face-front' ).find( '.header h6' ).text( fHeading );
            container.find( '.face-back' ).append( backEl );
            container.find( '.face-back' ).find( '.header h6' ).text( bHeading );

            if ( angular.isDefined( attrs.hideFlipButton ) ) {
                container.find( '.flip-btn' ).hide();
            } else {
                container.find( '.flip-btn' ).click( function () {
                    doFlip();
                } );
            }


            frontFace = elem.find( '.face-front' );
            backFace = elem.find( '.face-back' );

            scope.$watch( 'activeFace', function ( face ) {
                var isFlipped = container.hasClass( 'is-flipped' );

                if ( !face ) {
                    return;
                }

                switch ( face ) {
                    case 'front':
                        if ( isFlipped ) {
                            doFlip();
                        }
                        break;

                    case 'back':
                        if ( !isFlipped ) {
                            doFlip();
                        }
                        break;
                }

            } );

            // Attach stuff to scope
            doFlip = function () {
                var isFlipped = container.hasClass( 'is-flipped' );

                container.toggleClass( 'is-flipped' );

                if ( isFlipped ) {
                    scope.activeFace = 'front';
                } else {
                    scope.activeFace = 'back';
                }
            };


            relayout = function () {
                adjustHeights();
            };

            adjustHeights = function () {
                var maxHeight = backFace.height(),
                wrapHeight = Math.max( frontFace.outerHeight(), backFace.outerHeight() );

                // Make front and back heights equal
                frontFace.height( maxHeight );
                elem.height( wrapHeight + 10 );

            };

            win.on( 'resize.zs_flip_card_' + scope.$id, function () {
                var isVisible = elem.is( ':visible' );
                if ( resizeWait ) {
                    $timeout.cancel( resizeWait );
                }

                if ( !isVisible ) {
                    return;
                }
                resizeWait = $timeout( function () {
                    relayout();
                }, 500 );
            } );

            $timeout( function () {
                adjustHeights();
            } );

        };

        return {
            templateUrl: 'html/flip_card.html',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                activeFace: '=?'
            },
            link: postLinkFn
        };
    }
] );

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
