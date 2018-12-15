require(['../js/config.js'],function(){
	require(['mui','dom','getUid','format'],function(mui,dom,getUid,format){
		
		function init(){
			mui.init();
			
			//添加点击事件
			addEvent();
			
			//加载分类数据
			loadClassify();
		}
		
		
		//加载分类数据
		function loadClassify(){
			getUid(function(uid){
				mui.ajax('/classify/api/getClassify',{
					data:{
						uid:uid
					},
					dataType:'json',
					success:function(res){
						console.log(res);
						if(res.code === 1){
							//渲染分类
							renderClassify(res.data);
						}
					}
				})
			})
			
		}
		
		var type="支出";
		//渲染分类
		function renderClassify(data){
			var targetObj = {};   
			
			/**
			 * {
				   "支出":[{},{},{}],
				   "收入":[{},{},{}]
				}
			 * 
			 */
			
			data.forEach(function(item){
				if(!targetObj[item.type]){
					targetObj[item.type] = [];  //targetObj = {支出：[]}
				}
				targetObj[item.type].push(item);
			})
			
			console.log(targetObj)
			
			var target = format(8,targetObj[type]); 
			
			console.log(target);
			
			var str = '';
			
			target.forEach(function(item){
				str += `
					<div class="mui-slider-item">
						<div class="swiper">`
				str += renderItem(item);			
				str +=		`</div>
					</div>
				`
			});
			
			dom('.mui-slider-group').innerHTML = str;
			
			var sliderItems = Array.from(dom('.mui-slider-group').querySelectorAll('.mui-slider-item'));
			
			var custom = `
				<dl class="custom">
					<dt>
						<span class="mui-icon mui-icon-plus"></span>
					</dt>
					<dd>自定义</dd>
				</dl>
			`;
			
			var swiper = sliderItems[sliderItems.length-1].querySelector('.swiper');
			
			var len = Array.from(swiper.querySelectorAll('dl')).length;
			console.log(len)
			if(len == 8){
				dom('.mui-slider-group').innerHTML += `
					<div class="mui-slider-item">
						<div class="swiper">
							${custom}
						</div>
				</div>`
			}else{
				sliderItems[sliderItems.length-1].querySelector('.swiper').innerHTML += custom;
			}
			
			
			
			mui('.mui-slider').slider();
			
		}
		
		function renderItem(data){
			return data.map(function(item){
				return `
					<dl>
						<dt>
							<span class="${item.c_icon}"></span>
						</dt>
						<dd>${item.c_name}</dd>
					</dl>
				`
			}).join('');
			
			
		}
		
		
		//添加点击事件
		function addEvent(){
			//点击键盘
			var _money = dom('.money');
			mui('.keyword').on('tap','span',function(){
				var val = this.innerHTML;
				
				var moneyVal = _money.innerHTML;
				
				if(val === 'x'){
					if(moneyVal.length > 1){
						_money.innerHTML = moneyVal.slice(0,moneyVal.length-1);
					}else{
						_money.innerHTML = '0.00';
					}
					return 
				}
				
				if(moneyVal === '0.00'){
					_money.innerHTML = '';
					_money.innerHTML += val;
				}else if(moneyVal.indexOf('.') != -1 && val === '.'){
					_money.innerHTML = moneyVal;
				}else if(moneyVal.indexOf('.') != -1 && moneyVal.split('.')[1].length == 2){  //11.22
					_money.innerHTML = moneyVal;
				}else{
					_money.innerHTML += val;
				}
			})
			
			//点击分类
			mui('.mui-slider').on('tap','dl',function(){
				var text = this.className;
				if(text === 'custom'){
					location.href="../../page/add-classify.html?type="+type;
				}
			})
		}
		
		init();
	})
})