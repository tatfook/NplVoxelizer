var nplvoxelizer = angular.module('nplvoxelizer_app', ['ui.bootstrap']);
nplvoxelizer.component("nplvoxelizer", {
    templateUrl: "/wp-content/pages/nplvoxelizer/templates/NplVoxelizerTemplate.html",
    controller: function ($scope, $http, $log) {
        

        if (Page)
            Page.ShowSideBar(false);
        
    }
})













