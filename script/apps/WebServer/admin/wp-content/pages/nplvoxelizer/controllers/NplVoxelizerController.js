var nplvoxelizer = angular.module('nplvoxelizer_app', ['ui.bootstrap']);
nplvoxelizer.component("nplvoxelizer", {
    templateUrl: "/wp-content/pages/nplvoxelizer/templates/NplVoxelizerTemplate.html",
    controller: function ($scope, $http, $log) {
        

        if (Page)
            Page.ShowSideBar(false);

        function arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }
        function base64ToArrayBuffer(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
        $scope.uploadFile = function (files) {
            var reader = new FileReader();
            reader.onload = function () {
                var arrayBuffer = reader.result;

                var data = arrayBufferToBase64(arrayBuffer)
                console.log(data);
                $http.get("ajax/nplvoxelizer?action=nplvoxelizer_upload&data=" + data).then(function (response) {
                    console.log("CreateNewProject response value:", response.data[0])
                });
            };
            reader.readAsArrayBuffer(files[0]);
        }
    }
})













