$(function() {
	//初始化用户ID
	init();	  
	function init(){
		chrome.storage.sync.get("yafex_user_id", function(items) {
			$("#yf_user_id_input").val(items.yafex_user_id);
		});
		chrome.storage.sync.get("yafex_user_name", function(items) {
			$("#yf_user_name_input").val(items.yafex_user_name);
		});
	}
	
	//展示html
	document.addEventListener('DOMContentLoaded', function () {
		$("#collect_div").show();
	});
	
	
	//---------------------添加点击事件-------------开始-----
	//快速开发
	$("#rapid_development").click(function(){
		
		if(validateUserId()){
			//页面加载自动获取Id，用户名
			chrome.storage.sync.get("yafex_user_id", function(items) {
				var userId = items.yafex_user_id;
				collectCurrentUrl(userId, 10);
			});
		}
		 
	}); 
	//确认开发
	$("#confirm_development").click(function(){
		if(validateUserId()){
			chrome.storage.sync.get("yafex_user_id", function(items) {
				var userId = items.yafex_user_id;
				collectCurrentUrl(userId, 20);
			});
		}
		
	}); 
	//添加监控
	$("#add_to_monitor").click(function(){
		if(validateUserId()){
			chrome.storage.sync.get("yafex_user_id", function(items) {
				var userId = items.yafex_user_id;
				collectCurrentUrl(userId, 30);
			});
		}
		
	}); 
	//---------------------添加点击事件-------------结束-----
 
	//提交收藏之前先验证用户id是否填写
	function validateUserId(){
		if($("#yf_user_id_input").val().trim()) {
		 	var userId = $("#yf_user_id_input").val().trim();
			var userName = $("#yf_user_name_input").val().trim();

			//设置值
			chrome.storage.sync.set({"yafex_user_id":userId});
			chrome.storage.sync.set({"yafex_user_name":userName});
			return true;
		}else{
			alert('用户ID不能为空');
		   	return false;
		}
	}
	
	
	//发送收藏url请求
	function collectCurrentUrl(userId, devLevel) {
		chrome.tabs.getSelected(function(tab) {
			var currUrl = tab.url;
			 //同步请求
			var url = "http://192.168.168.54:9003/ebay/collect_url";
			 $.ajax({
                url : url,
                data:{"userId": userId, "devLevel": devLevel,"url":encodeURI(currUrl)},
                cache : false, 
                async : false,
                type : "GET",
                dataType : 'json',
                success : function (result){
                    if (result.ret == 1) {
						$("#result").html(result.msg);
					}else {
						if(result.errCode == 2) {
							$("#result").html(result.errMsg);
						}else if(result.errCode == 0){
							$("#result").html(result.errMsg);
						}
					}
                },
				error : function(result){
					$("#result").html('<font color="red">收藏失败，可能是网络原因或用户id填写不正确(用户id只能为数字)，请联系IT, 谢谢。</font>');
				}
            });
		});
	}
	
	
});