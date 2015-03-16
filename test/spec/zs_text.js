'use strict';

describe( 'Directive: zsText', function () {

    // load the directive's module
    beforeEach( module( 'zeus.widgets' ) );
    beforeEach( module( 'html/zs_text.html' ) );

    var element,
        scope, domStr,
        findInputEl, defered;

    findInputEl = function ( el ) {
        return el.find( 'input' );
    };

    beforeEach( inject( function ( $rootScope ) {
        scope = $rootScope.$new();
        scope.myValue = '';
        scope.isMyValueInvalid = false;

    } ) );

    describe( 'Correct rendering', function () {
        // FIXME not complete
        describe( 'Mandatory value', function () {
            beforeEach( inject( function ( $compile ) {
                domStr = __html__[ 'test/mock_views/zs_text_mandatory.html' ];
                element = angular.element( domStr );
                element = $compile( element )( scope );

                scope.$digest();
            } ) );

            it( 'should have an input', function () {
                var input = findInputEl( element );
                expect( input.length ).toBe( 1 );
            } );

            it( 'should correctly render label', function () {
                var label = element.find( 'label' ),
                    asterisk = label.find( '.mandatory-asterisk' );

                expect( label.length ).toBe( 1 );
                expect( asterisk.length ).toBe( 1 );
                expect( label.text().trim() ).toMatch( /\s*Foobar\s*\*\s*/ );
                expect( asterisk.text().trim() ).toBe( '*' );
            } );

            it( 'should correctly render input placeholder', function () {
                var input = findInputEl( element ),
                    placeholder = input.attr( 'placeholder' );

                expect( placeholder.trim() ).toBe( 'Give a name to this Storage Class' );
            } );

            it( 'should correctly render icon', function () {
                var icon = element.find( '[ data-role="icon"]' );
                expect( icon.length ).toBe( 1 );
            } );


            describe( 'errorBlock rendering', function () {

                it( 'should correctly render error block', function () {
                    var errorBlock = element.find( '[ data-role="errorBlck"]' );
                    expect( errorBlock.length ).toBe( 1 );
                } );

                it( 'should correctly render error sign in error block', function () {
                    var errorBlock = element.find( '[ data-role="errorBlck"]' ),
                        errorSign = errorBlock.find( '.error-sgn' );

                    expect( errorSign.length ).toBe( 1 );
                    expect( errorSign.css( 'display' ) ).not.toBe( 'block' );
                } );

                it( 'should correctly render error msg in error block', function () {
                    var errorBlock = element.find( '[ data-role="errorBlck"]' ),
                        errorMsg = errorBlock.find( '[ data-role="errormsg"]' );

                    expect( errorMsg.length ).toBe( 1 );
                    expect( errorMsg.text() ).toBe( ' ' );
                } );
            } );

        } );

        describe( 'Non-mandatory value', function () {
            beforeEach( inject( function ( $compile ) {
                domStr = __html__[ 'test/mock_views/zs_text_no_mandatory.html' ];
                element = angular.element( domStr );
                element = $compile( element )( scope );

                scope.$digest();
            } ) );

            it( 'should correctly render label', function () {
                var label = element.find( 'label' );
                expect( label.length ).toBe( 1 );
                expect( label.find( '.mandatory-asterisk' ).length ).toBe( 0 );
                expect( label.text() ).toMatch( /\s*Foobar\s*/ );
            } );
        } );
    } );

    describe( 'Scope bindings', function () {

        beforeEach( inject( function ( $compile ) {
            domStr = __html__[ 'test/mock_views/zs_text_mandatory.html' ];
            element = angular.element( domStr );
            element = $compile( element )( scope );

            scope.$digest();
        } ) );

        it( 'should bind value of textbox via zsModel', function () {
            var input = findInputEl( element );

            input.val( 'fubar' );
            input.change();
            expect( scope.myValue ).toBe( 'fubar' );
        } );
    } );

    describe( 'Validations with show-tick value', function () {

        beforeEach( inject( function ( $compile ) {

            domStr = __html__[ 'test/mock_views/zs_text_mandatory.html' ];
            element = angular.element( domStr );
            element = $compile( element )( scope );

            scope.$digest();
        } ) );


        describe( 'callback method', function () {

            beforeEach( function () {
                scope.validationCallback = jasmine.createSpy( 'validationCallback' );
            } );

            it( 'should invoke callback with correct parameters', function () {
                var input = findInputEl( element );

                input.val( 'fubar' );
                input.blur();

                expect( scope.validationCallback ).toHaveBeenCalledWith( 'fubar' );
            } );
        } );

        describe( 'returning success as `falsy` or `nothing`', function () {

            beforeEach( function () {
                scope.validationCallback =
                    jasmine.createSpy( 'validationCallback' )
                        .and.callFake( function () {
                            return false;
                        } );
            } );

            it( 'should show tick mark', function () {
                var input = findInputEl( element ),
                    icon = element.find( '[ data-role="icon"]' );

                input.val( 'fubar' );
                input.blur();

                expect( icon.attr( 'class' ) ).toMatch( /fa-check/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-exclamation-triangle/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-times/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-spin/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /text-muted/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-circle-o-notch/ );

                expect( scope.isMyValueInvalid ).toBe( false );
            } );
        } );

        describe( 'returing error as a string', function () {

            beforeEach( function () {
                scope.validationCallback =
                    jasmine.createSpy( 'validationCallback' )
                        .and.callFake( function () {
                            return 'Got an error string';
                        } );
            } );

            it( 'should show error icon', function () {
                var input = findInputEl( element ),
                    icon = element.find( '[ data-role="icon"]' );

                input.val( 'fubar' );
                input.blur();

                expect( icon.attr( 'class' ) ).toMatch( /fa-times/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-check/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-exclamation-triangle/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-spin/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /text-muted/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-circle-o-notch/ );

                expect( scope.isMyValueInvalid ).toBe( true );
            } );
        } );

        describe( 'returning as a promise', function () {

            beforeEach( inject( function ( $q ) {
                scope.validationCallback =
                    jasmine.createSpy( 'validationCallback' )
                        .and.callFake( function () {
                            defered = $q.defer();
                            return defered.promise;
                        } );
            } ) );

            it( 'should show success when promise returns nothing', function () {
                var input = findInputEl( element ),
                    icon = element.find( '[ data-role="icon"]' );

                input.val( 'fubar' );
                input.blur();

                defered.resolve();
                scope.$apply();

                expect( icon.attr( 'class' ) ).toMatch( /fa-check/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-exclamation-triangle/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-times/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-spin/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /text-muted/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-circle-o-notch/ );

                expect( scope.isMyValueInvalid ).toBe( false );

            } );

            it( 'should show error when $translate with error string is returned', function () {
                var input = findInputEl( element ),
                    icon = element.find( '[ data-role="icon"]' );

                input.val( 'fubar' );
                input.blur();

                defered.resolve( 'Got an error string' );
                scope.$apply();

                expect( icon.attr( 'class' ) ).toMatch( /fa-times/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-check/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-exclamation-triangle/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-spin/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /text-muted/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-circle-o-notch/ );

                expect( scope.isMyValueInvalid ).toBe( true );
            } );

            it( 'should show error when promise rejects with a string', function () {
                var input = findInputEl( element ),
                    icon = element.find( '[ data-role="icon"]' );

                input.val( 'fubar' );
                input.blur();

                defered.reject( 'Got an error string' );
                scope.$apply();

                expect( icon.attr( 'class' ) ).toMatch( /fa-times/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-check/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-exclamation-triangle/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-spin/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /text-muted/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-circle-o-notch/ );

                expect( scope.isMyValueInvalid ).toBe( true );
            } );

            it( 'should show error when promise rejects with level `error`', function () {
                var input = findInputEl( element ),
                    icon = element.find( '[ data-role="icon"]' );

                input.val( 'fubar' );
                input.blur();

                defered.reject( {
                    level: 'error',
                    msg: 'Got an error string'
                } );
                scope.$apply();

                expect( icon.attr( 'class' ) ).toMatch( /fa-times/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-check/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-exclamation-triangle/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-spin/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /text-muted/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-circle-o-notch/ );

                expect( scope.isMyValueInvalid ).toBe( true );
            } );

            it( 'should show warning msg when promise rejects with level `warning`', function () {
                var input = findInputEl( element ),
                    icon = element.find( '[ data-role="icon"]' );

                input.val( 'fubar' );
                input.blur();

                defered.reject( {
                    level: 'warning',
                    msg: 'Got an error string'
                } );
                scope.$apply();

                expect( icon.attr( 'class' ) ).toMatch( /fa-exclamation-triangle/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-times/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-check/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-spin/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /text-muted/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-circle-o-notch/ );

                expect( scope.isMyValueInvalid ).toBe( false );
            } );
        } );
    } );

    xdescribe( 'Validations without show-tick value', function () {

        beforeEach( inject( function ( $compile ) {

            domStr = __html__[ 'test/mock_views/zs_text_no_mandatory.html' ];
            element = angular.element( domStr );
            element = $compile( element )( scope );

            scope.$digest();
        } ) );

        describe( 'returning success as `falsy` or `nothing`', function () {

            beforeEach( function () {
                scope.validationCallback =
                    jasmine.createSpy( 'validationCallback' )
                        .and.callFake( function () {
                            return false;
                        } );
            } );

            it( 'should not show tick mark', function () {
                var input = findInputEl( element ),
                    icon = element.find( '[ data-role="icon"]' );

                input.val( 'fubar' );
                input.blur();

                expect( icon.attr( 'class' ) ).not.toMatch( /fa-check/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-exclamation-triangle/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-times/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-spin/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /text-muted/ );
                expect( icon.attr( 'class' ) ).not.toMatch( /fa-circle-o-notch/ );

                expect( scope.isMyValueInvalid ).toBe( false );
            } );
        } );
    } );

} );
