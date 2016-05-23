function g(selector){
			var method=selector.substr(0,1)=="."?"getElementsByClassName":"getElementById"//如果是.返回class，如果是#返回id
			return document[method](selector.substr(1));
		}

		//输出所有的海报
		var data=data;//引入了data.js，data是一个对象，里面包含了所有的信息
		function addPhotos(){
			var template=g("#wrap").innerHTML;
			var html=[];
			var nav=[];
			for(var s=0;s<data.length;s++)
			{
				var _html=template
				.replace("{{index}}",s)
				.replace("{{img}}",data[s].img)
				.replace("{{caption}}",data[s].caption)
				.replace("{{desc}}",data[s].desc)
				html.push(_html);//取出wrap里所有内容，更换已经准备好的以后放在html里面，将他们组合，就动态生成了多份
				nav.push('<span id="nav_'+s+'"  onclick="turn(g(\'#photo_'+s+'\'))" class="i">&nbsp</span>');
				
			}
			html.push('<div class="nav">'+nav.join("")+'</div>')

			g("#wrap").innerHTML=html.join("");
			rsort(random([0,data.length]));
		}	
		addPhotos();


		//计算左右分区的范围
		function range(){
			var range={
				left:{x:[],y:[]},
				right:{x:[],y:[]}
			}
			var wrap={
				w:g("#wrap").clientWidth,
				h:g("#wrap").clientHeight
			}
			var photo={
				w:g(".photo")[0].clientWidth,
				h:g(".photo")[0].clientHeight

			}
			range.left.x=[0-photo.w,wrap.w/2-photo.w/2];
			range.left.y=[0-photo.h,wrap.h];

			range.right.x=[wrap.w/2+photo.w/2,wrap.w+photo.w];
			range.right.y=[0-photo.h,wrap.h];
			return range;
		}


		//将海报排序
		function rsort(n){
			var _photo=g(".photo");
			var photos=[];
			for(var i=0;i<_photo.length;i++)
			{
				_photo[i].className=_photo[i].className.replace(/\s*photo_center\s*/," ");
				_photo[i].className=_photo[i].className.replace(/\s*photo_front\s*/," ");
				_photo[i].className=_photo[i].className.replace(/\s*photo_back\s*/," ");
				_photo[i].style.left='';
				_photo[i].style.top='';
				_photo[i].className+="photo_front"
				_photo[i].style['transform']=_photo[i].style['-webkit-transform']='rotate(360deg) scale(1.3)';
				photos.push(_photo[i]);
			}

			var photo_center=g("#photo_"+n)//隐式转换生成字符串
			photo_center.className+=" photo_center ";

			photo_center=photos.splice(n,1)[0];

			//把海报分为两个部分
			var photo_left=photos.splice(0,Math.ceil(photos.length/2));
			var photo_right=photos;
			var rangeT=range();
			for(i in photo_left)
			{
				var photoL=photo_left[i];

				photoL.style.left=random(rangeT.left.x)+"px";
				photoL.style.top=random(rangeT.left.y)+"px";

				

				photoL.style["transform"]=photoL.style["-webkit-transform"]="rotate("+random([-150,150])+"deg) scale(1)"
			}

			for(i in photo_right)
			{
				var photoR=photo_right[i];

				photoR.style.left=random(rangeT.right.x)+"px";
				photoR.style.top=random(rangeT.right.y)+"px";
				

				photoR.style["transform"]=photoR.style["-webkit-transform"]="rotate("+random([-150,150])+"deg) scale(1)"
			}

			//反转按钮处理
			var navs=g(".i")
			for(var s=0;s<navs.length;s++)
			{
				navs[s].className=navs[s].className.replace(/\s*i_current\s*/," ");
				navs[s].className=navs[s].className.replace(/\s*i_back\s*/," ");
			}
			g('#nav_'+n).className +=' i_current ';
		}


		//随机数生成函数
		function random(range){
			var max=Math.max(range[0],range[1]);
			var min=Math.min(range[0],range[1]);
			var dif=max-min;
			var number=Math.ceil(Math.random()*dif+min);
			return number;
		}

		//翻面控制
		function turn(elem){
			var cls=elem.className;
			var n=elem.id.split("_")[1];

			if(!/photo_center/.test(cls))
			{
				return rsort(n);//如果当前点击的不是中间的，就取当前的n再排序，把center赋给n，但是样式还需要清除，让他居中
			}

			if(/photo_front/.test(cls))//正则匹配，因为类名很多,test是RE的函数，如果匹配到了返回true
			{
				cls=cls.replace(/photo_front/,'photo_back')
				g("#nav_"+n).className+=" i_back ";
			}else{
				cls=cls.replace(/photo_back/,'photo_front')
				g("#nav_"+n).className=g("#nav_"+n).className.replace(/\s*i_back\s*/,"")

			}
			return elem.className=cls;
		}