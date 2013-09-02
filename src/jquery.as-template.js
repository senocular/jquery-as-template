/*
The MIT License (MIT)

Copyright (c) 2013 Trevor McCauley

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function($) {
	"use strict";

	var settings = {
		replaceRegex: /\${([^}]+)}/g, // replaces: ${variableName}
		notFoundValue: "", // if replacement not found; null keeps template text
		repeatSubMatch: false // matched wrapping element in sub-template repeats
	};

	$.fn.asTemplateWith = function(data, options){
		settings = $.extend(settings, options);
		return this.map(function(index){
			return fromList( $($.parseHTML($(this).html())), data instanceof Array ? data : [data], true);
		}).get().join(""); // from array to string
	};

	function fromList(tempDom, items, isRoot){
		var last = items.length - 1; // last item uses dom passed in; others cloned
		return $(items).map(function(index){
			return fromItem(index === last ? tempDom : tempDom.clone(), this.valueOf(), isRoot);
		}).get().join(""); // from array to string
	}

	function fromItem(tempDom, item, isRoot){
		tempDom = $("<div>").append(tempDom); // single element tree
		if (item instanceof Object === false) item = {value:item}; // key name if none provided
		for (var key in item){ // finding child templates in data
			if (item[key] instanceof Array){ // likely child template replacement
				subTemplate($("." + key, tempDom), item[key]);
			}
		}
		return replacing(tempDom.html(), item, isRoot); // from dom to string
	}

	function subTemplate(query, subData){
		query.each(function (index){ // matched child templates
			if (settings.repeatSubMatch){
				$(this).after($("<div>")).next().replaceWith( fromList($(this), subData) );
			}else{
				$(this).append( fromList($(this.childNodes), subData) );
			}
		});
	}

	function replacing(template, vals, isRoot){
		return template.replace(settings.replaceRegex, function (match, sub){
			var defaultVal = (isRoot && settings.notFoundValue !== null) ? settings.notFoundValue : match;
			return (typeof vals[sub] === "string" || typeof vals[sub] === "number") ? vals[sub] : defaultVal;
		});
	}

}(jQuery));
