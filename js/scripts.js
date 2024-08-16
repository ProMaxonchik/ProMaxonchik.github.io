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

		function killCopy(e){
			return false
		}
			function reEnable(){
			return true
		}
		document.onselectstart=new Function ("return false")
			if (window.sidebar){
			document.onmousedown=killCopy
			document.onclick=reEnable
		}
		


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