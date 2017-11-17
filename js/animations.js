(function ($) {

    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *     the user visible viewport of a web browser.
     *     only accounts for vertical position, not horizontal.
     */

    $.fn.visible = function (partial) {

        var $t = $(this),
            $w = $(window),
            viewTop = $w.scrollTop(),
            viewBottom = viewTop + $w.height(),
            _top = $t.offset().top,
            _bottom = _top + $t.height(),
            compareTop = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;

        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

    };

})(jQuery);

function setAnimationHeader() {
    var allFadeIns = $(".fadeInOnLoad");
    allFadeIns.each(function () {
        var el = $(this);
        if (el.visible(true)) {
            el.addClass("animateFadeIn");
        }
    });
}

function setAnimationScroll() {
    var win = $(window);
    var allFadeIns = $(".fadeInOnView");
    var allLefts = $(".leftOnView");
    var allDeepLefts = $(".leftDeepOnView");
    var allRights = $(".rightOnView");
    var allDeepRights = $(".rightDeepOnView");

    // Already visible modules
//     allFadeIns.each(function(i, el) {
//         var el = $(el);
//         if (el.visible(true)) {
//             el.addClass("already-visible");
//         }
//     });

    win.scroll(function (event) {
        allFadeIns.each(function () {
            var el = $(this);
            if (el.visible(true)) {
                el.addClass("animateFadeIn");
            }
        });
        allLefts.each(function () {
            var el = $(this);
            if (el.visible(true)) {
                el.addClass("animateLeft");
            }
        });
        allRights.each(function () {
            var el = $(this);
            if (el.visible(true)) {
                el.addClass("animateRight");
            }
        });
        allDeepLefts.each(function () {
            var el = $(this);
            if (el.visible(true)) {
                el.addClass("animateDeepLeft");
            }
        });
        allDeepRights.each(function () {
            var el = $(this);
            if (el.visible(true)) {
                el.addClass("animateDeepRight");
            }
        });
    });
}

$(document).ready(function () {
    setAnimationHeader();
    setAnimationScroll();
});
