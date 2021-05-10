import $ from 'jquery';
import { hooks, api } from '@bigcommerce/stencil-utils';

export default class Prevnext {
	PrevNextData(prevnextParam){
		var _site_key = "";
		
		const url = location.href.split('?')[0];
		var start_time = new Date().getTime();

		jQuery.ajax({ url: url+'?limit=100&ajaxLocalStorage=Yes', 
				success: function(content) { 

					var _ajax_prevnext_id = jQuery('<div />').append(jQuery("#ajaxLocalStorage_prevnext_id", content)).text();
					var _ajax_prevnext_url = jQuery('<div />').append(jQuery("#ajaxLocalStorage_prevnext_url", content)).text();

					if(_ajax_prevnext_id && _ajax_prevnext_url){
								var _tmpPID = JSON.parse(_ajax_prevnext_id);
								var _tmpPURL = JSON.parse(_ajax_prevnext_url)
								var _itemList = {};
							
								for (var i = 0; i < _tmpPID.length; i++)
								_itemList[_tmpPID[i]] = { 	'prev': { 'id' : _tmpPID[i-1], 'url' : _tmpPURL[i-1] },
																	'next': { 'id' : _tmpPID[i+1], 'url' : _tmpPURL[i+1] }	
																};
								localStorage.setItem(_site_key+'prevnext_'+prevnextParam,JSON.stringify(_itemList));
								var request_time = new Date().getTime() - start_time;
								console.log('update pnd success - '+request_time +" - " + prevnextParam);
					}	
				}
			});  
				
		/*
		// stencil utils
		api.getPage(url+'?limit=99999&ajaxLocalStorage=Yes','',(err, content) => {
					console.log('processing');
					if (err) {
						throw new Error(err);
					}
					
					console.log(content);
					
					var _ajax_prevnext_id = jQuery('<div />').append(jQuery("#ajaxLocalStorage_prevnext_id", content)).text();
					var _ajax_prevnext_url = jQuery('<div />').append(jQuery("#ajaxLocalStorage_prevnext_url", content)).text();
					// console.log(JSON.parse(_ajax_prevnext_id));
					// console.log(JSON.parse(_ajax_prevnext_url));
					
					if(_ajax_prevnext_id && _ajax_prevnext_url){
								var _tmpPID = JSON.parse(_ajax_prevnext_id);
								// console.log(_tmpPID);
								var _tmpPURL = JSON.parse(_ajax_prevnext_url)
								// console.log(_tmpPURL);
								var _itemList = {};
							
								for (var i = 0; i < _tmpPID.length; i++)
								_itemList[_tmpPID[i]] = { 	'prev': { 'id' : _tmpPID[i-1], 'url' : _tmpPURL[i-1] },
																	'next': { 'id' : _tmpPID[i+1], 'url' : _tmpPURL[i+1] }	
																};
								localStorage.setItem(_site_key+'prevnext_'+prevnextParam,JSON.stringify(_itemList));
								// console.log(localStorage.getItem(_site_key+'prevnext_'+prevnextParam));
								var request_time = new Date().getTime() - start_time;
								console.log('updated dropzone - '+request_time +" - " + prevnextParam);
					}	
				});
		*/		
	}	
}	
