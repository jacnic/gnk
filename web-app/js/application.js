if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});


	})(jQuery);

    $(function() {
        $('.search-query').keyup(function() {
            var content = $(this).attr("data-content");
            var value = $(this).val().toLowerCase();
            if (value == "") {
                $('.' + content + ' li').show();
            }
            else {
                $('.' + content + ' li').hide();
                $('.' + content + ' li[data-name*="'+value+'"]').show();
            }
        });
    });

    function createNotification(classe, title, description) { //classe = error, danger, info, success
        var template = Handlebars.templates['templates/notification'];
        var context = {
            classe: classe,
            title: title,
            description: description
        };
        var html = template(context);
        $(html).appendTo("body");
        setTimeout(function() {
            $('.notificationBox').remove();
        }, 4000);
    }
}

