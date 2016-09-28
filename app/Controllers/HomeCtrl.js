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
            { name: 'ID', field: 'id', enableCellEdit: true, visible:false, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'App Name', field: 'App Name', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'App Description', field: 'AppDesc', width: "200", enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'App URL', field: 'AppURL', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader, cellTemplate: '<div style="padding: 5px;"><a href="{{row.entity.AppURL}}" target="_blank">App Link</a></div>' },
            { name: 'App Version', field: 'AppVersion', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'Security', field: 'Symbol', enableCellEdit: true, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'Host Server', field: 'AppServer', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'HeartBeat URL', field: 'AppHeartBeat', enableCellEdit: true, enableColumnMenus: false, enableFiltering: false, cellTemplate: '<div style="padding: 5px;"><a href="{{row.entity.AppHeartBeat}}" target="_blank">Heartbeat Link</a></div>' },
            { name: 'Current Status', field: 'LastStatus', enableCellEdit: true, enableColumnMenus: false, headerCellClass: $scope.highlightFilteredHeader },
            { name: 'Delete', field: 'id', width: "150", cellTemplate: '<div id="{{row.entity.id}}_buttonDiv"> <button ng-click="grid.appScope.deleteSystem(row.entity.id, row.entity.AppName)" class="btn gridbutton" id="deleteButton"> Delete </button> <button ng-click="grid.appScope.deleteSystem(row.entity.id, row.entity.AppName)" class="btn gridbutton" id="deleteButton"> Ping </button></div>' }
        ]
    };

    $scope.Load = function(){
        $http({
                method: "get",
                url: "MockData/SystemList.json",
                headers: {
                    'content-type': 'application/json'
                }
            })
            .success(function(data) {
                $scope.gridOptions.data = data.SystemList;          
            });
    };

    $scope.deleteSystem = function(id, AppName){
        var changeSet = {
	        "SystemUpdateList":[{
		        "id": id
	        }]
        };

         $http({
            method: "post",
            url: "MockData/SystemList.json",
            headers: {
                'content-type': 'application/json'
            },
            data: changeSet
        })
        .success(function(data, returnval) {
            $scope.loadData();
        });
    };

    $scope.Load();
});