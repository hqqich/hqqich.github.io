+++
author = "hqqich"
title = "快速上手 Three.js：从 0 到 1 构建 3D 可视化项目"
date = "2025-03-05"
description = "Guide to emoji usage in Hugo"
tags = [
    "three.js",
]
+++


### 一、为什么选择 Three.js？

Three.js 是基于 WebGL 的轻量级 3D 引擎，无需复杂的数学计算即可实现：

* 3D 模型渲染
* 动画与交互
* 物理引擎集成
* 高性能可视化

**对比原生 WebGL**：Three.js 封装了 90% 以上的底层代码，开发效率提升 80%！

### 二、[环境搭建](https://so.csdn.net/so/search?q=%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA&spm=1001.2101.3001.7020)

**方案一：**

```javascript
<!-- 引入Three.js最新版 -->
<script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>
<!-- 引入辅助工具 -->
<script src="https://unpkg.com/three@0.158.0/examples/js/controls/OrbitControls.js"></script>
<script src="https://unpkg.com/three@0.158.0/examples/js/libs/stats.min.js"></script>


```

**注意：Three.js 在较新的版本中对模块的引入方式进行了调整，直接通过`<script>`标签引入的加载方式可能会出现问题。**

**方案二：在项目中使用**

1.  **安装Three.js**
    
```javascript
`npm install three`
```
    
2.  **引入Three.js库**
    
```javascript
// 引入 Three.js 核心库
import * as THREE from 'three';
// 引入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// 引入性能监控工具
import Stats from 'three/examples/jsm/libs/stats.module.js';

```
    

**核心三要素**：

```javascript
// 场景
const scene = new THREE.Scene();
// 相机（透视投影）
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

```

### 三、核心组件详解（含[性能优化](https://so.csdn.net/so/search?q=%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96&spm=1001.2101.3001.7020)）

#### 1\. 几何体

```javascript
// 基础几何体
const geometry = new THREE.BoxGeometry(); // 立方体
const geometry = new THREE.SphereGeometry(5, 32, 32); // 球体
 
// 复杂几何体
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
const loader = new OBJLoader();
loader.load('model.obj', function(object) {
  scene.add(object);
});

```

#### 2\. 材质

**性能优化方案**：

```javascript
// 使用MeshStandardMaterial替代MeshPhongMaterial
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.5,
  roughness: 0.3
});
 
// 实例化材质池（适用于大规模场景）
const materialPool = new THREE.InstancedMesh(geometry, material, 1000);
```

#### 3\. 灯光

```javascript
// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
 
// 平行光（模拟太阳光）
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 10);
```

### 四、动画与交互实现

#### 1\. 基础动画

```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // 旋转动画
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}
animate();
```

#### 2\. 鼠标交互

```javascript
// 射线检测
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
 
document.addEventListener('mousemove', function(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
 
function onMouseClick(event) {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0xff0000);
  }
}
```

### 五、性能优化指南（提升 50% 渲染效率）

1.  **减少 Draw Call**：
    
```javascript
// 使用InstancedMesh替代多次add()
const instancedMesh = new THREE.InstancedMesh(geometry, material, 1000);
scene.add(instancedMesh);

```
    
2.  **层级优化**：
    
```javascript
// 合并静态模型
import { BufferGeometryUtils } from 'three/addons/utils/BufferGeometryUtils.js';
const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
```
    
3.  **材质缓存**：
    
```javascript
const materialCache = new Map();
function getMaterial(type) {
  if (!materialCache.has(type)) {
    materialCache.set(type, new THREE.MeshStandardMaterial({ ... }));
  }
  return materialCache.get(type);
}
```
    

### 六、常见问题解决方案

#### 1\. 模型加载异常

```javascript
// 加载进度监听
loader.load('model.obj', function(object) {
  scene.add(object);
}, function(xhr) {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, function(error) {
  console.error('加载失败:', error);
});
```

#### 2\. 内存泄漏检测

```javascript
// 使用Stats.js监控性能
const stats = new Stats();
document.body.appendChild(stats.dom);
 
function updateStats() {
  stats.begin();
  // 渲染逻辑
  stats.end();
  requestAnimationFrame(updateStats);
}
```

**完整代码**

```html
<!DOCTYPE html>
<html lang="en">
 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three.js Quick Start</title>
    <!-- 引入Three.js最新版 -->
    <script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>
    <!-- 引入辅助工具 -->
    <script src="https://unpkg.com/three@0.158.0/examples/js/controls/OrbitControls.js"></script>
    <script src="https://unpkg.com/three@0.158.0/examples/js/libs/stats.min.js"></script>
</head>
 
<body>
    <script>
        // 场景
        const scene = new THREE.Scene();
 
        // 相机（透视投影）
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
 
        // 渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
 
        // 几何体
        const geometry = new THREE.BoxGeometry();
 
        // 材质
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            metalness: 0.5,
            roughness: 0.3
        });
 
        // 网格对象
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
 
        // 灯光
        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
 
        // 平行光（模拟太阳光）
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 10);
        scene.add(directionalLight);
 
        // 轨道控制器
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
 
        // 性能监控
        const stats = new Stats();
        document.body.appendChild(stats.dom);
 
        // 射线检测
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
 
        document.addEventListener('mousemove', function (event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
 
        document.addEventListener('click', function (event) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                intersects[0].object.material.color.set(0xff0000);
            }
        });
 
        // 动画函数
        function animate() {
            requestAnimationFrame(animate);
 
            // 旋转动画
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
 
            renderer.render(scene, camera);
            stats.update();
        }
 
        animate();
 
    </script>
</body>
 
</html>

```

### 七、实战项目推荐

1.  **3D 产品展示**：使用 GLB 格式模型 + 轨道控制器
2.  **数据可视化**：通过 BufferGeometry 生成自定义几何体
3.  **虚拟现实**：配合 WebVR 插件实现沉浸式体验

### 八、学习资源推荐

* [官方文档](https://threejs.org/docs/ "官方文档")
* [示例库](https://threejs.org/examples/ "示例库")
* [社区论坛](https://discourse.threejs.org/ "社区论坛")
