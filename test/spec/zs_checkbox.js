'use strict';

describe( 'Directive: zsCheckbox', function () {

    //load directive modules
    beforeEach( module( 'zeus.widgets' ) );
    beforeEach( module( 'html/checkbox.html' ) );

    var scope, element, domStr;

    beforeEach( inject( function ( $rootScope ) {
        scope = $rootScope.$new();
        scope.isSelected = true;
    } ) );

    describe( 'Correct Rendering', function () {
        beforeEach( inject( function ( $compile ) {
            domStr = __html__[ 'test/mock_views/checkbox.html' ];
            element = angular.element( domStr );
            element = $compile( element )( scope );

            scope.$digest();
        } ) );

        it( 'should have an input element', function () {
            var input = element.find( 'input' );
            expect( input.length ).toBe( 1 );
        } );

        it( 'should have a label element', function () {
            var el = element.find( 'label' );
            expect( el.length ).toBe( 1 );
        } );

        it( 'should have correct size class', function () {
            expect( element.hasClass( 'zs-checkbox-sm' ) ).toBe( true );
            expect( element.hasClass( 'zs-checkbox-md' ) ).toBe( false );
            expect( element.hasClass( 'zs-checkbox-lg' ) ).toBe( false );
        } );

        it( 'should have correct class for active state in label', function () {
            var el = element.find( 'label' );
            expect( el.hasClass( 'is-active' ) ).toBe( true );
        } );
    } );

    describe( 'State Update', function () {
        beforeEach( inject( function ( $compile ) {
            domStr = __html__[ 'test/mock_views/checkbox.html' ];
            element = angular.element( domStr );
            element = $compile( element )( scope );

            scope.$digest();
        } ) );

        beforeEach( function () {
            scope.updateSelection = jasmine.createSpy( 'updateSelection' );
        } );

        it( 'should remove class for active state in label', function () {
            var el = element.find( 'label' );
            el.click();
            expect( el.hasClass( 'is-active' ) ).toBe( false );
        } );

        it( 'should invoke the callback', function () {
            var el = element.find( 'label' );
            el.click();
            expect( scope.updateSelection ).toHaveBeenCalled();
        } );
    } );
} );
