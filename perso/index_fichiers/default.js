var csPopup = {};
var csSlidePanel = {};
var csMods = cs.mods({});
$(function(){
	csSlidePanel = cs.components().slidePanel({});
	cs.onDocumentLoad();
});
function line(){
	console.log('<br/>');
	console.log('-------------------------------------------------------------------');
	console.log('<br/>');
}
function br(){
	console.log('<br/>');
}

function log(text){
	if(console) {
        console.log(text);
    }

}
function post(url, params, urlEncoded, newWindow) {

    var form = $('<form />').hide();
    form.attr('action', url)
        .attr('method', 'POST')
        .attr('enctype', urlEncoded ? 'application/x-www-form-urlencoded' : 'multipart/form-data');
    if(newWindow) form.attr('target', '_blank');

    function addParam(name, value, parent) {
        var fullname = (parent.length > 0 ? (parent + '[' + name + ']') : name);
        if(value instanceof Object) {
            for(var i in value) {
                addParam(i, value[i], fullname);
            }
        }
        else $('<input type="hidden" />').attr({name: fullname, value: value}).appendTo(form);
    };

    addParam('', params, '');

    $('body').append(form);
    form.submit();
}

// Show general login popup
function displayLoginPopup(obj) {
	var message = 'generic_welcome';
	if('non-auth-follow-button' == obj.attr('id')) message = 'simple_follow';
	var popup_url = cs.options.site_url + 'main/authorization/login?popup=true&display_message='+message;
		
	if('undefined' != typeof(using_custom_header) && true == using_custom_header) {
		if(-1 == popup_url.indexOf('include_scripts')) {
			popup_url += '&include_scripts=true';
		}
	}
	
	if('undefined' != typeof(obj)) {
		if('undefined' != obj.attr('data-link') && '' != $.trim(obj.attr('data-link'))) {
			var redirect_url = $.trim(obj.attr('data-link'));
			if(/(https?:\/\/[^\s^"^\)]+)/gi.test(redirect_url)) {
				// URL
				popup_url += '&return_url=' + encodeURIComponent(redirect_url);
			}
		}
	}

	csPopup.display(popup_url, {
			postObject:'',
			onTop:true,
			hideCross: true
	});
}

Object.keys = Object.keys || (function () {
	var hasOwnProperty = Object.prototype.hasOwnProperty,
		hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
		DontEnums = [ 
			'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty',
			'isPrototypeOf', 'propertyIsEnumerable', 'constructor'
		],
		DontEnumsLength = DontEnums.length;

	return function (o) {
		if (typeof o != "object" && typeof o != "function" || o === null)
			throw new TypeError("Object.keys called on a non-object");

		var result = [];
		for (var name in o) {
			if (hasOwnProperty.call(o, name))
				result.push(name);
		}

		if (hasDontEnumBug) {
			for (var i = 0; i < DontEnumsLength; i++) {
				if (hasOwnProperty.call(o, DontEnums[i]))
					result.push(DontEnums[i]);
			}   
		}

		return result;
	};
})();

//TITLE QTIP
$(document).ready(function() 
{
	$('#bottom.bottom-expanding .copyright').mouseover(function(){
		$('#bottom #bottom-menu-hid').show();
	}).mouseout(function(){
		$('#bottom #bottom-menu-hid').hide();
	});
	$('#bottom.bottom-expanding #bottom-menu-hid .middle').mouseover(function(){
		$('#bottom #bottom-menu-hid').show();
	}).mouseout(function(){
		$('#bottom #bottom-menu-hid').hide();
	});
	

	cs.components().hovercards('data-hovercard', {});
	cs.components().titleTips(false, {});
	cs.components().hiddenTips(false, {});
	cs.link('a[data-hash]', {});

    cs.gaTracking();
});

// custom window.onPushState function for csPager listener 
// this is handy function that knows when pushState was fired
// since there is no default window.onpushstate we created our own
(function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        return pushState.apply(history, arguments);
    }
})(window.history);


// Display a Popup with a list of people
function peoplePopup(item_id, item_type) {
    var opt = {};
    opt.postObject = {};
    opt.requestMethod = 'post';
    opt.postObject['item_id'] = item_id;
    opt.postObject['item_type'] = item_type;
    opt.width = 450;
    
    csPopup.display(cs.options.site_url + 'items/main/popup-voters', opt);
}
