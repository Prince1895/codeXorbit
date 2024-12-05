
var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    mode: "javascript",
    theme: "dracula",
    matchBrackets: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    styleActiveLine: true
  });
  
  document.getElementById('toggleMode').addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    var modeButton = document.getElementById('toggleMode');
    modeButton.innerText = document.body.classList.contains('light-mode') ? "Switch to Dark Mode" : "Switch to Light Mode";
  });
  document.getElementById('languageSelect').addEventListener('change', function(event) {
    var language = event.target.value;
    var mode;
    switch(language) {
      case 'c':
        mode = 'c';
        break;
      case 'python':
        mode = 'python';
        break;
      case 'javascript':
        mode = 'javascript';
        break;
      case 'java':
        mode = 'clike';
        break;
    }
    editor.setOption("mode", mode);
  });

  document.getElementById('runBtn').addEventListener('click', function() {
    const code = editor.getValue(); 
    const language = document.getElementById('languageSelect').value; 
  
    
    document.getElementById('outputArea').textContent = "";
  
    
    if (language === 'javascript') {
      runJavaScript(code);
    } else if (language === 'python') {
      runPython(code);
    } else if (language === 'c') {
      runC(code); 
    } else if (language === 'java') {
      runJava(code);  
    }
  });
  
  
  function runJavaScript(code) {
    try {
      let result = eval(code); 
      displayOutput(result);
    } catch (error) {
      displayOutput("Error: " + error.message);
    }
  }
  
 
  function runPython(code) {
    try {
      
      if (!window.brython) {
        let script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/brython@3.10.5/brython.min.js';
        script.onload = function() {
          brython();
          executePython(code);
        };
        document.body.appendChild(script);
      } else {
        executePython(code); 
      }
    } catch (error) {
      displayOutput("Error: " + error.message);
    }
  }
  
  
  function executePython(code) {
    try {
      
      const result = __BRYTHON__.run_script(code); 
      displayOutput(result);
    } catch (error) {
      displayOutput("Error: " + error.message);
    }
  }
  
  function displayOutput(output) {
    const outputArea = document.getElementById('outputArea');
    outputArea.textContent = output;  
  }
document.getElementById('downloadBtn').addEventListener('click', function() {
    const code = editor.getValue();
    const output = document.getElementById('outputArea').textContent;
    downloadPDF(code, output);
  });

function downloadPDF(code, output) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Code:", 10, 10);
    doc.text(code, 10, 20);
    doc.text("Output:", 10, 50);
    doc.text(output, 10, 60);
    doc.save('code-output.pdf');
  }
document.getElementById('newProjectBtn').addEventListener('click', function() {
    editor.setValue(''); 
    document.getElementById('outputArea').textContent = '';  
    alert('New project created!');
  });
  //
document.getElementById('newProjectBtn').addEventListener('click', function() {
    editor.setValue('');  
    document.getElementById('outputArea').textContent = '';  
    alert('New project created!');
  });
  

  document.getElementById('saveProjectBtn').addEventListener('click', function() {
    const code = editor.getValue();
    const language = document.getElementById('languageSelect').value;
    const projectName = prompt("Enter project name:");
    if (projectName) {
      localStorage.setItem(projectName, JSON.stringify({ code, language }));
      alert('Project saved!');
    } else {
      alert('Please provide a valid project name');
    }
  });
  
  document.getElementById('loadProjectBtn').addEventListener('click', function() {
    const projectName = prompt("Enter the project name to load:");
    const projectData = localStorage.getItem(projectName);
    if (projectData) {
      const { code, language } = JSON.parse(projectData);
      editor.setValue(code);  
      document.getElementById('languageSelect').value = language;  
      alert('Project loaded!');
    } else {
      alert('Project not found');
    }
  });
document.getElementById('downloadZipBtn').addEventListener('click', function() {
    const code = editor.getValue();
    const language = document.getElementById('languageSelect').value;
    const projectName = 'project';  
  
    const zip = new JSZip();
    zip.file(projectName + '.' + language, code);  
    zip.generateAsync({ type: 'blob' })
      .then(function(content) {
        saveAs(content, projectName + '.zip');
      });
  });  
  