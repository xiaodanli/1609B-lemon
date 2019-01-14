require(['./js/config.js'], function() {
	require(['mui', 'dom', 'echarts','getUid', 'moment','picker', 'poppicker', 'dtpicker'], function(mui, dom, echarts,getUid,moment) {
		function init() {
			mui.init();

			dom('.mui-inner-wrap').addEventListener('drag', function(event) {
				event.stopPropagation();
			});

			//初始化滚动
			initScroll();

			//初始化时间
			initDate();

			//点击事件
			addEvent();

			//初始化图表
			initTable();
			
			//加载账单
			loadBill();
			
			//查询分类
			loadClassify();

		}
		
		
		//查询分类
		function loadClassify(){
			getUid(function(uid){
				mui.ajax('/classify/api/getClassify',{
					dataType:'json',
					data:{
						uid:uid
					},
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
		
		function renderClassify(data){
			var obj = {};
			
			data.forEach(function(item){
				if(!obj[item.type]){
					obj[item.type] = [];
				}
				obj[item.type].push(item);
			})
			console.log(obj);
			
			dom('.pay-c').innerHTML = renderC(obj['支出']);
			
			dom('.com-c').innerHTML = renderC(obj['收入']);
		}
		
		function renderC(data){
			return data.map(function(item){
				return `<li>${item.c_name}</li>`
			}).join('')
		}
		
		//加载账单
		function loadBill(classify){
			var time_type = status === 'month' ? 2 : 1,
				timer = _selectDate.innerHTML,
				classify = classify || '';
				
			getUid(function(uid){
				mui.ajax('/bill/api/getBill',{
					dataType:'json',
					data:{
						time_type:time_type,
						timer:timer,
						uid:uid,
						classify:classify
					},
					success:function(res){
						console.log(res);
						if(res.code === 1){
							if(status === 'month'){
								//渲染月的账单
								renderMonthBill(res.data);
							}else{
								//渲染年的账单
								renderYearBill(res.data);
							}
						}
					},
					error:function(error){
						console.warn(error)
					}
				})
			})
		}

		var totalMonthPay = 0, //每月总共花费
			totalMonthCom = 0; //每月总共收入
			
			_payWrap = dom('.pay-wrap'),
			_comingWrap = dom('.coming-wrap');
			
		//渲染月的账单
		function renderMonthBill(data){
			/**
			 * 	var obj = {
					 "12-10":{
						 "date":"12-10",
						 totalPay:,
						 list:[]
					 },
					 "12-11":{
					 	"date":"12-10",
					 	totalPay:,
					 	list:[]
					 },
					 "12-12":{
						 "date":"12-10",
						 totalPay:,
						 list:[]
					}
				}
				
				var arr = [];
				for(var i in obj){
					arr.push(obj[i])
				}
				
				[{},{},{}]
			 * 
			 */
			
			var monthObj = {},
				mTarget = [];
			
			data.forEach(function(item){
				var timer = moment(item.timer).format('MM-DD');
				if(!monthObj[timer]){
					monthObj[timer] = {
						timer:timer,
						totalPay:0,
						list:[]
					}
				}
				monthObj[timer].list.push(item);
				
				
				if(item.type === '支出'){
					monthObj[timer].totalPay += item.money*1;
					totalMonthPay += item.money*1;
				}else{
					totalMonthCom += item.money*1;
				}
			})
			
			console.log(totalMonthPay);
			console.log(totalMonthCom);
			
			_payWrap.innerHTML = `本月花费：<span>${totalMonthPay}</span>`;
			_comingWrap.innerHTML = `本月收入：<span>${totalMonthCom}</span>`;
			
			for(var i in monthObj){
				mTarget.push(monthObj[i]);
			}
			
			var mStr = '';
			
			mTarget.forEach(function(item){
				mStr += `
					<div class="day-item">
						<div class="day-title">
							<div>
								<span class="mui-icon mui-icon-bars"></span>
								<span>${item.timer}</span>
							</div>
							<div>
								<span>花费</span>
								<span class="day-money">${item.totalPay}</span>		
							</div>
						</div>
						<ul class="mui-table-view">`
				mStr+= renderLi(item.list);			
				mStr+=		`</ul>
					</div>
				`
			})
			dom('.month-wrap').innerHTML = mStr;
			
		}
		
		//渲染年的账单
		function renderYearBill(data){
			var yearObj = {},
				mTarget = [];
			
			data.forEach(function(item){
				var timer = moment(item.timer).format('MM');
				if(!yearObj[timer]){
					yearObj[timer] = {
						timer:timer,
						totalPay:0,
						totalCom:0,
						list:[]
					}
				}
				yearObj[timer].list.push(item);
				
				
				if(item.type === '支出'){
					yearObj[timer].totalPay += item.money*1;
				}else{
					yearObj[timer].totalCom += item.money*1;
				}
			})
			
			var yTarget = [];
			
			for(var i in yearObj){
				yTarget.push(yearObj[i]);
			}
			
			var yStr = '';
			
			yTarget.forEach(function(item){
				yStr += `
					<div class="month-item">
						<ul class="mui-table-view">
							<li class="mui-table-view-cell mui-collapse">
								<a class="mui-navigate-right" href="#">
									<ol class="m-title">
										<li>
											<span class="mui-icon mui-icon-bars"></span>
											<span>${item.timer}</span>
										</li>
										<li class="red">
											<span>花费</span>
											<span>${item.totalPay}</span>
										</li>
										<li class="green">
											<span>收入</span>
											<span>${item.totalCom}</span>
										</li>
										<li class="gray">
											<span>结余</span>
											<span>${item.totalCom-item.totalPay}</span>
										</li>
									</ol>
								</a>
								<div class="mui-collapse-content">
									<ul class="mui-table-view">`
				yStr += renderLi(item.list);						
				yStr +=					`</ul>
								</div>
							</li>
						</ul>
					</div>
				`;
				dom('.year-wrap').innerHTML = yStr;
			})
			
			
			
			//花费：10  收入：8   -2
			
			//花费：10  收入：15   5
			
			//花费：20  收入：23   结余：3
			
			
		}
		
		function renderLi(data){
			return data.map(function(item){
				return `
					<li class="mui-table-view-cell">
						<div class="mui-slider-right mui-disabled">
							<a class="mui-btn mui-btn-red" data-lid="${item.lid}" data-type="${item.type}" data-money="${item.money}">删除</a>
						</div>
						<div class="mui-slider-handle">
							<dl>
								<dt>
									<span class="${item.c_icon}"></span>
								</dt>
								<dd>${item.c_name}</dd>
							</dl>
							<span class="${item.type === '支出'?'red':'green'}">${item.money}</span>
						</div>
					</li>
				`
			}).join('')
		}
		
		//初始化图表

		function initTable() {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));

			// 指定图表的配置项和数据
			var option = {
				series: [

					{
						name: '访问来源',
						type: 'pie',
						radius: ['40%', '55%'],
						data: [{
								value: 335,
								name: '直达'
							},
							{
								value: 310,
								name: '邮件营销'
							},
							{
								value: 234,
								name: '联盟广告'
							},
							{
								value: 135,
								name: '视频广告'
							},
							{
								value: 1048,
								name: '百度'
							},
							{
								value: 251,
								name: '谷歌'
							},
							{
								value: 147,
								name: '必应'
							},
							{
								value: 102,
								name: '其他'
							}
						]
					}
				]
			};

			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);
		}

		var picker = null,
			dtPicker = null,
			curYear = new Date().getFullYear(),
			curMonth = new Date().getMonth() + 1,
			_selectDate = dom('.select-date'),
			status = 'month',
			_monthWrap = dom('.month-wrap'),
			_yearWrap = dom('.year-wrap');

		//初始化时间
		function initDate() {
			picker = new mui.PopPicker();
			picker.setData([{
				value: 'month',
				text: '月'
			}, {
				value: 'year',
				text: '年'
			}]);

			dtPicker = new mui.DtPicker({
				type: 'month'
			});

			console.log(curMonth)
			if(curMonth < 10){
				curMonth = '0'+curMonth;
			}
			_selectDate.innerHTML = curYear + '-' + curMonth;

		}


		//添加点击事件
		function addEvent() {
			//点击年月
			dom('.select-type').addEventListener('tap', function() {
				var that = this;
				picker.show(function(selectItems) {
					that.innerHTML = selectItems[0].text;
					console.log(selectItems[0].text); //年/月
					console.log(selectItems[0].value); //year/month

					status = selectItems[0].value;

					if (status === 'month') {
						_selectDate.innerHTML = curYear + '-' + curMonth;
						dom('h5[data-id="title-m"]').style.display = "inline-block";
						dom('h5[data-id="title-y"]').style.width = "50%";

						dom('.mui-picker[data-id="picker-m"]').style.display = "block";
						dom('.mui-picker[data-id="picker-y"]').style.width = "50%";
						_monthWrap.style.display = "block";
						_yearWrap.style.display = "none";
					} else {
						_selectDate.innerHTML = curYear;

						dom('h5[data-id="title-m"]').style.display = "none";
						dom('h5[data-id="title-y"]').style.width = "100%";

						dom('.mui-picker[data-id="picker-m"]').style.display = "none";
						dom('.mui-picker[data-id="picker-y"]').style.width = "100%";
						_monthWrap.style.display = "none";
						_yearWrap.style.display = "block";
					}
					//加载账单
					loadBill();
				})
			})

			//选择日期
			dom('.select-date').addEventListener('tap', function() {
				dtPicker.show(function(selectItems) {
					console.log(selectItems.y); //{text: "2016",value: 2016} 
					console.log(selectItems.m); //{text: "05",value: "05"} 

					curYear = selectItems.y.text;
					curMonth = selectItems.m.text;
					if (status === 'month') {
						_selectDate.innerHTML = curYear + '-' + curMonth;
					} else {
						_selectDate.innerHTML = curYear;
					}
					//加载账单
					loadBill();
				})
			})

			//打开侧边栏
			dom('.open-aside').addEventListener('tap', function() {
				mui('.mui-off-canvas-wrap').offCanvas('show');
			})

			//关闭侧边栏
			dom('.close-aside').addEventListener('tap', function() {
				mui('.mui-off-canvas-wrap').offCanvas('close');
			})

			var _billWrap = dom('.bill-wrap'),
				_tableWrap = dom('.table-wrap');

			//点击tab
			
			var _tabSpans = Array.from(dom('.tab-list').querySelectorAll('span'));
			mui('.tab-list').on('tap', 'span', function() {
				var id = this.getAttribute('data-id');
				for(var i = 0; i< _tabSpans.length;i++){
					_tabSpans[i].classList.remove('active');
				}
				this.classList.add('active');
				if (id == 0) {
					_billWrap.style.display = 'block';
					_tableWrap.style.display = 'none';
				} else {
					_billWrap.style.display = 'none';
					_tableWrap.style.display = 'block';
				}
			})
			
			//去添加账单界面
			dom('.go-bill').addEventListener('tap',function(){
				location.href="../../page/add-bill.html";
			})
		
			//点击全部收入和全部支出
			mui('.type').on('tap','li',function(){
				var id = this.getAttribute('data-id');
				var classifyEles = document.querySelectorAll('.classify');
				var lis = classifyEles[id].querySelectorAll('li');
				
				if(this.className.indexOf('active') != -1){
					this.classList.remove('active');
					for(var i = 0;i<lis.length;i++){
						lis[i].classList.remove('active');
					}
				}else{
					this.classList.add('active');
					for(var i = 0;i<lis.length;i++){
						lis[i].classList.add('active');
					}
				}
				console.log(this.className);
				
				var activeLis = dom('.all-c').querySelectorAll('.active');
				
				var classifyArr = [];
				
				for(var i=0;i<activeLis.length;i++){
					classifyArr.push(activeLis[i].innerHTML);
				}
				
				loadBill(classifyArr);
			})
			
			//点击分类
			mui('.all-c').on('tap','li',function(){
				var id = this.parentNode.getAttribute('data-id');
				
				var targetLi = dom('.type').querySelectorAll('li')[id];  //全部收入  全部支出
			
				if(this.className.indexOf('active') != -1){
					this.classList.remove('active');
				}else{
					this.classList.add('active');	
				}
				
				var activeLis = this.parentNode.querySelectorAll('.active');
				
				var lis = this.parentNode.querySelectorAll('li');
				
				if(activeLis.length === lis.length){
					targetLi.classList.add('active');
				}else{
					targetLi.classList.remove('active');
				}
				
				var classifyArr = [];
				
				var allActiveLis = dom('.all-c').querySelectorAll('.active');
				
				for(var i=0;i<allActiveLis.length;i++){
					classifyArr.push(allActiveLis[i].innerHTML);
				}
				
				loadBill(classifyArr);
				
			})
			
			//点击删除
			mui('.bill-wrap').on('tap', '.mui-btn', function(event) {
				var elem = this;
				var li = elem.parentNode.parentNode;
				
				var lid = this.getAttribute('data-lid'),
					money = this.getAttribute('data-money'),
					type = this.getAttribute('data-type');
					
				var btnArray = ['确认', '取消'];
				mui.confirm('确认删除该条记录？', '提示', btnArray, function(e) {
					if (e.index == 0) {
						
						//1.去库里删除该条记录  2.减钱  3.删除节点
						mui.ajax('/bill/api/delBill',{
							data:{
								lid:lid
							},
							dataType:'json',
							success:function(res){
								console.log(res);
								if(res.code === 1){
									if(status === 'month'){
										var targetItem = li.parentNode.parentNode;
										var moneyEl = targetItem.querySelector('.day-money');
										if(type === '支出'){
											totalMonthPay -= money*1;
											_payWrap.innerHTML = totalMonthPay;
											moneyEl.innerHTML -= money*1;
										}else{
											totalMonthCom -= money*1;
											_comingWrap.innerHTML = totalMonthCom;
										}
										if(li.parentNode.children.length > 1){
											li.parentNode.removeChild(li);
										}else{
											dom('.month-wrap').removeChild(targetItem);
										}
										
									}
								}
							}
						})
						
						
						// li.parentNode.removeChild(li);
					} else {
						setTimeout(function() {
							mui.swipeoutClose(li);
						}, 0);
					}
				});
			});
		}

		//初始化滚动
		function initScroll() {
			//内容滚动
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		}

		init(); //初始
	})
})
