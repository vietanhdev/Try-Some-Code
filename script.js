// FUNCTIONS TO WORK WITH CLASSES (Add, remove classes)
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}
function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}
function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

function changeActive(modeName) {
  let oldActiveEl = document.querySelector(".tablinks.active");
  removeClass(oldActiveEl, "active");
  mode[mode.activeMode].value = editor.getValue(); // Transfer editor code to current active mode
  mode.activeMode = modeName; // Change current active mode
  let newActiveEl = document.querySelector(".tablinks." + modeName);
  addClass(newActiveEl, "active");

  editor.setValue(mode[mode.activeMode].value);
  editor.setOption("mode", mode[mode.activeMode].codeMirrorMode);
}

// FUNCTION TO LOAD DOCUMENT AJAX WAY
function loadDoc(fileURL, modeName) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            mode[modeName].value=this.responseText;
            if (modeName == mode.activeMode) { // Update the editor
              editor.setValue(this.responseText);
            }
            runCode();
       }
    };
    xhttp.open("GET", fileURL, true);
    xhttp.send();
}


// INITIALIZE DEFAULT VALUE
var mode = {
  defaultMode: "html",
  activeMode: "html",
  "html": {
    displayName: "HTML",
    codeMirrorMode: "htmlmixed",
    value: ""
  },
  "css": {
    displayName: "CSS",
    codeMirrorMode: "text/css",
    value: ""
  },
  "js": {
    displayName: "JAVASCIPT",
    codeMirrorMode: "javascript",
    value: ""
  }
};

// LOAD DEFAULT DOCUMENTS
loadDoc("excode/index.html", "html");
loadDoc("excode/js.js", "js");
loadDoc("excode/css.css", "css");

// INITILIZE THE EDITOR
var editor = CodeMirror(document.querySelector(".tsc.editor-view"), {
  value: mode[mode.defaultMode].value,
  mode : mode[mode.defaultMode].codeMirrorMode,
  theme: "solarized dark",
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
});

// UPDATE CODE TO RESULT VIEW
function runCode() {
    // save current mode's code
    mode[mode.activeMode].value = editor.getValue();
    let content = "<style>"+mode['css'].value+"</style>";
    content += mode['html'].value;
    content += "<script>"+mode['js'].value+"</script>";
    var iframe = document.getElementById('result');
    iframe = (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
    iframe.document.open();
    iframe.document.write(content);
    iframe.document.close();
    return false;
}
