/*
TESTED SUCCESFFULY ON: Chrome 52 / Firefox 48
DON'T VIEW ON: Edge
*/

$(function () {

    // check if browser is not supported
    var $browserAlert = $('#browserAlert');
    $browserAlert.hide();

    $.ajax({
        url: 'https://cdn.rawgit.com/arasatasaygin/is.js/master/is.min.js',
        dataType: "script",
        success: function () {

            if (is.edge() || is.ie()) {
                $browserAlert.find('span').text('View on Chrome/Firefox.');
                $browserAlert.show();
                $browserAlert.addClass('active');
            }

        }
    });

    var $btn = $(".btnSubmit");
    var $loaderTemplate = $("svg.loader");
    var $checkmarkTemplate = $("svg.checkmark");

    $btn.on('click', function () {

        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(document.getElementById("email").value)) {
            return;
        }

        if ($(this).hasClass('clicked')) return;
        $(this).addClass('clicked');
        var self = $(this);
        var timeout1 = 600,
            timeout2 = 1500,
            timeout3 = 1000;
        setTimeout(function () {
            self.append($loaderTemplate.clone());
            self.find('svg').removeClass('svg--template');
            self.find('svg').css('display', 'initial');
        }, timeout1);
        setTimeout(function () {
            self.text('');
            self.find('svg').remove();
            self.append($checkmarkTemplate.clone());
            self.find('svg').css('display', 'initial');
            self.find('svg').removeClass('svg--template');
            self.addClass('done');
        }, timeout1 + timeout2);
        setTimeout(function () {
            self.find('svg').remove();
            self.text('Submit');
            self.removeClass('clicked');
            self.removeClass('done');
            document.getElementById("form1").submit();
        }, timeout1 + timeout2 + timeout3);
    });

});