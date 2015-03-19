'use strict';

describe( 'Directive: zsFlipCard', function () {
    //FIXME Add more test cases
    // load the directive's module
    beforeEach( module( 'zeus.widgets' ) );
    beforeEach( module( 'html/flip_card.html' ) );

    var scope, element, domStr;

    beforeEach( inject( function ( $rootScope ) {
        scope = $rootScope.$new();
    } ) );

    describe( 'Correct rendering', function () {
        beforeEach( inject( function ( $compile ) {
            domStr = __html__[ 'test/mock_views/zs_flip_card.html' ];
            element = angular.element( domStr );
            element = $compile( element )( scope );

            scope.$digest();
        } ) );

        it( 'should transclude content correctly for front face', function () {
            var frontFace = element.find( 'div.face-front' ),
                header = frontFace.find( 'div.header' ),
                headerVal = header.find( 'h6' ),
                flipBtn = header.find( '.flip-btn' ),
                content = frontFace.find( '[data-role="front-face"]' );

            //There should be only 1 front face
            expect( frontFace.length ).toBe( 1 );
            //Verify the heading of front face
            expect( headerVal.text() ).toBe( 'Flip Card Demo' );
            //Should have a flip icon
            expect( flipBtn.length ).toBe( 1 );
            //Verify the content of front face
            expect( content.text() ).toBe( 'Hello, World!' );
        } );

        it( 'should transclude content correctly for back face', function () {
            var backFace = element.find( 'div.face-back' ),
                header = backFace.find( 'div.header' ),
                headerVal = header.find( 'h6' ),
                flipBtn = header.find( '.flip-btn' ),
                content = backFace.find( '[data-role="back-face"]' );

            //There should be only 1 back face
            expect( backFace.length ).toBe( 1 );
            //Verify the heading of back face
            expect( headerVal.text() ).toBe( 'Back Face' );
            //Should have a flip icon
            expect( flipBtn.length ).toBe( 1 );
            //Verify the content of back face
            expect( content.text() ).toBe( 'This is back face.' );
        } );

        it( 'should not have flipped state active', function () {
            var flipContainer = element.find( 'face-container' );
            expect( flipContainer.hasClass( 'is-flipped' ) ).toBe( false );
        } );
    } );

    describe( 'Flip button functionality', function () {
        beforeEach( inject( function ( $compile ) {
            domStr = __html__[ 'test/mock_views/zs_flip_card.html' ];
            element = angular.element( domStr );
            element = $compile( element )( scope );

            scope.$digest();
        } ) );

        it( 'should flip the card backside', function () {
            var flipBtn = element.find( 'div.face-front .header .flip-btn' ),
                flipContainer = element.find( '.face-container' );
            flipBtn.click();

            expect( flipContainer.hasClass( 'is-flipped' ) ).toBe( true );
        } );
    } );

} );
