'use strict';

angular.module('LS-APPMON.Home', ['ui.grid', 'ui.grid.autoResize', 'ui.grid.resizeColumns'])
    .directive('setRowHeight', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $timeout(function() {
                    // Get the Parent Divider.
                    var parentContainer = element.parent()[0];
                    console.log(parentContainer.offsetHeight);

                    // Padding of ui-grid-cell-contents is 5px.
                    // TODO: Better way to get padding height?
                    var topBottomPadding = 5;
                    //Get the wrapped contents rowHeight.
                    var rowHeight = topBottomPadding + parentContainer.offsetHeight;
                    var gridRowHeight = scope.grid.options.rowHeight;
                    // Get current rowHeight
                    if (!gridRowHeight ||
                        (gridRowHeight && gridRowHeight < rowHeight)) {
                        // This will OVERRIDE the existing rowHeight.
                        scope.grid.options.rowHeight = rowHeight;
                    }
                }, 0);
            }
        };
    }])

.controller('HomeCtrl', function($scope, $http, uiGridConstants) {

    $scope.gridOptions = {
        enableVerticalScrollbar: 2,
        enableHorizontalScrollbar: 2,
        enableSorting: true,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
        },
        columnDefs: [
            { name: 'ID', field: 'ID', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'App Name', field: 'AppName', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'App Version', field: 'AppVersion', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'App Description', field: 'AppDesc', width: "200", enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'Machine Name', field: 'AdditionalParameters["Machine Name"]', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: '.Net Version', field: 'AdditionalParameters["Net Version"]', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'Service Account', field: 'AdditionalParameters["User"]', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'App URL', field: 'AppURL', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader, cellTemplate: '<div style="padding: 5px;"><a href="{{row.entity.AppURL}}" target="_blank">App Link</a></div>' },
            { name: 'Delete', field: 'id', width: "150", cellTemplate: '<div id="{{row.entity.ID}}_buttonDiv"> <button ng-click="grid.appScope.deleteSystem(row.entity.ID, row.entity.AppName)" class="btn gridbutton" id="deleteButton"> Delete </button> <button ng-click="grid.appScope.pingSystem(row.entity.AppName, row.entity.AppURL)" class="btn gridbutton" id="deleteButton"> Ping </button></div>' }
        ]
    };

    $scope.Load = function(){
        $http({
                method: "get",
                url: "http://localhost/elasticfacade/api/appinfo/appinfo/appinfo",
                headers: {
                    'content-type': 'application/json'
                }
            })
            .success(function(data) {
                $scope.gridOptions.data = data;          
            });
    };

    $scope.deleteSystem = function(id, AppName){

         $http({
            method: "DELETE",
            url: "http://localhost/elasticfacade/api/appinfo/appinfo/appinfo/" + id,
            headers: {
                'content-type': 'application/json'
            }
        })
        .success(function(data, returnval) {
            $scope.Load();
        });
    };

    $scope.pingSystem = function(AppName, AppURL){
        var changeSet = {
	        AppName : AppURL
        };

        $http({
            method: "post",
            url: "http://localhost/elasticfacade/api/HealthCheck",
            headers: {
                'content-type': 'application/json'
            },
            data: changeSet
        })
        .success(function(data, returnval) {
            $scope.Load();
        });
    }

    $scope.Load();
});