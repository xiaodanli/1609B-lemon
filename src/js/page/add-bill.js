require(['../js/config.js'],function(){
	require(['mui','dom','getUid','format','picker','dtpicker'],function(mui,dom,getUid,format){
		
		function init(){
			mui.init();
			
			//添加点击事件
			addEvent();
			
			//加载分类数据
			loadClassify();
			
			//初始化时间
			initDate();
		}
		
		var curYear = new Date().getFullYear(),
				curMonth = new Date().getMonth()+1,
				curDay = new Date().getDate(),
				dtpicker = null,
				_time = dom('.time');
				_time.innerHTML = curYear+'-'+curMonth+'-'+curDay;
				
		
		function initDate(){
				dtPicker = new mui.DtPicker({type:'date'});
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
		
		var type="支出",
				targetObj = {};  //格式化分类
		//渲染分类
		function renderClassify(data){
			  
			
			/**
			 * {
				   "支出":[{},{},{}],
				   "收入":[{},{},{}]
				}
			 * 
			 */
			
			data.forEach(function(item){
				if(!targetObj[item.type]){
					targetObj[item.type] = [];  //targetObj = {支出：[],收入:[]}
				}
				targetObj[item.type].push(item);
			})
			
			console.log(targetObj)
			
			renderTypeC(targetObj[type]);
			
		}
		
		//按收支类型渲染分类
		function renderTypeC(data){
			data = data.slice(0);
			var target = format(8,data); 
			
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
			
			var firstDl = Array.from(sliderItems[0].querySelectorAll('dl'))[0];
			firstDl.classList.add('active');
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
			var slider = mui('.mui-slider').slider();
			slider.gotoItem(0,0); //第一个索引  第二个是时间
		}
		
		function renderItem(data){
			return data.map(function(item){
				return `
					<dl data-id="${item.cid}">
						<dt>
							<span class="${item.c_icon}"></span>
						</dt>
						<dd>${item.c_name}</dd>
					</dl>
				`
			}).join('');
			
			
		}
		
		//添加账单
		function addBill(){
			var cid = dom('.mui-slider-group').querySelector('.active').getAttribute('data-id'),
					timer = _time.innerHTML,
					money = dom('.money').innerHTML;
			getUid(function(uid){
				mui.ajax('/bill/api/addBill',{
					type:'post',
					dataType:'json',
					data:{
						uid:uid,
						cid:cid,
						timer:timer,
						money:money
					},
					success:function(res){
						console.log(res)
						if(res.code === 1){
							dom('.money').innerHTML = '0.00';
							location.href="../../index.html";
						}else{
							alert("服务器错误");
						}
					},
					error:function(error){
						console.log(error);
					}
				})
			})
			
		}
		
		//添加点击事件
		function addEvent(){
			//点击选择时间
			_time.addEventListener('tap',function(){
				dtPicker.show(function (selectItems) { 
					_time.innerHTML = selectItems.text;
						console.log(selectItems);//{text: "2016",value: 2016} 
				})
			})
			
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
				}else if(val === '完成'){
					//添加账单
					addBill();
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
			
			//点击收支类型
			mui('.tab-list').on('tap','span',function(){
				var spans = Array.from(dom('.tab-list').querySelectorAll('span'));
				for(var i=0;i<spans.length;i++){
					spans[i].classList.remove('active');
				}
				this.classList.add('active');
				type = this.innerHTML;
				renderTypeC(targetObj[type]);
			})
			
			//点击分类
			mui('.mui-slider-group').on('tap','dl',function(){
				var dls = Array.from(dom('.mui-slider-group').querySelectorAll('dl'));
				for(var i=0;i<dls.length;i++){
					dls[i].classList.remove('active');
				}
				this.classList.add('active');
			})
		}
		
		init();
	})
})