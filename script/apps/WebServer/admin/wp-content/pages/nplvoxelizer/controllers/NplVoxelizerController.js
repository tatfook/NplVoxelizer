var nplvoxelizer = angular.module('nplvoxelizer_app', ['ui.bootstrap', "rzModule"]);
nplvoxelizer.component("nplvoxelizer", {
    templateUrl: "/wp-content/pages/nplvoxelizer/templates/NplVoxelizerTemplate.html",
    controller: function ($scope, $http, $log) {

        if (Page)
            Page.ShowSideBar(false);
        $('#mask').hide();

        var view_container = document.getElementById('view_container');
        var container, stats;
        var camera, scene, renderer;
        var controls, transformControl;
        var meshes = [];
        init_threejs();
        animate();
        function init_threejs() {
            container = document.createElement('div');
            container.style["position"] = "relative";
            container.style["width"] = "100%";
            container.style["height"] = "560px";
            $("#view_container").append(container);
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
            camera.position.set(10, 5, 10);
            camera.lookAt(new THREE.Vector3());
            scene.add(camera);

            // light
            scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
            addShadowedLight(1, 1, 1, 0xffffff, 1.35);
            addShadowedLight(0.5, 1, -1, 0xffaa00, 1);

            var helper = new THREE.GridHelper(30, 1);
            helper.material.opacity = 0.25;
            helper.material.transparent = true;
            scene.add(helper);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setClearColor(0xf0f0f0);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.gammaInput = true;
            renderer.gammaOutput = true;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.renderReverseSided = false;
            container.appendChild(renderer.domElement);

            // Controls
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.damping = 0.2;
            controls.addEventListener('change', render);

            transformControl = new THREE.TransformControls(camera, renderer.domElement);
            transformControl.addEventListener('change', render);

            scene.add(transformControl);
            window.addEventListener('resize', onWindowResize, false);
            onWindowResize();
        }
        function onWindowResize() {

            var w = container.offsetWidth;
            var h = container.offsetHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            renderer.setSize(w, h);

        }
        function animate() {

            requestAnimationFrame(animate);
            render();
            controls.update();
            transformControl.update();

            if (!$scope.is_loading) {
                if ($scope.slider && $scope.slider.value) {
                    if ($scope.last_slider_value != $scope.slider.value) {
                        $scope.last_slider_value = $scope.slider.value;
                        voxelizer()
                    }
                }
            }
        }

        function render() {
            renderer.render(scene, camera);
        }
        function addShadowedLight(x, y, z, color, intensity) {

            var directionalLight = new THREE.DirectionalLight(color, intensity);
            directionalLight.position.set(x, y, z);
            scene.add(directionalLight);

            directionalLight.castShadow = true;

            var d = 1;
            directionalLight.shadow.camera.left = -d;
            directionalLight.shadow.camera.right = d;
            directionalLight.shadow.camera.top = d;
            directionalLight.shadow.camera.bottom = -d;

            directionalLight.shadow.camera.near = 1;
            directionalLight.shadow.camera.far = 4;

            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;

            directionalLight.shadow.bias = -0.005;

        }

        $scope.input_content = "";
        $scope.input_format = "stl";
        $scope.output_format = "stl";
        $scope.output_content = "";
        $scope.file_name = "";
        $scope.last_slider_value = -1;
        $scope.is_loading = false;
        $scope.slider = {
            value: 8,
            options: {
                floor: 1,
                ceil: 12,
                step: 1
            }
        };
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
                $scope.input_content = arrayBufferToBase64(arrayBuffer)

                $scope.last_slider_value = -1;
                $scope.output_content = null;

                clearMeshes();
            };
            reader.readAsArrayBuffer(files[0]);
        }
        $scope.voxelizer = function (callback) {
            $http.get("ajax/nplvoxelizer?action=nplvoxelizer_voxelizer&data=" + $scope.input_content
                    + "&block_length=" + $scope.slider.value
                    + "&input_format=" + $scope.input_format
                    + "&output_format=" + $scope.output_format).then(function (response) {
                        var content = response.data[0];
                        console.log("CreateNewProject response value:")
                        if (content) {
                            $scope.output_content = window.atob(content);
                            if (callback) {
                                callback();
                            }
                        }
                    });
        }
        function removeObject(object) {
            if (object.parent === null) return;
            object.parent.remove(object);
        }
        function clearMeshes() {
            for (var i = 0; i < meshes.length; i++) {
                removeObject(meshes[i]);
            }
            meshes.splice(0, meshes.length);
        }
        function voxelizer() {
            if (!$scope.input_content) {
                return
            }
            $scope.is_loading = true;
            $('#mask').show();
            $scope.voxelizer(function () {
                $('#mask').hide();
                clearMeshes();
                var loader = new THREE.STLLoader();
                var geometry = loader.parse($scope.output_content);
                aStlGeometry = geometry;
                var material = new THREE.MeshBasicMaterial({ color: 0xff0000, vertexColors: THREE.VertexColors });
                var mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
                meshes.push(mesh);
                $scope.is_loading = false;

                if (callback) {
                    callback();
                }
            })
        }
            function onSave() {
            if ($scope.output_content && $scope.file_name) {
                var blob = new Blob([$scope.output_content], { type: 'text/plain' });
                saveAs(blob, $scope.file_name + '.' + $scope.output_format);
            }
        }
        $scope.downloadFile = function () {
            if (!$scope.file_name) {
                alert("请输入文件名！");
                return
            }
            if ($scope.output_content) {
                $('#mask').show();
                onSave();
                $('#mask').hide();
                return
            } else{
                $scope.preview(function () {
                    onSave();
                })
            }
            
            
        }
    }
})













