jquery-as-template
==================

A Simple HTML templating method for jQuery with support for repeated elements.

API
---

A single method, `asTemplateWith()` is added to jQuery objects which treats the HTML contents of the query as a template and returns a string with replacements based on a JSON input.

```javascript
// Syntax
string = jqueryCollection.asTemplateWith(data [, options]);
```

- **jqueryCollection**: A jQuery element query of one or more HTML elements whose contents (not including the element itself) is to be used as a template.
- **data**: A JSON object containing name-value pairs for replacements in the template.  Repeatable elements are matched by class name contained within arrays within the JSON.
- **options**: 
    - **replaceRegex**: The regular expression used to match replacements. The default matches a `variableName` in the style: `${variableName}`.
    - **notFoundValue**: The value to be used when template variables are not matched. By default this is `""`. Using `null` will retain the original replacement variable.
    - **repeatSubMatch**: When true, a matched list element is repeated with each item of a list.  When false, only it's contents are repeated (which is always the case for the root query object in the call to `asTemplateWith()`). Default: `false`.


Examples
--------

Basic example:

```xml
<!-- HTML -->
<script id="template-holder" type="text/html">
	<h3>${song}</h3>
	<h4>by ${artist}</h4>
</script>
```

```javascript
// JavaScript
var data = {
	song:"Rock Song",
	artist:"Singer Songwriter"
};

$("body").append( $("#template-holder").asTemplateWith(data) );
```

Result:
```xml
<!-- HTML -->
<h3>Rock Song</h3>
<h4>by Singer Songwriter</h4>
```
Note that in the above example, the containing script tag was not included in the resulting HTML.

Array inputs allow repetition:

```xml
<!-- HTML -->
<script id="template-holder" type="text/html">
	<h3>${song}</h3>
	<h4>by ${artist}</h4>
</script>
```

```javascript
// JavaScript
var data = [
	{
		song:"Rock Song",
		artist:"Singer Songwriter"
	},
	{
		song:"Rap Song",
		artist:"Rappy McRapper"
	}
];


$("body").append( $("#template-holder").asTemplateWith(data) );
```

Result:
```xml
<!-- HTML -->
<h3>Rock Song</h3>
<h4>by Singer Songwriter</h4>
<h3>Rap Song</h3>
<h4>by Rappy McRapper</h4>
```

Nested arrays within the JSON data are matched to class names in the template HTML treating elements as sub-templates:

```xml
<!-- HTML -->
<script id="template-holder" type="text/html">
	<h3>${song}</h3>
	<h4>by ${artist}</h4>
	<h4>Genres:</h4>
	<ul class="genre">
		<li>${name}</li>
	</ul>
</script>
```

```javascript
// JavaScript
var data = {
	song:"Rock Song",
	artist:"Singer Songwriter",
	genre:[
		{name:"Classic Rock"},
		{name:"Instrumental Rock"}
	]
};

$("body").append( $("#template-holder").asTemplateWith(data) );
```

Result:
```xml
<!-- HTML -->
<h3>Rock Song</h3>
<h4>by Singer Songwriter</h4>
<h4>Genres:</h4>
<ul class="genre">
	<li>Classic Rock</li>
	<li>Instrumental Rock</li>
</ul>
```

If a template data array contains literals instead of objects, you can reference their values in the template using the `value` variable:

```xml
<!-- HTML -->
<script id="template-holder" type="text/html">
	<h3>${song}</h3>
	<h4>by ${artist}</h4>
	<h4>Genres:</h4>
	<ul class="genre">
		<li>${value}</li>
	</ul>
</script>
```

```javascript
// JavaScript
var data = {
	song:"Rock Song",
	artist:"Singer Songwriter",
	genre:[
		"Classic Rock",
		"Instrumental Rock"
	]
};

$("body").append( $("#template-holder").asTemplateWith(data) );
```

Result:
```xml
<!-- HTML -->
<h3>Rock Song</h3>
<h4>by Singer Songwriter</h4>
<h4>Genres:</h4>
<ul class="genre">
	<li>Classic Rock</li>
	<li>Instrumental Rock</li>
</ul>
```

In certain cases, you may not be able repeat the contents of a container element and instead need to repeat a specific element.  For instance, in the example template may want to always include a "Top 40" genre in its listing.  With the current design, repeating the contents of the genre `ul` would repeat that hard coded genre for each of the genres in the data and it's not allowed to wrap the repeated `li` within a separate container.  As an alternative, you can assign the genre class to a child `li` and repeat that with the `repeatSubMatch` option set to `true`:

```xml
<!-- HTML -->
<script id="template-holder" type="text/html">
	<h3>${song}</h3>
	<h4>by ${artist}</h4>
	<h4>Genres:</h4>
	<ul>
		<li>Top 40</li>
		<li class="genre">${value}</li>
	</ul>
</script>
```

```javascript
// JavaScript
var data = {
	song:"Rock Song",
	artist:"Singer Songwriter",
	genre:[
		"Classic Rock",
		"Instrumental Rock"
	]
};

var options = {
	repeatSubMatch: true
};

$("body").append( $("#template-holder").asTemplateWith(data, options) );
```

Result:
```xml
<!-- HTML -->
<h3>Rock Song</h3>
<h4>by Singer Songwriter</h4>
<h4>Genres:</h4>
<ul class="genre">
	<li>Top 40</li>
	<li class="genre">Classic Rock</li>
	<li class="genre">Instrumental Rock</li>
</ul>
```