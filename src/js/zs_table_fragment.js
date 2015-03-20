'use strict';
/* jshint camelcase: false */


/**
 *  @ngdoc directive
 *  @name zeus.widgets.directive:zsTableFragment
 *  @restrict E
 *
 *  @description
 *  A directive for abstracting tables and functionality like sorting,
 *  show/hide columns etc.
 *
 *  @scope
 *
 *  @param {string=} sortOn Two way binded keyPath to value on which data
 *      should be sorted. This can be passed to the `sortBy` filter along side `ngRepeat`
 *      that you will use to render rows
 *
 *  @param {string} heading A short title given to the table fragment
 *
 *  @param {boolean=} hidecolumn Controls whether or not to use columns hide functionality
 *
 *  @param {number=} totalRecords Remote - used to show the pagination over the page.
 *
 *  @param {function=} sortPaginateHandler Callback invoke the method which pull the paginated data
 *
 *  @param {boolean=} isDragable Controls whether rows can be rearraged by dragging
 *
 *  @param {function=} onItemDrop Callback invoked when row is dragged and dropped
 *
 *  @param {number=} displayLimit Number of items to be displayed per page
 *
 *  @param {function=} isLoadingStatus Callback function which should return an promise. This used
 *      to show the message/loading indicator to user while loading data. This promise should
 *      be resolved/rejected after fetching data from remote.
 *
 *  @param {string=} headerIcon Specify an image path that want to be displayed before header title.
 *
 *  @param {boolean=} paginate Remote - Attribute which controls whether pagination should use
 *      or not. "totalRecords" is mandatory while using paginate.
 *
 *  @param {boolean=} paginateMarker Remote - Attribute which shoud used with paginate. This created
 *      pager component for pagination (i.e. Prev and Next buttons)
 *
 *  @example
 <example module="zeus.widgets">
    <file name="index.html">
        <div ng-controller="myCtrl">
            <zs-table-fragment heading="Client sorting Demo"
                header-icon="fa-database" sort-on="predicate"
                hidecolumn="true"
                display-limit="30">
                <table class="node-disk-list responsive-table table">
                    <thead>
                        <th data-sort-key="sr">
                            Sr. No.
                        </th>
                        <th data-sort-key="firstname" sort-default="desc"
                            data-allowed-hide="false">
                            First Name
                        </th>
                        <th data-sort-key="lastname"
                            data-allowed-hide="false">
                            Last Name
                        </th>
                        <th data-sort-key="phone">
                            Phone
                        </th>
                    </thead>
                    <tbody>
                        <tr ng-repeat="p in person | orderBy:predicate"
                            ng-class="{'row-danger': d.sr == 5 }">
                            <td class="extra-attr">
                                {{ p.sr }}
                            </td>
                            <td class="primary-attr">
                                {{ p.firstname }}
                            </td>
                            <td class="extra-attr">
                                {{ p.lastname }}
                            </td>
                            <td class="extra-attr">
                                {{ p.phone }}
                            </td>

                        </tr>
                    </tbody>
                </table>
            </zs-table-fragment>

            <zs-table-fragment heading="Remote Sorting and pagination Demo"
                header-icon="fa-database" sort-on="remotepredicate"
                hidecolumn="true"
                total-records="totalRecords"
                sort-paginate-handler="loadPageList( pageNumber, recordsPerPage, sortParam )"
                display-limit="5" paginate>
                <table class="node-disk-list responsive-table table">
                    <thead>
                        <th data-sort-key="sr" sort-default="asc">
                            Sr. No.
                        </th>
                        <th data-sort-key="firstname"
                            data-allowed-hide="false">
                            Fist Name
                        </th>
                        <th data-sort-key="lastname"
                            data-allowed-hide="false">
                            Last Name
                        </th>
                        <th data-sort-key="phone">
                            Phone
                        </th>
                    </thead>

                    <tbody>
                        <tr ng-repeat="p in showList | orderBy:remotepredicate"
                        ng-class="{'row-danger': d.status == 2 }">
                            <td class="extra-attr">
                                {{ p.sr }}
                            </td>
                            <td class="primary-attr">
                                {{ p.firstname }}
                            </td>
                            <td class="extra-attr">
                                {{ p.lastname }}
                            </td>
                            <td class="extra-attr">
                                {{ p.phone }}
                            </td>

                        </tr>
                    </tbody>
                </table>
            </zs-table-fragment>
        </div>
    </file>
    <file name="myCtrl.js">
        angular.module( 'zeus.widgets' ).controller( 'myCtrl', function ( $scope, $q, $filter ){
            var people = [],
                i;
            $scope.person = [ {
                sr: 1,
                firstname: 'Abc',
                lastname: 'Cba',
                phone: '111-111-1111'
            },
            {
                sr: 2,
                firstname: 'Def',
                lastname: 'Fed',
                phone: '222-222-2222'
            },
            {
                sr: 3,
                firstname: 'Ghi',
                lastname: 'Ihg',
                phone: '333-333-3333'
            },
            {
                sr: 4,
                firstname: 'Jkl',
                lastname: 'Lkj',
                phone: '444-444-4444'
            },
            {
                sr: 5,
                firstname: 'Mno',
                lastname: 'Onm',
                phone: '555-555-5555'
            },
            {
                sr: 6,
                firstname: 'Pqr',
                lastname: 'Rqp',
                phone: '666-666-6666'
            },
            {
                sr: 7,
                firstname: 'Stu',
                lastname: 'Ust',
                phone: '555-555-5555'
            },
            {
                sr: 8,
                firstname: 'Vwx',
                lastname: 'Xwv',
                phone: '444-444-4444'
            },
            {
                sr: 9,
                firstname: 'Yz',
                lastname: 'Zy',
                phone: '333-333-3333'
            }];

            for(i = 0; i < 100; i++ ) {
                people.push( {
                    sr: i + 1,
                    firstname: 'Abc'+ i,
                    lastname: 'Xyz' + i,
                    phone: '898-898-89' + i
                } );
            }
            $scope.people = people;

            $scope.loadPageList = function ( pageNumber, recordsPerPage, sortParam ) {
                var lLimit = recordsPerPage * ( pageNumber - 1 ),
                    uLimit = recordsPerPage * pageNumber,
                    data = $scope.people,
                    promise,
                    def;

                def = $q.defer();

                if( sortParam ) {
                    data = $filter( 'orderBy' )( data, sortParam );
                }
                // This showList should get assigned from backend api response
                $scope.showList = data.slice( lLimit, uLimit );
                console.log( "ShowList-- " );
                console.log( $scope.showList );

                // totalRecords should also get set by API response
                $scope.totalRecords = data.length;

                def.resolve();
                return def.promise;
            };

        } );
    </file>
</example>
 */
