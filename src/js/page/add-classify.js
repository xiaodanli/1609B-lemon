require(['../js/config.js'],function(){
	require(['mui','dom','getUid','getParams'],function(mui,dom,getUid,getParams){
		
		function init(){
			mui.init();
			
			//加载分类数据
			loadCdata();
			
			//添加点击事件
			addEvent();
		}
		
		//加载分类数据
		function loadCdata(){
			mui.ajax('/classify/api/iconlist',{
				dataType:'json',
				success:function(res){
					console.log(res);
					if(res.code === 1){
						//渲染分类图标
						renderIconList(res.data);
					}
				}
			})
		}
		
		//渲染分类图标
		function renderIconList(data){  
			//[{},{},{}]   [[{},{}],[{},{}]]
			
			var len = Math.ceil(data.length/8); //1
			
			var target = [];
			
			for(var i = 0; i<len;i++){
				target.push(data.splice(0,8))
			};
			
			var iconStr = '';
			
			target.forEach(function(item){
				iconStr += `
					<div class="mui-slider-item">
						<ul class="icon-list">`
				iconStr += renderDl(item);			
				iconStr += `</ul></div>`;
			})
			
			dom('.mui-slider-group').innerHTML = iconStr;
			
			mui('.mui-slider').slider();
		
		}
		
		//渲染dl
		function renderDl(data){
			return data.map(function(item){
				return `
					<li>
						<span class="${item.icon_name}"></span>
					</li>	
				`
			}).join('')
		}
		
		//添加点击事件
		function addEvent(){
			//点击保存  uid  c_name type c_icon
			dom('.save-btn').addEventListener('tap',function(){
				var c_icon = dom('#target-icon').className,
					c_name = dom('.c-ipt').value,
					type = decodeURI(getParams.type);
					
				
				if(!c_name){
					alert("分类名为空");
				}else{
					getUid(function(uid){
						mui.ajax('/classify/api/addClassify',{
							type:'post',
							data:{
								uid:uid,
								type:type,
								c_name:c_name,
								c_icon:c_icon
							},
							success:function(res){
								console.log(res);
								if(res.code === 1){
									location.href="../../page/add-bill.html";
								}else{
									alert("服务器错误");
								}
							},
							error:function(error){
								console.log(error)
							}
						})
					})
				}
			})
			
			//点击图标
			mui('.icon-wrap').on('tap','span',function(){
				dom('#target-icon').className = this.className;
			})
		}
		
		init();
	})
})