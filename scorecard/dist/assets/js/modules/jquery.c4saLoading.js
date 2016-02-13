$.c4saLoading = {

    loadingHTML:'<span class="loading">Loading&hellip;</span>',

    replacer: function($target, classes) {
        if ($target.siblings('.loading').length < 1) {
            $target.after($.c4saLoading.loadingHTML);
            $target.siblings('.loading').addClass(classes);
            $target.addClass('hide');
        }
    },

    reverter: function($target) {
        $target.siblings('.loading').remove();
        $target.removeClass('hide');
    }

};