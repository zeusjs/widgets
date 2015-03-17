'use strict';

describe( 'Directive: radioTabs', function () {

    // load the directive's module
    beforeEach( module( 'zeus.widgets' ) );
    beforeEach( module( 'html/radio_tabs.html' ) );

    var element, rootScope, scope, timeout,
        domStr;

    beforeEach( inject( function ( _$rootScope_, $timeout ) {
        rootScope = _$rootScope_;
        scope = rootScope.$new();
        timeout = $timeout;
    } ) );

    beforeEach( inject( function ( $compile ) {
        domStr = __html__[ 'test/mock_views/radio_tabs_1.html' ];
        element = angular.element( domStr );
        scope.currentTab = null;
        element = $compile( element )( scope );

        scope.$digest();
        timeout.flush();

        return element;
    } ) );

    describe( 'Correct rendering', function () {

        it( 'should have event handlers on scope', function () {
            expect( element.isolateScope().selectTab ).toBeDefined();
        } );

        it( 'should replace directive tags', function () {

            expect( element.prop( 'tagName' ) ).toMatch( /div/i );
            expect( element.prop( 'tagName' ) ).not.toMatch( /zs\-radio\-tabs/i );
        } );

        it( 'should have two tab headers', function () {
            var headers = element.find( 'li.radio-tab-option' ),
                tab1, tab2, tab3;

            expect( headers.length ).toBe( 3 );

            tab1 = headers.eq( 0 );
            tab2 = headers.eq( 1 );
            tab3 = headers.eq( 2 );

            expect( tab1.find( '.radio-tab-heading' ).text() ).
                toBe( 'Foobar' );

            expect( tab2.find( '.radio-tab-heading' ).text() ).
                toBe( 'Barbaz' );

            expect( tab3.find( '.radio-tab-heading' ).text() ).
                toBe( 'Zoom' );

            expect( tab1.find( '.radio-tab-subheading' ).text().trim() ).
                toBe( 'Foobar subhead' );

            expect( tab2.find( '.radio-tab-subheading' ).text().trim() ).
                toBe( 'Barbaz subhead' );

            expect( tab3.find( '.radio-tab-subheading' ).text().trim() ).
                toBe( 'Zoom subhead' );

        } );

        it( 'should have no selected tabs', function () {
            expect( element.find( 'li.radio-tab-option.selected' ).length ).
                toBe( 0 );
        } );

        it( 'should have one tab container', function () {

            expect( element.hasClass( 'radio-tab-container' ) ).toBe( true );
        } );

        it( 'should have two tab bodies', function () {
            expect( element.find( '.radio-tab-content' ).length ).toBe( 3 );
        } );

        it( 'should also transclude content of tabs', function () {
            var tabContainers, t;

            tabContainers = element.find( '.radio-tab-content-container' )
                .find( '.radio-tab-content' );

            t = tabContainers.eq( 0 ).find( '.nested-block' );
            expect( t.length ).toBe( 1 );
            expect( t.text().trim() ).toBe( 'This is foo' );

            t = tabContainers.eq( 1 ).find( '.nested-block' );
            expect( t.length ).toBe( 1 );
            expect( t.text().trim() ).toBe( 'This is bar' );

            t = tabContainers.eq( 2 ).find( '.nested-block' );
            expect( t.length ).toBe( 1 );
            expect( t.text().trim() ).toBe( 'This is zoom' );

        } );

        it( 'should initially hide tab body of all tabs', function () {
            var hiddenTabContents, visibleTabContents;

            hiddenTabContents = element.find( '.radio-tab-content-container' )
                .find( '.radio-tab-content.ng-hide' );

            visibleTabContents = element.find( '.radio-tab-content-container' )
                .find( '.radio-tab-content' ).not( '.ng-hide' );

            expect( hiddenTabContents.length ).toBe( 3 );
            expect( visibleTabContents.length ).toBe( 0 );
        } );

        it( 'should have a deselect button', function () {
            var deselect = element.find( '[ data-role="deselect"]' );
            expect( deselect.length ).toBe( 1 );

        } );
    } );

    describe( 'Selections', function () {

        var headers, bodies, deselect;

        beforeEach( function () {

            scope.onDeselect = jasmine.createSpy( 'onDeselect' );
            headers = element.find( 'li.radio-tab-option' );
            bodies = element.find( '.radio-tab-content' );
            deselect = element.find( '[ data-role="deselect"]' );
            headers.eq( 0 ).click();
        } );

        it( 'should correctly make selections', function () {

            expect( element.isolateScope().selection ).toBe( 'foo' );
            expect( scope.currentTab ).toBe( 'foo' );
            expect( headers.eq( 0 ).hasClass( 'is-selected' ) ).toBe( true );
            expect( headers.eq( 1 ).hasClass( 'is-selected' ) ).toBe( false );
            expect( headers.eq( 2 ).hasClass( 'is-selected' ) ).toBe( false );
            expect( bodies.eq( 0 ).hasClass( 'ng-hide' ) ).toBe( false );
            expect( bodies.eq( 1 ).hasClass( 'ng-hide' ) ).toBe( true );
            expect( bodies.eq( 2 ).hasClass( 'ng-hide' ) ).toBe( true );

            headers.eq( 1 ).click();

            expect( element.isolateScope().selection ).toBe( 'bar' );
            expect( scope.currentTab ).toBe( 'bar' );
            expect( headers.eq( 0 ).hasClass( 'is-selected' ) ).toBe( false );
            expect( headers.eq( 1 ).hasClass( 'is-selected' ) ).toBe( true );
            expect( headers.eq( 2 ).hasClass( 'is-selected' ) ).toBe( false );
            expect( bodies.eq( 0 ).hasClass( 'ng-hide' ) ).toBe( true );
            expect( bodies.eq( 1 ).hasClass( 'ng-hide' ) ).toBe( false );
            expect( bodies.eq( 2 ).hasClass( 'ng-hide' ) ).toBe( true );
        } );

        it( 'should clear selection on clicking deselect icon', function () {

            var i = 0;
            deselect.click();

            expect( element.isolateScope().selection ).toBeFalsy();
            expect( scope.currentTab ).toBeFalsy();

            for ( ; i < 3; i++ ) {
                expect( headers.eq( i ).hasClass( 'is-selected' ) ).toBe( false );
                expect( bodies.eq( i ).hasClass( 'ng-hide' ) ).toBe( true );
            }

            expect( scope.onDeselect ).toHaveBeenCalled();
        } );
    } );

} );
