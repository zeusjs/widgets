'use strict';

describe( 'Directive: zsDropdown', function () {

    //load directive modules
    beforeEach( module( 'zeus.widgets' ) );
    beforeEach( module( 'html/zs_dropdown.html' ) );

    var scope, domStr, element;

    beforeEach( inject( function ( $rootScope ) {
        scope = $rootScope.$new();
        scope.data = [ 'option1', 'option2', 'option3' ];
        scope.getItemLabel = function ( item ) {
            return item + 'label';
        };
        scope.getItemId = function ( item ) {
            return item;
        };
    } ) );

    describe( 'Correct Rendering', function () {
        beforeEach( inject( function ( $compile ) {
            domStr = __html__[ 'test/mock_views/zs_dropdown.html' ];
            element = angular.element( domStr );
            element = $compile( element )( scope );

            scope.$digest();
        } ) );

        it( 'should have proper class for wrapper', function () {
            var wrapperElem = $( $( element ).children()[ 0 ] );
            expect( wrapperElem.hasClass( 'zs-dropdown-wrapper' ) ).toBe( true );
            expect( wrapperElem.hasClass( 'is-active' ) ).toBe( false );
        } );

        it( 'should display the default label', function () {
            var displayLabels = $( $( element ).children() ).find( 'div' ),
                defaultLabel = displayLabels[ 0 ],
                updatedlabel = displayLabels[ 1 ];

            expect( $( defaultLabel ).text() ).toBe( 'Select an Option' );
            expect( $( updatedlabel ).hasClass( 'ng-hide' ) ).toBe( true );
        } );

        it( 'should have dropdown list', function () {
            var list = $( $( element ).children() ).find( 'ul' ),
                listOptions = list.find( 'li' );

            expect( list.length ).toBe( 1 );
            expect( listOptions.length ).toBe( 3 );
        } );

        it( 'should generate correct labels for each list option', function () {
            var list = $( $( element ).children() ).find( 'ul' ),
                listOptions = list.find( 'li' );

            angular.forEach( listOptions, function ( item, i ) {
                var label = $( item ).find( 'a' );
                expect( $( label ).text() ).toBe( scope.data[ i ] + 'label' );
            } );
        } );

        it( 'should hide the tick mark for all options', function () {
            var list = $( $( element ).children() ).find( 'ul' ),
                listOptions = list.find( 'li' );

            angular.forEach( listOptions, function ( item ) {
                var tick = $( item ).find( 'span' );
                expect( $( tick ).hasClass( 'ng-hide' ) ).toBe( true );
            } );
        } );
    } );

    describe( 'Correct Functionality', function () {
        beforeEach( inject( function ( $compile ) {
            domStr = __html__[ 'test/mock_views/zs_dropdown.html' ];
            element = angular.element( domStr );
            element = $compile( element )( scope );

            scope.$digest();
        } ) );

        beforeEach( function () {
            scope.getDetails = jasmine.createSpy( 'getDetails' );
        } );

        beforeEach( function () {
            var list = $( $( element ).children() ).find( 'ul' ),
                listOptions = list.find( 'li' );

            $( listOptions[ 1 ] ).click();
        } );

        it( 'should update the label correctly on item select', function () {
            var displayLabels = $( $( element ).children() ).find( 'div' ),
                defaultLabel = displayLabels[ 0 ],
                updatedlabel = displayLabels[ 1 ];

            expect( $( defaultLabel ).hasClass( 'ng-hide' ) ).toBe( true );
            expect( $( updatedlabel ).text() ).toBe( 'option2label' );
        } );

        it( 'should call the callback method with correct item', function () {
            expect( scope.getDetails ).toHaveBeenCalled();
            expect( scope.getDetails ).toHaveBeenCalledWith( 'option2' );
        } );

        it( 'should show the tick mark for clicked item', function () {
            var list = $( $( element ).children() ).find( 'ul' ),
                listOptions = list.find( 'li' );

            angular.forEach( listOptions, function ( item, i ) {
                var tick = $( item ).find( 'span' );
                if ( i !== 1 ) {
                    expect( $( tick ).hasClass( 'ng-hide' ) ).toBe( true );
                } else {
                    expect( $( tick ).hasClass( 'ng-hide' ) ).toBe( false );
                }
            } );
        } );
    } );

    describe( 'Multi select option', function () {
        beforeEach( function () {
            scope.isMulti = true;
        } );

        beforeEach( inject( function ( $compile ) {
            domStr = __html__[ 'test/mock_views/zs_dropdown_multi.html' ];
            element = angular.element( domStr );
            element = $compile( element )( scope );

            scope.$digest();
        } ) );

        beforeEach( function () {
            var list = $( $( element ).children() ).find( 'ul' ),
                listOptions = list.find( 'li' );

            $( listOptions[ 1 ] ).click();
            $( listOptions[ 2 ] ).click();
        } );

        it( 'should update the label correctly on item select', function () {
            var displayLabels = $( $( element ).children() ).find( 'div' ),
                defaultLabel = displayLabels[ 0 ],
                updatedlabel = displayLabels[ 1 ];

            expect( $( defaultLabel ).text() ).toBe( 'Select an Option' );
            expect( $( updatedlabel ).hasClass( 'ng-hide' ) ).toBe( true );
        } );

        it( 'should show the tick mark for clicked item', function () {
            var list = $( $( element ).children() ).find( 'ul' ),
                listOptions = list.find( 'li' );

            angular.forEach( listOptions, function ( item, i ) {
                var tick = $( item ).find( 'span' );
                if ( i === 0  ) {
                    expect( $( tick ).hasClass( 'ng-hide' ) ).toBe( true );
                } else {
                    expect( $( tick ).hasClass( 'ng-hide' ) ).toBe( false );
                }
            } );
        } );
    } );

} );
