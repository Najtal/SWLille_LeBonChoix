Cs.prototype.tags = function()
{
	var self = this;
	return new CsTag({_parent: self});
}

function CsTag(options){
	this._parent = options._parent;
	return this;
}

CsTag.prototype.tagObject = function(options)
{
	if(!options){
		options = {};
	}
	var self = this;
	options._parent = self;
	return new CsTags(options);
}

function CsTags(options){
	this._parent = options._parent;
	this.options = {};
	this.options.from_actor_id = options.from_actor_id;
	this.options.to_actor_id = options.to_actor_id;
	this.options.type_actor_id = options.type_actor_id;
	this.options.object_id = options.object_id;
}

CsTags.prototype.saveTags = function (tagItems){
	var postObj = {};
	var Obj = cs.algorithms();	
	postObj.from_actor_id = this.options.from_actor_id;
	postObj.to_actor_id = this.options.to_actor_id;
	postObj.type = this.options.type || "evaluation";
	postObj.type_actor_id = this.options.type_actor_id;
	postObj.object_id = this.options.object_id;
//	var tags = csTagsApplicationField.getValues();
	var tags = tagItems;

	var tagg = new Array();
	for (var i = 0; i < tags.length; i++) {
		tagg[i+1] = new Array();
		tagg[i+1].id = tags[i][0] || ' ';
		tagg[i+1].value = tags[i][1] || ' ';
		tagg[i+1].key = tags[i][2]|| ' ';
	//Do something
	}

	postObj.tags = tagg;
	var self = this;
	
	$.post(this._parent._parent.options.site_url + "account/accelerators/add_applications_tags", Obj.objectToPost(postObj), function(response) {
		// Done
	});
}
CsTags.prototype.setToActorId = function(to_actor_id){
	this.options.to_actor_id = to_actor_id;
}
CsTags.prototype.removeTags = function(tag_id){
	var postObj = {};
	var Obj = cs.algorithms();	
	postObj.from_actor_id = this.options.from_actor_id;
	postObj.to_actor_id = this.options.to_actor_id;
	postObj.type = this.options.type || "evaluation";
	postObj.type_actor_id = this.options.type_actor_id || false;
	
	
	if(!tag_id)	return false;
	
	postObj.tag_id = tag_id ;
	var self = this;
	
	
	$.post(this._parent._parent.options.site_url + "account/accelerators/remove_applications_tags", Obj.objectToPost(postObj), function(response) {
		if(response){
			if(response.status == 'ok'){
				
				$('#actor_'+self.options.to_actor_id+'_'+tag_id).remove();
			}		
		}
		// Done
	},"json");

}