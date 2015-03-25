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
