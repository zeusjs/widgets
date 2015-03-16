'use strict';

describe( 'Directive: btnAsync', function () {

    // load the directive's module
    beforeEach( module( 'zeus.widgets' ) );

    var element, scope, domStr, origContent, spinner;

    beforeEach( inject( function ( $rootScope, $compile ) {
        scope = $rootScope.$new();
        scope.doSomething = jasmine.createSpy( 'doSomething' );
        scope.isLoading = false;


        domStr = __html__[ 'test/mock_views/btn_async1.html' ];
        element = angular.element( domStr );
        element = $compile( element )( scope );

        origContent = element.find( '.btn-async-text' );
        spinner = element.find( '.btn-async-spinner' );
    } ) );

    describe( 'correct rendering', function () {

        it( 'should have the spinner', function () {
            expect( spinner.length ).toBe( 1 );
        } );

        it( 'should have the original content', function () {

            expect( origContent.length ).toBe( 1 );
            expect( origContent.find( 'span.fubar' ).text() ).toMatch( 'Hello' );
        } );

        it( 'should not prevent clicks', function () {
            var i = 1;

            while ( i <= 100 ) {
                element.click();
                i++;
            }

            expect( scope.doSomething.calls.count() ).toBe( 100 );
        } );
    } );

    describe( 'reaction to indicateLoading', function () {

        beforeEach( function () {
            scope.isLoading = true;
            scope.$apply();
        } );

        it( 'should have class is-loading', function () {
            expect( element.hasClass( 'is-loading' ) ).toBe( true );
        } );

        it( 'should disable clicks', function () {

            var i = 1;

            while ( i <= 100 ) {
                element.click();
                i++;
            }

            expect( scope.doSomething ).not.toHaveBeenCalled();
        } );
    } );
} );
