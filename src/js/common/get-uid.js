define(function(){
	var getUid = function(fn){
		var uid = window.localStorage.getItem('uid') || '';
		
		if(!uid){
			mui.ajax('/users/api/addUser',{
				data:{
					nick_name:''
				},
				type:'post',
				dataType:'json',
				success:function(res){
					if(res.code === 1){
						window.localStorage.setItem('uid',res.uid);
						fn(res.uid)
					}else{
						alert("服务器错误");
					}
				},
				error:function(error){
					alert("服务器错误");
				}
			})
		}else{
			fn(uid)
		}
	}
	
	return getUid
})