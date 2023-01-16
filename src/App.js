import axios from "axios";
import "./App.css";
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import AceEditor from 'react-ace';
import 'brace/mode/python';
import 'brace/mode/java';
import 'brace/mode/c_cpp';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';
import 'brace/theme/ambiance';
import 'brace/theme/chaos';
import 'brace/theme/clouds_midnight';
import 'brace/theme/dracula';
import 'brace/theme/cobalt';
import 'brace/theme/gruvbox';
import 'brace/theme/gob';
import 'brace/theme/idle_fingers';
import 'brace/theme/kr_theme';
import 'brace/theme/merbivore';
import 'brace/theme/mono_industrial';
import 'brace/theme/monokai';
import 'brace/theme/pastel_on_dark';
import 'brace/theme/solarized_dark';
import 'brace/theme/terminal';
import 'brace/theme/tomorrow_night';
import 'brace/theme/tomorrow_night_blue';
import 'brace/theme/tomorrow_night_bright';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/theme/twilight'
import 'brace/theme/vibrant_ink'
import 'brace/theme/chrome';
import 'brace/theme/clouds';
import 'brace/theme/crimson_editor';
import 'brace/theme/dawn';
import 'brace/theme/dreamweaver';
import 'brace/theme/eclipse';
import 'brace/theme/github';
import 'brace/theme/iplastic';
import 'brace/theme/solarized_light';
import 'brace/theme/textmate';
import 'brace/theme/tomorrow';
import 'brace/theme/xcode';
import 'brace/theme/kuroir';
import 'brace/theme/katzenmilch';
import 'brace/theme/sqlserver';

import Select from 'react-select';

