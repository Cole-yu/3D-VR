var renderer,scene,camera,light,mesh;
var fov=50,aspect=16/9;near=5,far=50;//透视投影照相机参数
var stats;//性能监控面板,fps
var deg=0,camX=5,camY=15,camZ=20;//照相机位置参数
var controls;//用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放

//鼠标滑轮-鼠标上下滑轮实现放大缩小效果
function mousewheel(e) {
    e.preventDefault();     //阻止默认事件
    //e.stopPropagation();  //停止事件传播
    

    if (e.wheelDelta) {     //判断浏览器IE，谷歌滑轮事件
        if (e.wheelDelta > 0) { //当滑轮向上滚动时
            fov -= (near < fov ? 1 : 0);
        }
        if (e.wheelDelta < 0) { //当滑轮向下滚动时
            fov += (fov < far ? 1 : 0);
        }
    } else if (e.detail) {  //Firefox滑轮事件
        if (e.detail > 0) { //当滑轮向上滚动时
            fov -= 1;
        }
        if (e.detail < 0) { //当滑轮向下滚动时
            fov += 1;
        }
    }
    console.log('camera.fov:'+camera.fov);
    //改变fov值，并更新场景的渲染
    camera.fov = fov;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);

	//Z轴坐标不变，在x与y形成的平面上以z轴（0,0,20）为中心，半径为15的圆运动
	// if (e.wheelDelta) {     //判断浏览器IE，谷歌滑轮事件
    //    if (e.wheelDelta > 0) {
	// 	    if(deg<360){
	// 			deg++;		
	// 		}
	// 		else{
	// 			deg=0;
	// 		}
	// 	}
	// }
	// console.log(deg);

	// camX=15*Math.sin(deg*Math.PI/180);
	// camY=15*Math.cos(deg*Math.PI/180);
	// console.log(camX,camY);

	// camera.position.x=camX;
	// camera.position.y=camY;
	// camera.updateProjectionMatrix();
	// renderer.render(scene,camera);
}


function mains(){
	//创建渲染器
	var canvasContainer = document.getElementById("mainCanvas");
	// canvasContainer.addEventListener("mousewheel", mousewheel, false);
	var width = canvasContainer.clientWidth;    //获取画布的宽
	var height = canvasContainer.clientHeight;  //获取画布的高
	renderer = new THREE.WebGLRenderer({
	  antialias: true,  //抗锯齿开
	});
	renderer.setSize(width, height);  //设置渲染器的宽和高
	renderer.setClearColor(0x000000); //设置渲染器的背景颜色为黑色
	var canvas = renderer.domElement; //获取渲染器的画布元素
	canvasContainer.appendChild(canvas); //将画布写入html元素中

	//添加性能面板
	stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

	//创建场景
	scene = new THREE.Scene();

	//创建正投影照相机
	//camera = new THREE.OrthographicCamera(-6, 6, 4.5, -4.5, 0, 50); //创建照相机
	//创建透视投影(观察视角)
	camera=new THREE.PerspectiveCamera(fov,aspect,near,far);
	// camera.position.set(15, 15, 20);  //设置照相机的位置
	camera.position.x = camX;
	camera.position.y = camY;
	camera.position.z = camZ;
	camera.lookAt(new THREE.Vector3(0, 0, 0)); //设置照相机面向(0,0,0)坐标观察


	//创建点光源
	light = new THREE.PointLight(0x00ff00, 1, 100);  //创建光源
	light.position.set(15, 15, 35);  //设置光源的位置

	//版本一：基础方式创建物体
	// var geometry=new THREE.SphereGeometry(5);      //创建球体形状
	// var material = new THREE.MeshLambertMaterial({
	//     color: "yellow",     //设置颜色为yellow
	// });
	// mesh = new THREE.Mesh(geometry,material);

	//版本二：加载模型，load在chrome浏览器中会出错： Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https.
// A begin 
    var loader = new THREE.VTKLoader();
    loader.load("asset/bunny1.vtk", function ( geometry ) {//加载时才会触发mesh，因此在动画时，因为不加在，所以mesh会undefined
    	//模型的法向量有问题，更新一下法向量
    	geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        //创建纹理，材质
    	var material = new THREE.MeshLambertMaterial({ color:0xffffff, side: THREE.DoubleSide } );
    	//创建模型
    	mesh = new THREE.Mesh( geometry, material ); 
        // mesh.position.setY( - 0.09 );   //位置
        mesh.rotation.y +=0.01;
        mesh.scale.set(30, 30, 30);		//缩放大小
        scene.add( mesh );
    });
// A end
	
   //版本三，使用ColladaLoader加载另一个模型文件类型ade
   //  var loader = new THREE.ColladaLoader();
   //  loader.load( "./asset/avatar.dae", function ( collada ){
   //      //找到模型中需要的对象。将相机看向这个对象是为了让这个对象显示在屏幕中心
   //      collada.scene.traverse( function( child ){
   //       	if( child instanceof THREE.SkinnedMesh ){
   //          	modelObj = child;
   //          	camera.lookAt( child.position );
   //       	}
   //    	});
   //    	//将模型的场景加入到整体的场景
   //     	modelObj.material.opacity = 0.8;
   //    	scene.add( collada.scene );
   // });


	//设置控制器
	controls = new THREE.OrbitControls( camera, renderer.domElement );
    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //controls.dampingFactor = 0.25;
    //是否可以缩放
    controls.enableZoom = true;
    //是否自动旋转
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    //设置相机距离原点的最远距离
    controls.minDistance  = 1;
    //设置相机距离原点的最远距离
    controls.maxDistance  = 200;
    //是否开启右键拖拽
    controls.enablePan = true;


	// 网格的边长是1000，分成1000等分，每个小网格的边长是1
    var helper = new THREE.GridHelper(1000,1000,0xFF0000,0x808080);

    
    scene.add( helper );//添加辅助线
	scene.add(light);//把光源和物体加入到场景中
	// scene.add(mesh);//添加实体
}


function start(){
	mains();
	animation();//第一次执行动画
}


// 帧循环、游戏循环
function animation(){	
	// var ran=Math.random(0,1);
	// if(ran>=0&&ran<0.4){
	// 	mesh.rotateX(0.01);
	// }
	// if(ran>=0.4&&ran<0.7){
	// 	mesh.rotateY(0.01);	
	// }
	// if(ran>=0.7&&ran<=1){
	// 	mesh.rotateZ(0.01);
	// }
	//mesh.rotateX(0.015);

	// camera.position.x =camera.position.x +0.01;
	// mesh.position.x-=0.01;
	stats.begin();
	renderer.render(scene, camera);//将场景及照相机渲染出来
	stats.end();
	controls.update();
	requestAnimationFrame(animation);
}

//函数执行入口
start();