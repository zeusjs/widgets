/**
 * Copyright 2015, Symantec Corporation
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 */

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
