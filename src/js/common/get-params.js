define(function(){
	var url = location.search;
	
	if(url.indexOf('?') != -1){
		url = url.substr(1);  //type=12&age=13
	}
	var bArr = url.split('&'); //[type=12,age=13]
	
	var target = {};
	
	bArr.forEach(function(item){
		var sArr = item.split('=');
		
		target[sArr[0]] = sArr[1]; //{type:12,age:13}
	})
	
	return target
})