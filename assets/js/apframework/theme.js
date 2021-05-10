import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import 'jquery.countdown';
import '../../vendor/cookie/cookie.js';
import FacetedSearch from '../theme/common/faceted-search';

export default function () {
    function processAjax($element, tmpl, urlKey = 'ap-category-url', contentParent= '', show = 'show' , row ='row') {
        const template = tmpl;
        let url = $element.data(urlKey);
		let _contentParent = $element.data(contentParent);
        let show1;
        if($(window).width()>=992){
            show1 = $element.data(show);
        }
        else if($(window).width()>=768){
            show1 = 3;
        }
        else if($(window).width()>=550){
            show1 = 2;
        }
        else{
            show1 = 1;
        }
        let row1 = $element.data(row);
        url = url.replace(/https?:\/\/[^/]+/, '');
        utils.api.getPage(url, { template }, (err, response) => {
            $element.html(response);
            $( document ).ready(function() {
				$('.loader-ajax-item').hide();
				$('.navPage-custom-subMenu-action').trigger('mouseenter');
				if(_contentParent){
					$('.'+_contentParent + ' .custom-content-slides')[0].slick.refresh();
				}
            });
        });
    }
	
	// Show ProductsCategory Desktop
	let _flagDesktop = 0;
    function initAjaxProductsByCategory() {
		_flagDesktop = 1;
        $('[data-ap-category-url]').each((i, element) => {
            processAjax($(element), 'apframework/category/ajax-products-by-category-result', 'ap-category-url' ,'content-parent' , 'show', 'row');
        });
		
    }
	
	// Show Subcategories Mobile
		let _flagMobile = 0;
    function initAjaxSubcategories() {
		_flagMobile = 1;
        $('[data-ap-category-url]').each((i, element) => {
            processAjax($(element), 'apframework/category/ajax-subcategories-result', 'ap-category-url' ,'content-parent' , 'show', 'row');
        });
    }

	// Show Content
	let _flagContent = 0;
	function initContentRenderer(){
		_flagContent = 1;
		$('[data-ctm-render-content]').each((i, element) => {
            processAjax($(element), $(element).data('template-file'), 'ctm-render-content' ,'' , 'show', 'row');
        });		
		
	}	
	
	function _renderNavigation(){
		($(window).width() > 991 && _flagDesktop ==0) ? initAjaxProductsByCategory() : '';
		($(window).width() < 991 && _flagMobile ==0) ? initAjaxSubcategories() : '';
	}	
	
	function _renderContent(){
		(_flagContent == 0)?  initContentRenderer() : '';
	}	
	
	// pre-rendered 
	$(document).on(' mousemove ', function(e){
		_renderNavigation();
		_renderContent();
	});
	// pre-rendered content
	$(document).on('scroll ', function(e){
		_renderContent();
	});	
	
	// fallback-renderer
	$('.navPage-custom-Menu-action').on('mouseenter click',function() {
		_renderNavigation();
	});	
	
}

	// ------------------------------------------------------------------------
    // Facet Search Slider
    // ------------------------------------------------------------------------
	function facetedAjax($element, tmpl, facetData = 'ap-facetedsearch-data') {
        const template = tmpl;
        let url = window.location.href;
		let facet= $element.data(facetData);
        url = url.replace(/https?:\/\/[^/]+/, '');
        utils.api.getPage(url,
			{ 
				template,
                params: {
                    list_all: facet,
                }  
			}
			, (err, response) => {
				if (err) {
                    throw new Error(err);
                }
				$element.html(response);
				$( document ).ready(function() {
					
					// init on updateView(../theme/common/faceted-search.js)
					$(document).bind('facetInit', function() {
						initAjaxFacetedSearch();
					});
					
				});
			});
    }
	
	function initAjaxFacetedSearch() {
        $('[data-ap-facetedsearch-data]').each((i, element) => {
            facetedAjax($(element), 'apframework/faceted-search/show-more-ajax', 'ap-facetedsearch-data');
        });
    }

	// init on page load
	initAjaxFacetedSearch();



    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    // Count Donwn
    // ------------------------------------------------------------------------

    $('time').countDown({ with_separators: false });
    $(window).load(function() {     
        $(".loader-master").hide();
        setTimeout(function(){
            $('html, body').scrollTop(0);
        },0);
    });


    // ------------------------------------------------------------------------
    // Instagram Carousel
    // ------------------------------------------------------------------------

    const $carousel = $('[data-apframework-instafeed-carousel]');

    if ($carousel.length) {
        $carousel.on('instafeedAfter', (e) => {
            const $el = $(e.target);
            $el.slick($el.data('apframeworkInstafeedCarousel'));
        });
    }
	// ------------------------------------------------------------------------
    // loading
    // ------------------------------------------------------------------------
 $(window).load(function() {     
    $(".loader-master").hide();
    setTimeout(function(){
        $('html, body').scrollTop(0);
    },0);
    });

    // ------------------------------------------------------------------------
    // Float Header
    // ------------------------------------------------------------------------
    if($(window).width()<=991){
        //$('.body').css("padding-top",$(".header_nav").height() - $(".topbar").height());
		$('.body').css("padding-top",$("#header").height());
		$('.floating-compare').css('top',$("#header").height());
		$('.navUser-item--compare').css('padding','0');
    }
    else{
    $(window).scroll(function() {
        if ($(this).scrollTop() > 1){  
            $('.header_nav').addClass("header-fixed");
            $('.body').css("padding-top",$(".header_nav").height() - $(".topbar").height());
        }
        else{
            $('.header_nav').removeClass("header-fixed");
            $('.body').removeAttr('style');
        }
    });
    }

    // ------------------------------------------------------------------------
    // Back To Top
    // ------------------------------------------------------------------------

    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#back-top').fadeIn();
        } else {
            $('#back-top').fadeOut();
        }
    });
    $('#back-top a').click(function() {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    // ------------------------------------------------------------------------
    // Popup Newsleter
    // ------------------------------------------------------------------------


    var date = new Date();
    var popup_expires = $("#popup-newsletter").data("expires");
    var popup_delay = $("#popup-newsletter").data("delay");
    date.setTime(date.getTime() + (popup_expires * 600 * 1000));

    $('#popup-close').on('click',function(e) {
        $.cookie('#popup-newsletter', 'closed', { expires: date, path: '/' });
        $('#popup-newsletter,#popup-overlay').fadeOut(400);
        e.preventDefault();
    });

    $(document).on('click',function(e) {
        if (!$(e.target).closest('#popup-newsletter').length) {
            $.cookie('popup-newsletter', 'closed', { expires: date, path: '/' });
            $('#popup-newsletter,#popup-overlay').fadeOut(400);
        }
    });

    if($.cookie('#popup-newsletter') != 'closed') {
        setTimeout(open_popup,popup_delay);
    }
    function open_popup() {
        $('#popup-newsletter,#popup-overlay').fadeIn(400);
    }

        // $.removeCookie('popup-newsletter');


    // ------------------------------------------------------------------------
    // Collections Gird > List
    // ------------------------------------------------------------------------

 
        $(".list-grid--switcher").each( function(){
            $(".list").click( function(){
                $(this).addClass('active');
                $(".grid").removeClass('active');
                $(".productGrid").addClass('productList');
            });
            $(".grid").click(function(){
                $(this).addClass('active');
                $(".list").removeClass("active");
                $(".productGrid").removeClass('productList');
            });
        }); 
        if($('.group-nav').hasClass('active')){
            $('.group-nav').removeClass('active');
        }
    // ------------------------------------------------------------------------
    // Map Google
    // ------------------------------------------------------------------------
     /*   $(window).load(function(){
                $(".gmap-wrap").hide();
                $(".gmap-button").click(function(){
                    $(".gmap-wrap").slideToggle();
                    return false;
                });
            });
         // ------------------------------------------------------------------------*/
    // Thumb List Carousel
    // ------------------------------------------------------------------------
        $('.productView-thumbnails').slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: false,
            fade: false,
            autoplay: true
        });
        //-------------------------------------------
        // modal close search
        //-------------------------------------------
