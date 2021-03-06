require('./bootstrap');

$(document).ready(function() {
	$('.preview-btn').on('click', function(e) {
		let el = $(this);
		if(el.hasClass('text-primary')) {
			return;
		}
		$('.preview-btn, .preview-btn i').removeClass('text-primary text-dark');
		el.addClass('text-primary');
		let id = el.data('id');
		switch(id) {
			case 1:
			$('#carousel_features_img_1').removeClass('d-none');
			$('#carousel_features_img_2').addClass('d-none');
			$('#carousel_features_img_3').addClass('d-none');
			break;

			case 2:
			$('#carousel_features_img_1').addClass('d-none');
			$('#carousel_features_img_2').removeClass('d-none');
			$('#carousel_features_img_3').addClass('d-none');
			break;

			case 3:
			$('#carousel_features_img_1').addClass('d-none');
			$('#carousel_features_img_2').addClass('d-none');
			$('#carousel_features_img_3').removeClass('d-none');
			break;
		}
	})
});

window.Vue = require('vue');

const files = require.context('./', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

const app = new Vue({
    el: '#app',
});

window.App = {
	util: {
		format: {
			count: (function(count = 0) {
				if (count < 1e3) return count;
				if (count >= 1e3 && count < 1e6) return +(count / 1e3).toFixed(0) + "K";
				if (count >= 1e6 && count < 1e9) return +(count / 1e6).toFixed(0) + "M";
				if (count >= 1e9 && count < 1e12) return +(count / 1e9).toFixed(0) + "B";
			})
		}
	}
};