"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/indent-string";
exports.ids = ["vendor-chunks/indent-string"];
exports.modules = {

/***/ "(rsc)/./node_modules/indent-string/index.js":
/*!*********************************************!*\
  !*** ./node_modules/indent-string/index.js ***!
  \*********************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = (string, count = 1, options) => {\n\toptions = {\n\t\tindent: ' ',\n\t\tincludeEmptyLines: false,\n\t\t...options\n\t};\n\n\tif (typeof string !== 'string') {\n\t\tthrow new TypeError(\n\t\t\t`Expected \\`input\\` to be a \\`string\\`, got \\`${typeof string}\\``\n\t\t);\n\t}\n\n\tif (typeof count !== 'number') {\n\t\tthrow new TypeError(\n\t\t\t`Expected \\`count\\` to be a \\`number\\`, got \\`${typeof count}\\``\n\t\t);\n\t}\n\n\tif (typeof options.indent !== 'string') {\n\t\tthrow new TypeError(\n\t\t\t`Expected \\`options.indent\\` to be a \\`string\\`, got \\`${typeof options.indent}\\``\n\t\t);\n\t}\n\n\tif (count === 0) {\n\t\treturn string;\n\t}\n\n\tconst regex = options.includeEmptyLines ? /^/gm : /^(?!\\s*$)/gm;\n\n\treturn string.replace(regex, options.indent.repeat(count));\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvaW5kZW50LXN0cmluZy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1EQUFtRCxjQUFjO0FBQ2pFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1EQUFtRCxhQUFhO0FBQ2hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDREQUE0RCxzQkFBc0I7QUFDbEY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2RyaWZ0bG9nLy4vbm9kZV9tb2R1bGVzL2luZGVudC1zdHJpbmcvaW5kZXguanM/MzhiYiJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKHN0cmluZywgY291bnQgPSAxLCBvcHRpb25zKSA9PiB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0aW5kZW50OiAnICcsXG5cdFx0aW5jbHVkZUVtcHR5TGluZXM6IGZhbHNlLFxuXHRcdC4uLm9wdGlvbnNcblx0fTtcblxuXHRpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFxuXHRcdFx0YEV4cGVjdGVkIFxcYGlucHV0XFxgIHRvIGJlIGEgXFxgc3RyaW5nXFxgLCBnb3QgXFxgJHt0eXBlb2Ygc3RyaW5nfVxcYGBcblx0XHQpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBjb3VudCAhPT0gJ251bWJlcicpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFxuXHRcdFx0YEV4cGVjdGVkIFxcYGNvdW50XFxgIHRvIGJlIGEgXFxgbnVtYmVyXFxgLCBnb3QgXFxgJHt0eXBlb2YgY291bnR9XFxgYFxuXHRcdCk7XG5cdH1cblxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5kZW50ICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXG5cdFx0XHRgRXhwZWN0ZWQgXFxgb3B0aW9ucy5pbmRlbnRcXGAgdG8gYmUgYSBcXGBzdHJpbmdcXGAsIGdvdCBcXGAke3R5cGVvZiBvcHRpb25zLmluZGVudH1cXGBgXG5cdFx0KTtcblx0fVxuXG5cdGlmIChjb3VudCA9PT0gMCkge1xuXHRcdHJldHVybiBzdHJpbmc7XG5cdH1cblxuXHRjb25zdCByZWdleCA9IG9wdGlvbnMuaW5jbHVkZUVtcHR5TGluZXMgPyAvXi9nbSA6IC9eKD8hXFxzKiQpL2dtO1xuXG5cdHJldHVybiBzdHJpbmcucmVwbGFjZShyZWdleCwgb3B0aW9ucy5pbmRlbnQucmVwZWF0KGNvdW50KSk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/indent-string/index.js\n");

/***/ })

};
;