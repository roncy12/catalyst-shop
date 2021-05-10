import async from 'async';
import $ from 'jquery';
import Dropzone from './global/dropzone';
import Prevnext from './global/prevnext';
import DynamicSnippets from './dynamicContent/components/DynamicSnippets';

export default class PageManager {
    constructor(context) {
        this.context = context;
    }

    before(next) {
		
		
		
		/* move and hide elements */
		this.dropzone = new Dropzone;
		
		/* load DynamicContent */
		(new DynamicSnippets(this.context)).loadSnippets(function(){
			this.dropzone.grMoveHtmlToDropzones();
			//console.log('after snippet');
		});
		
		
		this.dropzone.grMoveHtmlToDropzones();
		//console.log($('#PrevNext-Data-on').length);
		if($('#PrevNext-Data-on').length > 0){
			this.prevnext = new Prevnext;
			this.prevnext.PrevNextData(this.context.prevnextParam);
		}
		/* move and hide elements */
		
		/*remove Serial Number*/
		// this.serialNRemover();		
		
        next();
    }

	serialNRemover(){
		var _ClassIds = ['title', '.card-title a', '.productView-title' , '.breadcrumb-label', '.previewCartItem-name a', '.cart-item-name a'];
		
		var _i;
        for (_i = 0; _i < _ClassIds.length; ++_i) {
			$(_ClassIds[_i]).each(function(){
				$(this).html($(this).html().replace(/  *\[(.*?)\] */g, ""));
			});
		}
		
		//console.log('Serial Removed');
	}


    loaded(next) {
        next();
    }

    after(next) {
        next();
    }

    type() {
        return this.constructor.name;
    }

    load() {
        async.series([
            this.before.bind(this), // Executed first after constructor()
            this.loaded.bind(this), // Main module logic
            this.after.bind(this), // Clean up method that can be overridden for cleanup.
        ], (err) => {
            if (err) {
                throw new Error(err);
            }
        });
    }
}
