Cs.prototype.feeds = function()
{
	var self = this;
	return new CsFeeds({_parent: self});
}

function CsFeeds(options){
	this._parent = options._parent;
	return this;
}

CsFeeds.prototype.itemsList = function(options)
{
	if(!options){
		options = {};
	}
	var self = this;
	options._parent = self;
	return new CsFeedsItemsList(options);
}

/*-----------------------------------------------------------------------------------------
		POSTS LIST (USED WHERE ANY FEED LISTED)
------------------------------------------------------------------------------------------*/
function CsFeedsItemsList(options){
	this._parent = options._parent;
	this.options = {};
	this.options = options;
	this.items = {};

}
CsFeedsItemsList.prototype.addItem = function(itemId, itemContainerId, options){
	if(!options){
		options = {};
	}
	
	var self = this;
	options._parent = self;
	options.itemId = itemId;
	
	this.items[itemId] = new CsFeedsItemsListItem(itemContainerId, options);
	
	return this.items[itemId];
}
CsFeedsItemsList.prototype.getItem = function(itemId){
	return this.items[itemId];
}

/*-----------------------------------------------------------------------------------------
		ITEM
------------------------------------------------------------------------------------------*/
function CsFeedsItemsListItem(itemContainerId, options){
	this._parent = options._parent;
	this.options = options;

	this.container = $('#' + itemContainerId);
	this.commentsBlock = this._parent._parent._parent.getCommentsBlock(this.options.itemId, 'feed'); //used cs.commentsBlock object
	var self = this;
	if(this._parent.options.defaultTextareaText){
		this.commentsBlock.options.defaultTextareaText = this._parent.options.defaultTextareaText;
		this.commentsBlock.textareaContainer.val(this._parent.options.defaultTextareaText);
	}
}
CsFeedsItemsListItem.prototype.pauseVideo = function(itemContainerId) {
    $(itemContainerId.find('iframe[src*="https://www.youtube.com/embed/"]')).each(function(i) {
        var func = 'pauseVideo';
        this.contentWindow.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
    });
}
CsFeedsItemsListItem.prototype.commentButtonClick = function(){
	var commentsZone = this.container.find('.csItemComments');
    var commentText = this.container.find('.comment-button span.change-action');
    var fullPost = this.container.find('.post-expanded');
    var excerptPost = this.container.find('.post-excerpt');
	if(commentsZone.css('display') == 'none'){
        this.pauseVideo(excerptPost);
		commentsZone.show();
        commentText.text('Hide');
        fullPost.show();
//		if (commentText.hasClass('no-comments')) {
//            this.container.find('.csCommentsTextarea').focus();
//            //this.commentsBlock.textareaContainer.focus();
//        }
        excerptPost.hide();
	}
	else{
        this.pauseVideo(fullPost);
		commentsZone.hide();
        commentText.text('Expand');
        fullPost.hide();
        excerptPost.show();
	}
}
CsFeedsItemsListItem.prototype.commentButtonClick2 = function(hide_text, expand_text){
	var commentsZone = this.container.find('.csItemComments');
    var commentText = this.container.find('.csItemCommentsShowHide');
    var commentsCountPlace = this.container.find('.csItemCommentsCount');
    var fullPost = this.container.find('.post-expanded');
    var excerptPost = this.container.find('.post-excerpt');
	if(commentsZone.css('display') == 'none'){
        this.pauseVideo(excerptPost);
		commentsZone.show();
        commentText.text(hide_text);
        commentsCountPlace.addClass('comments-count-arrow');
        fullPost.show();
//		if (commentText.hasClass('no-comments')) {
//            this.container.find('.csCommentsTextarea').focus();
//            //this.commentsBlock.textareaContainer.focus();
//        }
        excerptPost.hide();
	}
	else{
        this.pauseVideo(fullPost);
		commentsZone.hide();
        commentText.text(expand_text);
        commentsCountPlace.removeClass('comments-count-arrow');
        fullPost.hide();
        excerptPost.show();
	}
}
CsFeedsItemsListItem.prototype.forceExpand = function(hide_text, expand_text){
    var commentsZone = this.container.find('.csItemComments');
    var commentText = this.container.find('.csItemCommentsShowHide');
    var commentsCountPlace = this.container.find('.csItemCommentsCount');
    var fullPost = this.container.find('.post-expanded');
    var excerptPost = this.container.find('.post-excerpt');
    this.pauseVideo(excerptPost);
    commentsZone.show();
    commentText.text(hide_text);
    commentsCountPlace.addClass('comments-count-arrow');
    fullPost.show();
    excerptPost.hide();
}
CsFeedsItemsListItem.prototype.mediaButtonClick = function(){
	var mediaZone = this.container.find('.block-hide');
    var linkText = this.container.find('.media-button');
    console.log(mediaZone.length);
	if(mediaZone.css('display') == 'none'){
		mediaZone.show();
        linkText.text('Hide Media');
	}
	else{
        linkText.text('Show Media');
		mediaZone.hide();
	}
}
CsFeedsItemsListItem.prototype.hideDisabledPost = function(response){
	var self = this;

	if(response){
		if(response.status == "ok"){
			this.container.fadeOut("fast", function(){
				self.container.remove();
				csMods.reload({name: 'updates'});
			});
		}
	}
}
CsFeedsItemsListItem.prototype.disablePost = function(){
	var self = this;
	post = {};
	post.item_id = this.options.itemId;
	$.post(this._parent._parent._parent.options.site_url + "account/feeds/ajax-delete-item", post, function(response){
		self.hideDisabledPost(response);
	},"json");
}
CsFeedsItemsListItem.prototype.changePublicType = function(type, text, icon){
	this.container.find('.csFeedItemPublicTypeSwitchText').text(text);
	this.container.find('.csFeedItemPublicTypeSwitch').removeClass('public-button');
	this.container.find('.csFeedItemPublicTypeSwitch').removeClass('private-button');
	this.container.find('.csFeedItemPublicTypeSwitchIcon').removeClass('private-icon');
	this.container.find('.csFeedItemPublicTypeSwitchIcon').removeClass('public-icon');
	if(type == "all" || type == "core"){
		this.container.find('.csFeedItemPublicTypeSwitch').addClass('private-button');
		this.container.find('.csFeedItemPublicTypeSwitchIcon').addClass('private-icon');
	}
	else{
		this.container.find('.csFeedItemPublicTypeSwitch').addClass('public-button');
		this.container.find('.csFeedItemPublicTypeSwitchIcon').addClass('public-icon');
	}
	this.setPublicType(type);
}
CsFeedsItemsListItem.prototype.setPublicType = function(type){
	var self = this;
	post = {};
	post.item_id = this.options.itemId;
	post.public_type = type;
	$.post(this._parent._parent._parent.options.site_url + "account/feeds/ajax-set-item-public-type", post, function(response){
		
	},"json");
}
CsFeedsItemsListItem.prototype.playVideo = function(url, id, options){
	if(!options){
		options = {};
	}
    if (!id)
        id = '';
	var params = {
		width: options.width || 394,
		height: options.height || 221
	}
	if(url){
        var remove = '.' + id + ' .csVidePreviewContainer';
        var id = '.' + id + ' .csVideEmbedContainer';
        console.log(this.container.find(id).attr('class'));
		this.container.find(remove).remove();
		this.container.find(id).html('');
		$('<iframe/>',{
			width: params.width,
			height: params.height,
			src: url,
			frameborder: '0',
			allowfullscreen: true
		}).appendTo(this.container.find(id));
		this.container.find(id).css("width", params.width + 'px');
		this.container.find(id).css("height", params.height + 'px');
		this.container.find(id).css("overflow", 'hidden');
	}
}
CsFeedsItemsListItem.prototype.playVideoSmall = function(url, id, options){
	if(!options){
		options = {};
	}
	var params = {
		width: options.width || 200,
		height: options.height || 150
	}
	if(url){
		this.container.find('.'+id).html('');
		$('<iframe/>',{
			width: params.width,
			height: params.height,
			src: url,
			frameborder: '0',
			allowfullscreen: true
		}).appendTo(this.container.find('.'+id));
		this.container.find('.'+id).css("width", params.width + 'px');
		this.container.find('.'+id).css("height", params.height + 'px');
		this.container.find('.'+id).css("overflow", 'hidden');
	}
}
CsFeedsItemsListItem.prototype.showHideConfirm = function() {
    var self = this;
    
    cs.components().confirm({
        title: 'Confirm',
        text: 'Do you really want to delete this',
        buttons: [
            {
                text: 'Yes',
                color: 'green', 
                onClick: function() {
                    csItemsList.getItem(self.options.itemId).disablePost();
                    csPopup.close();
                }
            },
            {
                text: 'No',
                color: 'grey',
                onClick: function() {
                    csPopup.close();
                }
            }
        ]
    });
}

