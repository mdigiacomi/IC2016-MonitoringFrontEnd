'use strict';

angular.module('LS-APPMON.Home', ['ui.grid', 'ui.grid.autoResize', 'ui.grid.exporter', 'ui.grid.pinning', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.rowEdit'])
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

.controller('HomeCtrl', function($scope, $http, uiGridConstants, $timeout) {

    $scope.gridOptions = {
        enableFiltering: true,
        enableSorting: true,
        enableGridMenu: true,
        exporterCsvFilename: 'SystemList.csv',
        enableVerticalScrollbar: 2,
        enableHorizontalScrollbar: 2,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
        },
        columnDefs: [
            { name: '', field: 'Status', width: "30", height: "39", enableFiltering: false, cellTemplate: '<div style="padding: 5px;" class="{{row.entity.AppStatus}}" >&nbsp;</div>' },            
            { name: 'ID', field: 'ID', visible: false },
            { name: 'App Name', field: 'AppName' },
            { name: 'App Version', width: "70", field: 'AppVersion' , enableFiltering: false},
            { name: 'App Description', field: 'AppDesc', width: "200", visible: false },
            { name: 'Machine Name', width: "120", field: 'AdditionalParameters["Machine Name"]' },
            { name: 'Machine OS', width: "160", field: 'AdditionalParameters["Machine OS"]' , enableFiltering: false},
            { name: '.Net Version', width: "100", field: 'AdditionalParameters["Net Version"]' },
            { name: 'Service Account', width: "90", field: 'AdditionalParameters["User"]' },
            { name: 'User Domain', width: "90", field: 'AdditionalParameters["User Domain"]' },
            { name: 'App URL', field: 'AppURL', width: "75", enableFiltering: false, cellTemplate: '<div style="padding: 5px;"><a href="{{row.entity.AppURL}}" target="_blank">App Link</a></div>' },
            { name: 'Notifications', width: "175", enableFiltering: false, enableCellEditOnFocus:true, field: 'NotificationEmail' },
            { name: 'Actions', field: 'id', width: "180", enableFiltering: false, cellTemplate: '<div id="{{row.entity.ID}}_buttonDiv"><button class="btn gridbutton">Update</button><button ng-click="grid.appScope.deleteSystem(row.entity.ID, row.entity.AppName)" class="btn gridbutton" id="deleteButton"> Delete </button> <button ng-click="grid.appScope.pingSystem(row)" class="btn gridbutton" id="deleteButton"> Ping </button></div>' }
        ]
    };

    $scope.Load = function(){
        $http({
                method: "get",
                url: "http://127.0.0.1/elasticfacade/api/appinfo/appinfo/appinfo?",
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
            url: "http://127.0.0.1/elasticfacade/api/appinfo/appinfo/appinfo/" + id,
            headers: {
                'content-type': 'application/json'
            }
        })
        .success(function(data, returnval) {
            $scope.Load();
        });
    };

    $scope.pingSystem = function(row){
        
        var changeSet = {
	        AppName : row.entity.AppName,
	        AppUrl : row.entity.AppURL
        };

        $http({
            method: "post",
            url: "http://127.0.0.1/HealthCheck/api/HealthCheck",
            headers: {
                'content-type': 'application/json'
            },
            data: changeSet
        })
        .success(function(data, returnval) {
            row.entity.AppStatus = data[0].Status;
        });
    }

    $scope.Load();

    (function tick() {
        $scope.Load();
        console.log("Reloading Table");
        $timeout(tick, 2000);
    })();

});