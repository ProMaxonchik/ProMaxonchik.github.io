(function($){
	jQuery(document).ready(function() {	


		
		


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