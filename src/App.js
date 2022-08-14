import axios from "axios";
import "./App.css";
import stubs from "./stubs";
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
function App() {

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState('chaos');
  const [userName, setUserName] = useState("ClassName1");
  const [status, setStatus] = useState(null);
  const [executionTimeDispay, setexecutionTimeDispay] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);


  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "py";
    setLanguage(defaultLang);
  }, []);

  const languageDict = {
    py: 'python',
    java: 'java',
    cpp: 'c_cpp'
  }

  const handleSubmit = async () => {

    const payload = {
      language,
      code,
      userName
    };

    try {
      setOutput("");
      setStatus("Submitted");
      setexecutionTimeDispay(null);
      const { data } = await axios.post("https://sasa-fast-compiler.herokuapp.com/run", payload);
      setStatus("Executed");

      console.log(data);


      setUserName(userName);
      setexecutionTimeDispay(data.executionTime);



      setOutput('Output: \n' + data.result.output.stdout + '\n' + 'Status: \n' + data.result.output.stderr);

    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      } else {
        setOutput("Please retry submitting.");
      }
    }
  };

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
    console.log(`${language} set as default!`);
  };


  function validatePassword(p) {
    const errors = [];
    var specials = /[^A-Za-z 0-9]/g;

    if (specials.test(p)) {
      errors.push("Your class name should only contain Letters And Digits.");
    } else
      if (p[0].search(/[A-Z]/) < 0) {
        errors.push("Your class name must start with one upper case letter.");
      } else

        if (p.length < 7) {
          errors.push("Your class name must be at least 8 characters");
        } else
          if (p.length > 32) {
            errors.push("Your class name must be at max 32 characters");
          } else


            if (p.search(/[0-9]/) < 0) {
              errors.push("Your class name must contain at least one digit.");
            }

    if (errors.length > 0) {
      document.getElementById('userNameStatus').innerText = errors[0];
      errors.shift();
      console.log(errors.join("\n"));
      return false;
    }
    document.getElementById('userNameStatus').innerText = "You Are Ready To Proceed.";
    return true;
  }


  function onChange(newValue) {

    setCode(newValue);

  }

  return (
    <div className="App" >


      <nav role="navigation" class="navbar navbar-default">
        <ul class="nav nav-pills pull-left">
          <form>
            <img src="./favicon.ico" alt="Avatar" width="30" height="20" class="img-rounded"></img>
            <label>Sasa Online Compiler</label>
            <button type="button" class="btn btn-danger btn-xs"
              id="status">Login</button>
              
          </form>
          
        </ul>

        <div class="pull-right">

          <input
            onChange={(e) => { document.getElementsByClassName("App")[0].style = `background:${e.target.value}` }}
            defaultValue='#1E2152' type="color" id="colorpicker" />

        </div>
        
          <span class=""></span>
          
        
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
                <span class="glyphicon-class">Sasa Coding Problems</span>
              </h4>

            </a>  
          </div>  
          <div class="container">

            <div class="panel panel-default">
              <div class='panel-heading'>
                <b>Note:</b><code>Java Program Class Name* Should Be Mentioned Here And Do Not Make It Public*.</code>
                <div class="row">
                  <br></br>

                  <div class="col-md-4">



                    <a class="btn btn-info btn-sm" onClick={setDefaultLanguage}>Set This Language As Default</a>


                  </div>
                  <div class="col-md-4">
                    <div class="btn btn-default btn-sm dropdown-toggle">
                    <select
                      class="bg-default"
                      value={language}

                      onChange={(e) => {
                        const shouldSwitch = window.confirm(
                          "Are you sure you want to change language? WARNING: Your current code will be lost."
                        );
                        if (shouldSwitch) {
                          setStatus("");

                          setLanguage(e.target.value);
                        }
                      }}


                    >

                      <option value="cpp">C++</option>
                      <option value="py">Python</option>
                      <option value="java">Java</option>
                    </select>
                    </div>
                  </div>

                  <div class="col-md-4">
                    <div class="btn btn-default btn-sm dropdown-toggle">
                      <select id="-theme"

                        value={theme}

                        onChange={(e) => { setTheme(e.target.value); }}
                      >


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
                </div>

              </div>
             
            </div>

            <div class="panel panel-default">
              <div class="panel-heading">
                <div class='row'>
                  <h6><code class="text-danger" id="userNameStatus">Create Unique <b>Class Name</b></code></h6>
                  <div class="col-md-4">

                    <label>ClassName:</label>

                    <input
                      defaultValue={userName}
                      onChange={(e) => {
                        const button = document.getElementById('submit');
                        if (validatePassword(e.target.value)) { button.className = 'btn btn-success btn-sm'; setUserName(e.target.value); } else button.className = 'btn btn-success btn-sm disabled';

                      }}></input>

                  </div>

                  <div class="col-md-4">

                    <a id="submit" onClick={handleSubmit} class="btn btn-success btn-sm" >Run</a>


                  </div>
                  <div class="col-md-4">
                    <strong>Status : </strong>{status}
                    {' '}
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
                  <div class="editor">

                    <AceEditor

                      placeholder={"Class Should Not Be Public And It Should Be Same As Your UserName."}
                      mode={languageDict[language]}
                      theme={theme}
                      fontSize={16}
                      onChange={onChange}
                      value={code}
                      width="100%"
                      height="510px"
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
                      name="UNIQUE_ID_OF_DIV"

                    />
                  </div>
                </div>


                <div class="col-sm-6 col-md-3 col-lg-5">
                  <div class="editor">
                <AceEditor

                  
                  mode={languageDict[language]}
                  theme={theme}
                  fontSize={16}
                  onChange={(e)=>{e.target.value=output}}
                  value={output}
                  width="100%"
                  height="510px"
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
                  name="UNIQUE_ID_OF_DIV"


                />
                   
                  </div>

                </div>

              </div>
            </div>
            
          </div>



      </div>




      );
}

      export default App;