CsFeedsItemsListItem.prototype.addVoteEvent = function(){
	var elem = this.container.find('a.voting');
	var count = elem.find('span.count');
	
	count.text( parseInt( count.text() ) + 1 );
	elem.addClass('voted');
}

CsFeedsItemsListItem.prototype.removeVoteEvent = function(){
	var elem = this.container.find('a.voting');
	var count = elem.find('span.count');
	
	count.text( parseInt( count.text() ) - 1 );
	elem.removeClass('voted');
}

CsFeedsItemsListItem.prototype.updateVoters = function(voters_str){
	var elem = this.container.find('.voters');	
	elem.html(voters_str);
	cs.components().listTips(elem.find('a.voters_list'), {});
}

CsFeedsItemsListItem.prototype.voteButtonClick = function(){
	var self = this;
	
	var voted = this.container.find('a.voting').hasClass('voted');
	
	var site_url = this._parent._parent._parent.options.site_url;
	var item_id = this.options.itemId;
	var action =  voted ? 'remove-vote' : 'add-vote';
	
	$.get(site_url + 'items/post/' + item_id + '/' + action, function(response) {
		
        try { var responseObj = jQuery.parseJSON(response); }
        catch(e) { var responseObj = false; }
		
		if(responseObj) {
			if('undefined' != typeof(responseObj.status)) {
				if('ok' == responseObj.status) {
					if( ! voted )
						self.addVoteEvent();
					else
						self.removeVoteEvent();
				    
				    if ('undefined' != typeof responseObj.data) {
				        if ('undefined' != typeof responseObj.data.voters_str) {
				            self.updateVoters(responseObj.data.voters_str);
				        }
				    }
					return true;
				}
			}
		}
		
		csPopup.display(response, { html: true });
	});
}