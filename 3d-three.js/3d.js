var renderer,scene,camera,light,cube;
var fov=50,aspect=16/9;near=5,far=50;//透视投影照相机参数
var stats;//性能监控面板,fps
var deg=0,camX=0,camY=15,camZ=20;//照相机位置参数

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
	canvasContainer.addEventListener("mousewheel", mousewheel, false);
	var width = canvasContainer.clientWidth;    //获取画布的宽
	var height = canvasContainer.clientHeight;  //获取画布的高
	renderer = new THREE.WebGLRenderer({
	  antialias: true  //抗锯齿开
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
	//创建透视投影
	camera=new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.set(0, 15, 20);  //设置照相机的位置
	camera.position.x = camX;
	camera.position.y = camY;
	camera.position.z = camZ;
	camera.lookAt(new THREE.Vector3(0, 0, 0)); //设置照相机面向(0,0,0)坐标观察


	//创建点光源
	light = new THREE.PointLight(0x00ff00, 1, 100);  //创建光源
	light.position.set(0, 15, 35);  //设置光源的位置

	//创建物体
	// var geometry = new THREE.BoxGeometry (5, 5, 5);//创建形状
	var geometry=new THREE.SphereGeometry(5);

	var material = new THREE.MeshLambertMaterial({
	    color: "yellow",     //设置颜色为yellow
	});

	// var material = new THREE.MeshPhongMaterial({
	//  color: "yellow" //设置颜色为yellow
	// });
	cube = new THREE.Mesh(geometry,material);


	// 网格的边长是1000，分成1000等分，每个小网格的边长是1
    var helper = new THREE.GridHelper(1000,1000,0xFF0000,0x808080);

    
    scene.add( helper );//添加辅助线
	
	scene.add(light);//把光源和物体加入到场景中
	scene.add(cube);//添加实体
}


function start(){
	mains();
	animation();//第一次执行动画
}


// 帧循环、游戏循环
function animation()
{	
	// var ran=Math.random(0,1);
	// if(ran>=0&&ran<0.4){
	// 	cube.rotateX(0.01);
	// }
	// if(ran>=0.4&&ran<0.7){
	// 	cube.rotateY(0.01);	
	// }
	// if(ran>=0.7&&ran<=1){
	// 	cube.rotateZ(0.01);
	// }
	//cube.rotateX(0.015);

	// camera.position.x =camera.position.x +0.01;
	// cube.position.x-=0.01;
	stats.begin();
	cube.rotation.y +=0.01;
	renderer.render(scene, camera);//将场景及照相机渲染出来
	stats.end();
	requestAnimationFrame(animation);
}

//函数执行入口
start();