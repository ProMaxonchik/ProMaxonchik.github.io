(function($){
	jQuery(document).ready(function() {	


		document.addEventListener('gesturestart', function(e) {
		    e.preventDefault();
		    // special hack to prevent zoom-to-tabs gesture in safari
		    document.body.style.zoom = 0.99;
		});

		document.addEventListener('gesturechange', function(e) {
		    e.preventDefault();
		    // special hack to prevent zoom-to-tabs gesture in safari
		    document.body.style.zoom = 0.99;
		});

		document.addEventListener('gestureend', function(e) {
		    e.preventDefault();
		    // special hack to prevent zoom-to-tabs gesture in safari
		    document.body.style.zoom = 0.99;
		});

		// Disable Right Mouse Click Using jQuery
		$(document).ready(function () {
		    //Disable full page
		    $("body").on("contextmenu",function(e){
		        return false;
		    });
		     
		    //Disable part of page
		    $("#id").on("contextmenu",function(e){
		        return false;
		    });
		});

		//Disable Cut, Copy, Paste Using jQuery
		$(document).ready(function () {
		    //Disable full page
		    $('body').bind('cut copy paste', function (e) {
		        e.preventDefault();
		    });
		     
		    //Disable part of page
		    $('#id').bind('cut copy paste', function (e) {
		        e.preventDefault();
		    });
		});

		//Disable Right Mouse Click & Cut, Copy, Paste Using jQuery
		$(document).ready(function () {
		    //Disable cut copy paste
		    $('body').bind('cut copy paste', function (e) {
		        e.preventDefault();
		    });
		    
		    //Disable mouse right click
		    $("body").on("contextmenu",function(e){
		        return false;
		    });
		});
		


		jQuery(".modal-01").click(function() {
			jQuery("#modal-01").addClass("modal-active");
		});

		jQuery(".modal-close").click(function() {
			jQuery("#modal-01").removeClass("modal-active");
		});

		jQuery(".modal-02").click(function() {
			jQuery("#modal-02").addClass("modal-active");
		});

		jQuery(".modal-close").click(function() {
			jQuery("#modal-02").removeClass("modal-active");
		});

		jQuery(".modal-item-inner ul li").on("click", function() {
			jQuery(".modal-item-inner ul li").children().removeClass("active");
			jQuery(this).children().addClass("active");
		});

		jQuery(function(){
			jQuery('.profit-item2-inner3').on("click", function () {
			jQuery('.profit-item2-inner3').addClass("active");
			setTimeout(RemoveClass, 200);
		});
		function RemoveClass() {
			jQuery('.profit-item2-inner3').removeClass("active");
			}
		}); 
				
		
		
		
		
		
		
		
		
	});
})(jQuery);