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
