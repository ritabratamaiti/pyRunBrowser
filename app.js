let pyop = document.querySelector("#python-out");
let runBtn = document.querySelector("#run-btn");

const codemirrorEditor = CodeMirror.fromTextArea(
	document.querySelector("#codearea"),
	{
		lineNumbers: true,
		mode: "python",
		theme: "base16-dark",
	}
);

codemirrorEditor.setValue(`print("Hello World")`)

function makeop(s){
	console.log(s);
	pyop.innerHTML = s;
}

runBtn.addEventListener("click", (e) => {
	let pycode = codemirrorEditor.getValue();
	pyop.innerHTML = "";
	runPython(pycode);
})
var autorun =

setInterval(function(){

let pycode = codemirrorEditor.getValue();

pyop.innerHTML = "";

runPython(pycode);

}, 2000);

let startcode = `
import sys, io, traceback
namespace = {}  # use separate namespace to hide run_code, modules, etc.
def run_code(code):
    """run specified code and return stdout and stderr"""
    out = io.StringIO()
    oldout = sys.stdout
    olderr = sys.stderr
    sys.stdout = sys.stderr = out
    try:
        # change next line to exec(code, {}) if you want to clear vars each time
        exec(code, {})
    except:
        traceback.print_exc()

    sys.stdout = oldout
    sys.stderr = olderr
    return out.getvalue()
`
function setup_pyodide(startcode) {
	// setup pyodide environment to run code blocks as needed
	pyodide.runPython(startcode)
  }

languagePluginLoader.then(() => {
	// Pyodide is now ready to use...
	setup_pyodide(startcode)
	pyodide.globals.code_to_run = `print("Hello World")`;
	makeop(pyodide.runPython(`run_code(code_to_run)`));
  });


function runPython(pycode) {
// run code currently stored in editor
	pyodide.globals.code_to_run = pycode
	makeop(pyodide.runPython('run_code(code_to_run)'))
}

function evaluatePython(pycode) {
	pyodide.runPythonAsync(pycode)
    .then(output => makeop(output))
    .catch((err) => { makeop(err) });
}

  

//codeArea.onUpdate( e => console.log(e))
