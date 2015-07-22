// Readme:
// I wasn't sure if the categories need to be visible if JS is disabled,
// so I made the script dependent on the existence of the div.panel and 
// the tabs in the header - I think this will give the users a better XP.

// component functionality
$(function() {
	$('.tabs .tabs-header a').click(function(e) {
		e.preventDefault(); // prevent the link from firing

		// if a tab different than the current has been selected
		if (!$(this).parent().hasClass('active')) {
			// remove the active class from the current tab and panel
			$('.tabs .tabs-header li.active').removeClass('active');
			$('.tabs .panel.active').removeClass('active');

			// and then add it to the requested tab...
			$(this).parent().addClass('active');
			
			// ...and panel, but first figure out which one it is
			var targetId = $(this).attr('href').replace(/^.*?(#|$)/,'');
			$('.tabs .panel#' + targetId).addClass('active');
		}
	});
});

// fetch the content
// first specify the categories that need to be fetched
var contentCategories = ['uk-news', 'football', 'travel'];

$(function() {
	// url without the category
	var urlWoCat = 'http://content.guardianapis.com/search?api-key=9wur7sdh84azzazdt3ye54k4&show-fields=webTitle,trailText,webUrl,thumbnail&page-size=10&order-by=newest&section=';

	// iterate through the required categories and make the ajax request
	$.each(contentCategories, function(index, currentCat) {
		$.ajax({ url: urlWoCat + currentCat })
		 .done(function(data) {
			var res = data.response.results;

			// if there are results, fill the corresponding list
			if (res.length > 0) {
				fillList(res[0].sectionId, res);
			}
		});
	});
});

function fillList(listId, res) {
	// get the current panel and remove the no content message
	var newsPanel = $('#' + listId);
	$('.no-content', newsPanel).remove();
	
	// create a new unordered list
	var ul = $('<ul/>').addClass('articles').appendTo(newsPanel);

	// create a list item with a number, title, description, and image,
	// for each result, and append it to the list
	$.each(res, function(index,value) {
		var li = $('<li/>').appendTo(ul);

		var image = $('<img/>').attr({
			class: 'thumbnail',
			src: value.fields.thumbnail,
			alt: value.webTitle
		}).appendTo(li);

		var numberSpan = $('<span/>')
			.addClass('number')
			.text(index+1)
			.appendTo(li);

		var descriptionSpan = $('<span/>')
			.addClass('description')
			.appendTo(li);

		var newsTitle = $('<h4/>')
			.appendTo(descriptionSpan);

		var newsLink = $('<a/>')
			.text(value.webTitle)
			.attr({
				href: value.webUrl
			}).appendTo(newsTitle);

		var newsText = $('<p/>')
			.html(value.fields.trailText)
			.appendTo(descriptionSpan);
	});
}