export default function App() {

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [inputs, setInputs] = useState("");
  const [language, setLanguage] = useState("");
  const [theme, setTheme] = useState('xcode');
  const [status, setStatus] = useState(null);
  const userName = new URL(window.location.href).pathname.substring(1,);
  const [executionTimeDispay, setexecutionTimeDispay] = useState(null);
  const defaultLang = localStorage.getItem("default-language");
  const defaultCode = localStorage.getItem("default-code");


  useEffect(() => {
    defaultLang ?setLanguage(defaultLang):setLanguage('python')

    defaultCode ?setCode(defaultCode):setCode('')

  }, []);
  const handleLanguageChange = async (e) => {
    setStatus("");
    setLanguage(e.value);
  }
  
  const languageDict = {
    python: 'Python',
    java: 'Java',
    cpp: 'Cpp'
  };

  const languages = [{ value: "python", label: "Python" }, { value: "java", label: "Java" }]
 
  const handleSubmit = async () => {

    let formatInputs = []
    for (let str of inputs.split('\n')) {
      formatInputs.push(str);
    }

    const payload = {
      language:languageDict[language],
      code:code,
      userName:userName,
      inputs: formatInputs
    };
   

    try {
      setOutput("");
      setCode(code);
      
      setStatus("Submitted");
      setexecutionTimeDispay(null);
      
      const { data } = await axios.post("http://127.0.0.1:8000/runcode", payload);
      setStatus("Executed");
      console.log(data);
      setexecutionTimeDispay(data.executionTime);
      let output = "";
      for(let str of data.output){
        output += str+'\n'
      }
      setOutput(output);

    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.stderr;
        setOutput(errMsg);
      } else {
        setOutput("Please retry submitting.");
      }
    }
  };

  const setDefault = () => {
    localStorage.setItem("default-language", language);
    localStorage.setItem("default-code", code);
    alert("Saved Your Code");
  };
  
  const onChangeCode =(newValue)=> {
    setCode(newValue);
    
  }

  const onChangeInput =(newValue)=> {
    setInputs(newValue);
  }

  return (
    <div className="App" >
      <nav role="navigation" class="navbar navbar-default">
        
        <div class="pull-right">
          <span class="">Set Theme</span>
          <input
            onChange={(e) => { document.getElementsByClassName("App")[0].style = `background:${e.target.value}` }}
            defaultValue='#1E2152' type="color" id="colorpicker" />
        </div>
    
        <input type="button" 
          onClick={(e) => { if (e.target.value == "SHOW MENU ↓") { e.target.value = "HIDE MENU ↑" } else { e.target.value = "SHOW MENU ↓"  }}}
          class="btn-block" data-toggle="collapse" data-target="#toggleDemo" value="HIDE MENU ↑" />
          
      </nav>
      <div class="bs-example">
          <div id="toggleDemo" class="collapse in">
          <div class='container'>
            <a class="btn btn-block btn-default btn-xs" href="#">
              <h4>
                <span class="glyphicon glyphicon-th-large"></span>
                <span class="glyphicon-class"><b> code It compile It</b></span>
              </h4>
            </a>  
          </div>  
          <div class="container">
            <div class="panel panel-default">
              <div class='panel-body'>
                <div class="row">
                  <div class="col-md-4">
                    <a class="btn btn-default btn-sm" style={{ border: "2px solid black" }} onClick={setDefault}>Save Changes</a>
                  </div>
                  <div class="col-md-4">
                    <div class="btn btn-default btn-sm dropdown-toggle">
                  
                      <Select
                        defaultValue={languages.find((lang)=> lang.value == defaultLang)}
                        onChange={handleLanguageChange}
                        options={languages}
                      />

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-body">
                <div class='row'>
                  <div class="col-md-2">
                    <div class="btn btn-default btn-sm dropdown-toggle">
                      <select id="-theme"
                        value={theme}
                        onChange={(e) => { setTheme(e.target.value); }}>
                        <optgroup label="Bright">
                          <option value="chrome">Chrome</option>
                          <option value="clouds">Clouds</option>
                          <option value="crimson_editor">Crimson Editor</option>
                          <option value="dawn">Dawn</option>
                          <option value="dreamweaver">Dreamweaver</option>
                          <option value="eclipse">Eclipse</option>
                          <option value="github">GitHub</option>
                          <option value="iplastic">IPlastic</option>
                          <option value="solarized_light">Solarized Light</option>
                          <option value="textmate">TextMate</option>
                          <option value="tomorrow">Tomorrow</option>
                          <option value="xcode">XCode</option>
                          <option value="kuroir">Kuroir</option>
                          <option value="katzenmilch">KatzenMilch</option>
                          <option value="sqlserver">SQL Server</option>
                        </optgroup>
                        <optgroup label="Dark">
                          <option value="ambiance">Ambiance</option>
                          <option value="chaos">Chaos</option>
                          <option value="clouds_midnight">Clouds Midnight</option>
                          <option value="dracula">Dracula</option>
                          <option value="cobalt">Cobalt</option>
                          <option value="gruvbox">Gruvbox</option>
                          <option value="gob">Green on Black</option>
                          <option value="idle_fingers">idle Fingers</option>
                          <option value="kr_theme">krTheme</option>
                          <option value="merbivore">Merbivore</option>
                          <option value="merbivore_soft">Merbivore Soft</option>
                          <option value="mono_industrial">Mono Industrial</option>
                          <option value="monokai">Monokai</option>
                          <option value="pastel_on_dark">Pastel on dark</option>
                          <option value="solarized_dark">Solarized Dark</option>
                          <option value="terminal">Terminal</option>
                          <option value="tomorrow_night">Tomorrow Night</option>
                          <option value="tomorrow_night_blue">Tomorrow Night Blue</option>
                          <option value="tomorrow_night_bright">Tomorrow Night Bright</option>
                          <option value="tomorrow_night_eighties">Tomorrow Night 80s</option>
                          <option value="twilight">Twilight</option>
                          <option value="vibrant_ink">Vibrant Ink</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <a id="submit" onClick={handleSubmit} class="btn btn-success btn-block btn-sm" >Run</a>
                  </div>
                  <div class="col-md-5">
                    <strong>Status : </strong>{status}
                    {'\t\t'}
                    <strong>{executionTimeDispay}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>  
          <div class="panel panel-default">
            <div class="panel-body">
              <div class="row">
                <div class="col-sm-6 col-md-8 col-lg-7">
                  <div class="editor input">
                    <AceEditor
                      placeholder={"Class Should Not Be Public And It Should Be Same As Your UserName."}
                      mode={language}
                      theme={theme}
                      fontSize={16}
                      onChange={onChangeCode}
                      value={code}
                      width="100%"
                      height="575px"
                      showPrintMargin={true}
                      showGutter={true}
                      highlightActiveLine={true}
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 4,
                      }}
                      name="UNIQUE_ID_OF_DIV3"
                    />
                  </div>
                </div>
                <div class="col-sm-6 col-md-3 col-lg-5">
                  <div class="editor output">
                  <AceEditor
                    mode={languageDict[language]}
                    theme={theme}
                    fontSize={16}
                    onChange={(e)=>{e.target.value=output}}
                    value={output}
                    width="100%"
                    height="285px"
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: false,
                      showLineNumbers: true,
                      readOnly:true,
                      tabSize: 4,
                    }}
                    name="UNIQUE_ID_OF_DIV2"
                  />
                </div>
              </div>
            <div class="col-sm-6 col-md-3 col-lg-5">
              <span>Input ↓</span>
              <div class="editor">
                <AceEditor
                  placeholder={"Your Input Here"}
                  mode={languageDict[language]}
                  theme={theme}
                  fontSize={16}
                  onChange={onChangeInput}
                  value={inputs}
                  width="100%"
                  height="245px"
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 4,
                  }}
                  name="UNIQUE_ID_OF_DIV1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
