$(document).ready(function() {
	// this is for custom formating of results
   $.extend( $.ui.autocomplete.prototype, {

    _renderItem: function( ul, item) {
      var list = "<li></li>";
      if (item['html_class']) {
        list = "<li class=\""+item['html_class']+"\"></li>";
      }
			// temp until the service actually returns us a type
			else{
				list = "<li class=\"guide\"></li>";
			}
      return $( list )
        .data( "item.autocomplete", item )
        .append( $( "<a href='"+item['url']+"'></a>" ).html( item.html || item.label ) )
        .appendTo( ul );
    }
  });

  var searchUrl = function(pathSuffix) {
    var url = $("form[role=search]").attr("action") ? $("form[role=search]").attr("action") : '/search';
    if (pathSuffix !== undefined) {
      url = url.replace(/search$/, pathSuffix);
    }
    return url;
  };

  var preloaded_search_data = false;
  /* Preload some common searches into the autocomplete box */
  $.getJSON(searchUrl("preload-autocomplete"), function(data) {
    if (data && data[0] && data[0].link && data[0].label && data[0].format) {
      preloaded_search_data = data.map( function(e) {
        return { 'label': e.title, 'url': e.link, 'html_class': e.format };
      });
    }
  });

  var filter_terms = function(search_term,data) {
    var highlight_term = function(query, term) {
      if (query == undefined) { return false; }

      var term = term.split(' ')[0];
      var regex = new RegExp("^\\b("+term+")","ig");
      var count = 0;
      if (query.match(regex)) {
        return query;
      } else {
        return false;
      }
    };

    return $.map(data, function(item) {

      var term = highlight_term(item.label, search_term);
      if (term && item.html_class && item.url) {
        return {
          html_class: item.html_class,
          label:  term,
          url:   item.url
        };
      }
    });
  };

	/* Smoke and mirrors search hint */
	$("#main_autocomplete").live("focus", function(){
	  if($(".hint-suggest").length == 0){
	    $("#search_hint").after("<span class='hint-suggest'><em>Type for suggestions</em></span>");
      $("#search_hint").addClass("visuallyhidden");
    }
	});

	$("#site-search-text").live("focus", function(){
	  if($(".hint-suggest").length == 0){
	      var attachPoint = $(this).parent("fieldset");
	      attachPoint.append("<span class='hint-suggest'><em>Type for suggestions</em></span>");
      }
	});

	$("#site-search-text, #main_autocomplete").live("blur", function(){
	  $(".hint-suggest").remove();
	  $("#search_hint").removeClass("visuallyhidden");
	});

  $("#site-search-text, #main_autocomplete").keydown( function() {
    if ($(this).val().length > 3) {
      $(this).autocomplete( "option", "delay", 400);
    } else {
      $(this).autocomplete( "option", "delay", 100);
    }
  });
  $("#site-search-text, #main_autocomplete").autocomplete({
    delay: 100,
    width: 300,
    source: function(req, add){
      var preloaded_results = false;
      var results_found = 0;
      if (preloaded_search_data) {
        var preloaded_results = filter_terms(req.term,preloaded_search_data)
      }

      if (req.term.length > 3 || preloaded_results == false || preloaded_results.length == 0) {
        $(".hint-suggest").text("Loading...");
        if($(".search-loading").length == 0) {
          $(".hint-suggest").addClass("search-loading");
        }
        results_found = 0;
        $.ajax({
          url: searchUrl("autocomplete") + "?q=" + req.term,
          dataType: "json",
          cache: true,
          success: function(data) {
            var results = $.map(data, function(e) {
              return { 'label': e.title, 'url': e.link, 'class': e.format };
            });
            results_found = results.length;
            add(results)
          },
          complete: function(jqXHR, textstatus){
            $(".hint-suggest").removeClass("search-loading");
            if (textstatus != 'success' || results_found == 0) {
              $(".hint-suggest").text("No results found");
            }
          }
        });
      } else {
        if (preloaded_results.length > 5) {
          var preloaded_results = preloaded_results.splice(0, 5);
        }
        add( preloaded_results );
      }
    },
    select: function(event, ui) {
      location.href = ui.item.url;
    },
    open: function(event, ui){
      if($("#site-search-text").length != 0){
        // all this just to move the ul to the left by an offset
        var offset = $("#site-search-text").offset(),
        leftoffset = offset.left,
        width = $("#site-search-text").width();

        var newLeft = (leftoffset - width);
        $(".ui-autocomplete").css("left", newLeft+"px").css("width", ((width*2)+4)+"px");
      }
      // quickly add the search value to end of list
      var searchVal = $(".ui-autocomplete-input").attr("value");
      $(".ui-autocomplete").append("<li class='search-site ui-state-hover'><a href='"+searchUrl()+"?q="+searchVal+"' class='ui-corner-all' tabindex='-1'>Search for <em>"+searchVal+"</em></li>");
      $("#search_hint").remove();
    }
  });

});