angular.module( 'zeus.widgets' )
  .directive( 'zsTableFragment', function ( $interpolate, $timeout, $q ) {

    var postLink, preLink;

    preLink = function ( scope, element, attrs, nullCtrl, transcludeFn ) {

        var externalH3 = element.find( 'h3.external-header' ),
            tableHolder = element.find( '.card-body' );

        transcludeFn( function ( clone ) {

            var toolItems = clone.filter( '[data-role="toolbar-item"]' ),
                tableEl = angular.element( clone.filter( 'table' ) );

            if ( toolItems ) {
                angular.forEach( toolItems, function ( elem ) {
                    elem = angular.element( elem );
                    elem.addClass( 'table-toolbar-item' );
                    externalH3.after( elem );
                } );
            }
            tableHolder.prepend( tableEl );
        } );

    };

    postLink = function ( scope, element, attrs, nullCtrl, transcludeFn ) {
        preLink( scope, element, attrs, nullCtrl, transcludeFn );
        var table = element.find( 'table' ),
            tableHeaders = table.find( 'th[data-sort-key]' ),
            tableAllHeaders = table.find( 'th' ),
            tBody = table.find( 'tbody' ),
            ascClass = 'fa-sort-asc',
            descClass = 'fa-sort-desc',
            loadMaskElement = element.find( '[data-role="load-mask"]' ),
            generateSortingUI,
            generateShowHideUI,
            generateDragableUI,
            generateMobileHeaders,
            init,
            icons,
            sortParam;

        loadMaskElement.show();
        table.addClass( 'sortable' );

        generateSortingUI = function () {
            if ( tableHeaders.length ) {
                tableHeaders.addClass( 'sort-active' );

                $.each( tableHeaders, function () {

                    var that = $( this ),
                        className = '';
                    if ( that.attr( 'sort-default' ) ) {
                        that.addClass( that.attr( 'sort-default' ) );
                        if ( that.attr( 'sort-default' ) === 'asc' ) {
                            className = ascClass;
                            that.addClass( 'asc' );
                            scope.sortOn = that.data( 'sortKey' );
                            sortParam = that.data( 'sortKey' );
                        } else if ( that.attr( 'sort-default' ) === 'desc' ) {
                            className = descClass;
                            that.addClass( 'desc' );
                            scope.sortOn = '-' + that.data( 'sortKey' );
                            sortParam = '-' + that.data( 'sortKey' );
                        }
                    }
                    that.append( '<span class="fa ' + className +
                        ' showCheckIcon" data-role="icon"></span>' );
                } );

                icons = table.find( '.fa' );

                table.on( 'click', 'th', function () {
                    var that = $( this ),
                        icon = that.find( '.fa' );

                    loadMaskElement.show();
                    icons.removeClass( ascClass ).removeClass( descClass );

                    if ( that.hasClass( 'asc' ) ) {
                        that.toggleClass( 'asc desc' );
                        icon.addClass( descClass );
                        scope.$apply( function () {
                            if ( !scope.remoteSort ) {
                                scope.sortOn = '-' + that.data( 'sortKey' );
                                loadMaskElement.hide();
                            } else {
                                sortParam = '-' + that.data( 'sortKey' );
                                scope.sortOn = '-' + that.data( 'sortKey' );
                                scope.currentPage = 1;
                                scope.loadPrevNextPage();
                            }

                        } );
                    } else {
                        that.removeClass( 'desc' ).addClass( 'asc' );
                        icon.addClass( ascClass );
                        scope.$apply( function () {
                            if ( !scope.remoteSort ) {
                                scope.sortOn = that.data( 'sortKey' );
                                loadMaskElement.hide();
                            } else {
                                sortParam = that.data( 'sortKey' );
                                scope.sortOn = that.data( 'sortKey' );
                                scope.currentPage = 1;
                                scope.loadPrevNextPage();
                            }
                        } );
                    }
                } );

            }
        };

        generateDragableUI = function () {
            if ( scope.isDragable ) {
                tBody.sortable( {
                    opacity: 0.6,
                    update: function () {
                        var loadMask = element.find( '[data-role="load-mask"]' ),
                            x;

                        element.find( '[data-role="load-mask"]' ).show();

                        x = scope.onItemDrop();
                        x.then( function () {
                            loadMask.hide();
                        },
                        function () {
                            loadMask.hide();
                            tBody.sortable( 'cancel' );
                        } );

                    }
                } ).disableSelection();
            }
        };

        generateShowHideUI = function () {
            var columnNumber = 1;
            scope.headers = [];

            $.each( tableAllHeaders, function () {
                var obj = {},
                    that = $( this ),
                    headerText = $interpolate( that.text() )();

                obj.label = headerText;
                obj.selected = true;
                obj.columnNumber = columnNumber++;
                obj.allowed_hide = ( that.data( 'allowed-hide' ) !== false ) ? false : true;
                obj.isSortingEnabled = that.data( 'sortKey' ) ? true : false;
                obj.sortKey = that.data( 'sortKey' );

                if ( that.attr( 'sort-default' ) === 'asc' ) {
                    obj.className = ascClass;
                } else if ( that.attr( 'sort-default' ) === 'desc' ) {
                    obj.className = descClass;
                }

                scope.headers.push( obj );

            } );
        };

        generateMobileHeaders = function () {
            var colNum = 1,
                headerElem = '',
                headerText,
                tCol;

            $timeout( function () {
                $.each( tableAllHeaders, function () {
                    headerText = $interpolate( $( this ).text() )();
                    headerElem = '<span class="mobileColumnHeader">';
                    headerElem += headerText + ':';
                    headerElem += '</span>';
                    tCol = tBody.find( 'td:nth-child( ' + colNum + ' )' );
                    tCol.find( '.mobileColumnHeader' ).remove();
                    tCol.prepend( headerElem );
                    colNum++;
                } );

                if ( !tBody.find( 'tr' ).length ) {
                    scope.loadingStatus = 'empty';
                }
            }, 0 );
        };

        init = function () {

            scope.headerIcon = attrs.headerIcon;
            scope.paginate = attrs.paginate !== undefined ? true : false;
            scope.paginateMarker = attrs.paginateMarker !== undefined ? true : false;
            scope.showAll = attrs.showAll !== undefined ? true : false;
            scope.remoteSort = attrs.sortPaginateHandler !== undefined ? true : false;
            scope.currentPage = 1;

            if ( attrs.sortOn || attrs.sortPaginateHandler ) {
                generateSortingUI();
            }
            if ( scope.isDragable ) {
                generateDragableUI();
            }

            generateShowHideUI();

            if ( scope.remoteSort ) {
                scope.$watch( 'totalRecords', function () {
                    if ( !scope.totalRecords ) {
                        scope.loadPrevNextPage();
                    }
                } );
            } else {
                $q.when( scope.isLoadingStatus() ).then( function () {
                    generateMobileHeaders();
                    loadMaskElement.hide();
                }, function () {
                    scope.loadingStatus = 'failed';
                    loadMaskElement.hide();
                } );
            }
        };

        scope.showAllRecords = function () {
            if ( !scope.toggleShowText ) {
                scope.paginate = undefined;
                scope.displayList = scope.srcList;
            } else {
                scope.paginate = true;
                scope.loadPrevNextPage();
            }
            scope.toggleShowText = !scope.toggleShowText;
        };

        scope.hideColumn = function ( index, obj ) {
            obj.selected = !obj.selected;
            element.toggleClass( 'hideColumn' + index );
        };

        scope.loadPrevNextPage = function () {
            var promise,
                pageState = '';

            loadMaskElement.show();

            if ( scope.oldPageNumber ) {
                if ( scope.oldPageNumber > scope.currentPage ) {
                    pageState = 'prev';
                } else if ( scope.oldPageNumber < scope.currentPage ) {
                    pageState = 'next';
                }
            }
            scope.oldPageNumber = scope.currentPage;

            if ( scope.paginateMarker ) {
                promise = scope.sortPaginateHandler( {
                    pageState: pageState,
                    recordsPerPage: scope.displayLimit,
                    sortParam: sortParam
                } );
            } else {
                promise = scope.sortPaginateHandler( {
                    pageNumber: scope.currentPage,
                    recordsPerPage: scope.displayLimit,
                    sortParam: sortParam
                } );
            }

            promise.then( function () {
                $timeout( function () {
                    if ( !tBody.find( 'tr' ).length ) {
                        scope.loadingStatus = 'empty';
                    }
                }, 0 );
                loadMaskElement.hide();
                generateMobileHeaders();
            }, function () {
                scope.loadingStatus = 'failed';
                loadMaskElement.hide();
            } );
        };

        init();
    };


    return {
        templateUrl: 'html/table_fragment.html',
        transclude: true,
        replace: true,
        restrict: 'E',
        scope: {
            sortOn: '=?',
            heading: '@?',
            hidecolumn: '@?',
            isDragable: '@?',
            onItemDrop: '&?',
            displayLimit: '@?',
            sortPaginateHandler: '&?',
            totalRecords: '=?',
            isLoadingStatus: '&?'
        },

        controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
            if ( $attrs.extractHeader !== undefined ) {
                $scope.extractHeader = true;
            } else {
                $scope.extractHeader = false;
            }

            //console.log( $scope.extractHeader, $attrs );
        } ],
        link: postLink
    };
} );
