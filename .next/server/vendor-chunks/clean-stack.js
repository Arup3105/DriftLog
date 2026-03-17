"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/clean-stack";
exports.ids = ["vendor-chunks/clean-stack"];
exports.modules = {

/***/ "(rsc)/./node_modules/clean-stack/index.js":
/*!*******************************************!*\
  !*** ./node_modules/clean-stack/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nconst os = __webpack_require__(/*! os */ \"os\");\n\nconst extractPathRegex = /\\s+at.*(?:\\(|\\s)(.*)\\)?/;\nconst pathRegex = /^(?:(?:(?:node|(?:internal\\/[\\w/]*|.*node_modules\\/(?:babel-polyfill|pirates)\\/.*)?\\w+)\\.js:\\d+:\\d+)|native)/;\nconst homeDir = typeof os.homedir === 'undefined' ? '' : os.homedir();\n\nmodule.exports = (stack, options) => {\n\toptions = Object.assign({pretty: false}, options);\n\n\treturn stack.replace(/\\\\/g, '/')\n\t\t.split('\\n')\n\t\t.filter(line => {\n\t\t\tconst pathMatches = line.match(extractPathRegex);\n\t\t\tif (pathMatches === null || !pathMatches[1]) {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t\tconst match = pathMatches[1];\n\n\t\t\t// Electron\n\t\t\tif (\n\t\t\t\tmatch.includes('.app/Contents/Resources/electron.asar') ||\n\t\t\t\tmatch.includes('.app/Contents/Resources/default_app.asar')\n\t\t\t) {\n\t\t\t\treturn false;\n\t\t\t}\n\n\t\t\treturn !pathRegex.test(match);\n\t\t})\n\t\t.filter(line => line.trim() !== '')\n\t\t.map(line => {\n\t\t\tif (options.pretty) {\n\t\t\t\treturn line.replace(extractPathRegex, (m, p1) => m.replace(p1, p1.replace(homeDir, '~')));\n\t\t\t}\n\n\t\t\treturn line;\n\t\t})\n\t\t.join('\\n');\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvY2xlYW4tc3RhY2svaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7QUFDYixXQUFXLG1CQUFPLENBQUMsY0FBSTs7QUFFdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLGNBQWM7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2RyaWZ0bG9nLy4vbm9kZV9tb2R1bGVzL2NsZWFuLXN0YWNrL2luZGV4LmpzP2RjOGEiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuXG5jb25zdCBleHRyYWN0UGF0aFJlZ2V4ID0gL1xccythdC4qKD86XFwofFxccykoLiopXFwpPy87XG5jb25zdCBwYXRoUmVnZXggPSAvXig/Oig/Oig/Om5vZGV8KD86aW50ZXJuYWxcXC9bXFx3L10qfC4qbm9kZV9tb2R1bGVzXFwvKD86YmFiZWwtcG9seWZpbGx8cGlyYXRlcylcXC8uKik/XFx3KylcXC5qczpcXGQrOlxcZCspfG5hdGl2ZSkvO1xuY29uc3QgaG9tZURpciA9IHR5cGVvZiBvcy5ob21lZGlyID09PSAndW5kZWZpbmVkJyA/ICcnIDogb3MuaG9tZWRpcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChzdGFjaywgb3B0aW9ucykgPT4ge1xuXHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7cHJldHR5OiBmYWxzZX0sIG9wdGlvbnMpO1xuXG5cdHJldHVybiBzdGFjay5yZXBsYWNlKC9cXFxcL2csICcvJylcblx0XHQuc3BsaXQoJ1xcbicpXG5cdFx0LmZpbHRlcihsaW5lID0+IHtcblx0XHRcdGNvbnN0IHBhdGhNYXRjaGVzID0gbGluZS5tYXRjaChleHRyYWN0UGF0aFJlZ2V4KTtcblx0XHRcdGlmIChwYXRoTWF0Y2hlcyA9PT0gbnVsbCB8fCAhcGF0aE1hdGNoZXNbMV0pIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG1hdGNoID0gcGF0aE1hdGNoZXNbMV07XG5cblx0XHRcdC8vIEVsZWN0cm9uXG5cdFx0XHRpZiAoXG5cdFx0XHRcdG1hdGNoLmluY2x1ZGVzKCcuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9lbGVjdHJvbi5hc2FyJykgfHxcblx0XHRcdFx0bWF0Y2guaW5jbHVkZXMoJy5hcHAvQ29udGVudHMvUmVzb3VyY2VzL2RlZmF1bHRfYXBwLmFzYXInKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuICFwYXRoUmVnZXgudGVzdChtYXRjaCk7XG5cdFx0fSlcblx0XHQuZmlsdGVyKGxpbmUgPT4gbGluZS50cmltKCkgIT09ICcnKVxuXHRcdC5tYXAobGluZSA9PiB7XG5cdFx0XHRpZiAob3B0aW9ucy5wcmV0dHkpIHtcblx0XHRcdFx0cmV0dXJuIGxpbmUucmVwbGFjZShleHRyYWN0UGF0aFJlZ2V4LCAobSwgcDEpID0+IG0ucmVwbGFjZShwMSwgcDEucmVwbGFjZShob21lRGlyLCAnficpKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBsaW5lO1xuXHRcdH0pXG5cdFx0LmpvaW4oJ1xcbicpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/clean-stack/index.js\n");

/***/ })

};
;