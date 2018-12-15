define(function(){
	var format = function(num,data){
		var len = Math.ceil(data.length/num); //1
		
		var target = [];
		
		for(var i = 0; i<len;i++){
			target.push(data.splice(0,num))
		};
		return target
	}
	
	return format
})