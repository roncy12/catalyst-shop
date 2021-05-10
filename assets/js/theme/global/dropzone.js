import $ from 'jquery';

export default class Dropzone {

	// Dynamic Element Position
	grMoveHtmlToDropzones() {
        // console.log('PageManager.gr_moveHtmlToDropzones: start');
        $('.gr-dropzone').each(function moveDropzoneContent() {
            // console.log('PageManager.gr_moveHtmlToDropzones: dropzone content found');
            const $this = $(this);
            const zoneId = $this.data('gr-zone');
            // console.log(`PageManager.gr_moveHtmlToDropzones: target zone=${zoneId}`);
            if (zoneId) {
                const $zone = $(`#${zoneId}`);
                if ($zone.length > 0) {
                   // console.log(`PageManager.gr_moveHtmlToDropzones: Moving zone to dropzone #${zoneId}`);
				   if($.trim($this.html()).length > 0){
                    $zone.html($this.html());   // copy the html to where it should be
				   }
				   
                } else {
                   // console.warn(`PageManager.gr_moveHtmlToDropzones: dropzone #${zoneId} not found.`);
                }
            } else {
               // console.warn('PageManager.gr_moveHtmlToDropzones: dropzone %o has no target.', $this);
            }
            $this.remove();            // remove the html from its temporary location
        });
		$('.hide-onload').each(function(){
			$(this).removeClass('hide-onload'); // removeClass Hide on Load
		});
        // console.log('PageManager.gr_moveHtmlToDropzones: end');
    }

	// Product Show Hide Section
	showhideSection(_modal, _nonav ='' ){
		_modal = typeof _modal !== 'undefined' ? _modal : '';
		_nonav = typeof _nonav !== 'undefined' ? _nonav : '';
		_modal.find('.details-section').show();
		
		// Hide prevnext
		if(_nonav){
			_modal.find('.details-section-navigation').remove();
		}
		let _rel_label = 'ITEM';
		// whowhatwhen is Empty
		if( !$.trim(_modal.find('#gr-dropzone-product_content_whowhatwhen').html() ).length ){
			_modal.find('.details-section-whowhatwhen').hide();
			_modal.find('.details-section-customorder').hide();
			_modal.find('.details-section-smallbanner').hide();
			_rel_label = 'ITEM';
			_modal.find('.details-section-description').show();
		}else{
			_modal.find('.details-section-customorder').show();
			_modal.find('.details-section-whowhatwhen').show();
			_modal.find('.details-section-smallbanner').show();
			_rel_label = 'BOARD';
			_modal.find('.details-section-description').hide();
		}
		
		// check if description still exist after dropzone event
		if( $.trim(_modal.find('#gr-dropzone-product_content_description').html() ).length ){
			_modal.find('.details-section-description').show();
		}
		
		if ($('.productView-related-product .related-product-heading').length > 0 ){
			$('.productView-related-product .related-product-heading').find('strong').text(_rel_label);
		}
		
		// additional Info is Empty
		if( !$.trim(_modal.find('#product-attribute-specs-table').html() ).length ) {
			_modal.find('.details-section-additionalinfo').hide();
		}
	}
	
	
}	
