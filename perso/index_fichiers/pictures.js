Cs.prototype.pictures = function()
{
	var self = this;
	return new CsPictures({_parent: self});
}

function CsPictures(options){
	this._parent = options._parent;
	return this;
}

CsPictures.prototype.picturesUploader = function(containerId, options)
{
	if(!options){
		options = {};
	}
	var self = this;
	options._parent = self;
	return new CsPicturesPicturesUploader(containerId, options);
}

/*-----------------------------------------------------------------------------------------
		AJAX UPLOADER - ORKS IN PAIR WITH UPLOADIFY PLUGIN (/PLUGINS/UPLOADIFY)
------------------------------------------------------------------------------------------*/
function CsPicturesPicturesUploader(containerId, options){
	this._parent = options._parent;
	this.options = {};
	this.options.url = options.url || this._parent._parent.options.site_url + 'account/pictures/ajax_picture_upload';
	this.options.progressBarId = options.progressBarId || 'csUploadProgressBar';
	this.options.progressBarWidth = options.progressBarWidth || 452;
	this.options.progressBarHeight = options.progressBarHeight || 20;
	this.options.thumbsContainerId = options.thumbsContainerId || 'csUploadedFileThumbs';
	this.options.progressBarContainerId = options.progressBarContainerId || 'csUploaderProgressBar';
	
	this.container = $('#' + containerId);
	this.container.addClass('cs-picture-uploader');
	this.thumbsContainer = $('#' + this.options.thumbsContainerId);
	this.thumbsContainer.addClass("cs-thumbs");
	this.uploadedThumbs = [];
	this.uploadedImages = [];
	this.tempProfilePic = {};
	
	this.buildProgressBar();
	this.bytesTotal = 0;
}
CsPicturesPicturesUploader.prototype.buildProgressBar = function(){
	this.progressBarContainer = $('#' + this.options.progressBarContainerId);
	this.progressBarContainer.addClass('cs-progress-bar');

	this.progressBarContainer.width(this.options.progressBarWidth);
	this.progressBarContainer.html();
	this.progressBarLineContainer = $('<div/>', {
		'class' : 'cs-progress-bar-line'
	}).appendTo(this.progressBarContainer);
	this.progressBarLineContainer.css('height', this.options.progressBarHeight + 'px');
	this.progressBarLineContainer.css('width', '10px');
	
}
CsPicturesPicturesUploader.prototype.displayUploadedThumb = function(params){
	var newThumb = $('<img/>', {
		src: this._parent._parent.options.site_url + params.path + "/" + params.imageId + "_" + params.size + "." + params.type,
		'class' : 'cs-thumb',
		border: '0'
	}).appendTo(this.thumbsContainer);
	this.uploadedThumbs.push(newThumb);
}
CsPicturesPicturesUploader.prototype.addUploadedImage = function(params){
	image = {};
	image.imageId = params.imageId;
	image.type = params.type;
	image.path = params.path;
	this.uploadedImages.push(image);
}
CsPicturesPicturesUploader.prototype.getUploadedImages = function(){
	return this.uploadedImages;
}
CsPicturesPicturesUploader.prototype.getUploadedThumbs = function(){
	return this.uploadedThumbs;
}
CsPicturesPicturesUploader.prototype.changeProfilePicture = function(actorId, callback){
	if(!actorId){
		return false;
	}
	if(!this.tempProfilePic){
		return false;
	}
	$.post("/account/pictures/ajax-set-profile-picture", {
		actor_id: actorId, 
		image_id: this.tempProfilePic.imageId
	}, function(response){
		callback(response);
	}, "json");
}
CsPicturesPicturesUploader.prototype.changeProfileThumb = function(imgId, params){
	var nr = imgId.match(/\d/g);
	if(nr) {
		// QUICKFIX: Show the uploaded image on first upload
		nr = nr.join('');
		$('#csEditPic_' + nr).removeClass('add-picture');
	}
	$('#' + imgId).attr("src", this._parent._parent.options.resource_url + params.path + "/" + params.imageId + "_" + params.size + "." + params.type);
	$('#' + imgId).show();
	return;
}
CsPicturesPicturesUploader.prototype.setBytesTotal = function(total){
	this.bytesTotal = total;
}
CsPicturesPicturesUploader.prototype.resizeProgressLine = function(current){
	if(this.bytesTotal){
		var current_width = (current * this.options.progressBarWidth)/this.bytesTotal;
		this.progressBarLineContainer.animate({width: current_width}, 'fast');
	}
}
CsPicturesPicturesUploader.prototype.resizeProgressLineByPx = function(px){
	this.progressBarLineContainer.animate({width: px}, 'fast');
}
CsPicturesPicturesUploader.prototype.zeroProgressLine = function(){
	this.progressBarLineContainer.width(2);
}
CsPicturesPicturesUploader.prototype.deleteAllTempPics = function(callback){
	$.post('/account/pictures/ajax-delete-temp-images', {}, function(response){
		callback(response);
	},"json");
}


