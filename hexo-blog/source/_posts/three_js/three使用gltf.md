# 在Three.js中加载GLTF文件

Three.js提供了`GLTFLoader`来加载GLTF(GL Transmission Format)格式的3D模型文件。以下是完整的加载GLTF文件的步骤和代码示例：

## 基本加载方法

1. 首先，确保你已经引入了Three.js和GLTFLoader：

```html
<!-- 引入Three.js -->
<script src="https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js"></script>
<!-- 引入GLTFLoader -->
<script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js"></script>
```

2. 创建加载器并加载GLTF文件：

```javascript
// 创建场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建GLTF加载器
const loader = new THREE.GLTFLoader();

// 加载GLTF文件
loader.load(
    'path/to/your/model.gltf', // GLTF文件路径
    function (gltf) {
        // 加载完成回调函数
        const model = gltf.scene;
        scene.add(model);
        
        // 可选：调整模型位置、旋转等
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        
        // 可选：遍历模型中的所有网格并设置材质
        model.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    },
    function (xhr) {
        // 加载进度回调函数
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        // 加载错误回调函数
        console.error('An error happened', error);
    }
);

// 设置相机位置
camera.position.z = 5;

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
```

## 使用ES6模块导入方式

如果你使用的是现代JavaScript开发环境（如React、Vue或原生ES6模块）：

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 然后使用上面的加载代码
```

## 高级用法

### 1. 加载带DRACO压缩的GLTF

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

loader.load('model.glb', function(gltf) {
    scene.add(gltf.scene);
});
```

### 2. 加载后处理动画

```javascript
loader.load('model.gltf', function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    
    // 播放模型中的动画
    if (gltf.animations && gltf.animations.length) {
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(clip => {
            mixer.clipAction(clip).play();
        });
        
        // 在动画循环中更新mixer
        function animate() {
            requestAnimationFrame(animate);
            mixer.update(0.016); // 假设60fps
            renderer.render(scene, camera);
        }
        animate();
    }
});
```

### 3. 使用Promise封装

```javascript
function loadGLTF(path) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.GLTFLoader();
        loader.load(path, resolve, undefined, reject);
    });
}

// 使用
async function init() {
    try {
        const gltf = await loadGLTF('model.gltf');
        scene.add(gltf.scene);
    } catch (error) {
        console.error('Error loading model:', error);
    }
}
init();
```

## 注意事项

1. GLTF文件通常需要与相关的纹理和二进制文件(.bin)一起使用，确保这些文件在同一目录下
2. 对于生产环境，考虑使用GLB格式（二进制GLTF），它包含所有资源在一个文件中
3. 大型模型可能需要较长时间加载，始终提供加载进度反馈
4. 考虑使用Three.js的缓存机制来避免重复加载相同模型

希望这些信息对你有帮助！如果你有更具体的需求或遇到问题，可以进一步提问。