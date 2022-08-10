import axios from "axios";
import "./App.css";
import stubs from "./stubs";
import React, { useState, useEffect } from "react";
import moment from "moment";
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import $ from 'jquery';
import Popper from 'popper.js';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/python';
import 'brace/theme/monokai';

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [jobId, setJobId] = useState(null);
  const [userName, setUserName] = useState("UserName1");
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);


  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "py";
    setLanguage(defaultLang);
  }, []);

  let pollInterval;

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
      userName
    };
    try {
      setOutput("");
      setStatus(null);
      setJobId(null);
      setJobDetails(null);
      const { data } = await axios.post("http://localhost:5000/run", payload);
      if (data.jobId) {
        setUserName(userName);
        setJobId(data.jobId);
        setStatus("Submitted.");

        // poll here
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `http://localhost:5000/status`,
            {
              params: {
                id: data.jobId,
              },
            }
          );
          const { success, job, error } = statusRes;
          console.log(statusRes);
          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);
            if (jobStatus === "pending") return;
            setOutput(jobOutput);
            clearInterval(pollInterval);
          } else {
            console.error(error);
            setOutput(error);
            setStatus("Bad request");
            clearInterval(pollInterval);
          }
        }, 1000);
      } else {
        setOutput("Retry again.");
      }
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

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return ". . . Other Details . . .";
    }
    let { submittedAt, startedAt, completedAt } = jobDetails;
    let result = "";
    submittedAt = moment(submittedAt).toString();
    result += `Job Submitted At: ${submittedAt}  `;
    if (!startedAt || !completedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const diff = end.diff(start, "seconds", true);
    result += `Execution Time: ${diff}s`;
    return result;
  };
  function validatePassword(p) {
    //var p = document.getElementById('newPassword').value,
    const errors = [];
    var specials = /[^A-Za-z 0-9]/g;

    if (specials.test(p)) {
      errors.push("Your username should only contain Letters And Digits.");
    } else
      if (p[0].search(/[A-Z]/) < 0) {
        errors.push("Your userName must start with one upper case letter.");
      } else

        if (p.length < 7) {
          errors.push("Your userName must be at least 8 characters");
        } else
          if (p.length > 32) {
            errors.push("Your userName must be at max 32 characters");
          } else


            if (p.search(/[0-9]/) < 0) {
              errors.push("Your userName must contain at least one digit.");
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
    <div className="App">

      <nav role="navigation" class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">

          <div class="navbar-header">
            <a href="#" class="navbar-brand"><b>Sasa</b></a>
            <button type="button" class="btn btn-danger btn-xs"
              id="status">Login</button>
          </div>
        </div>
      </nav>


      <div class="container">
        <div class="page-header">
          <br></br>
          <h2>Sasa Online Compiler</h2>
        </div>
      </div>
      <div class="container-fluid info-display">
        <h4><sub><mark id="userNameStatus">Create Unique User Name.</mark></sub><sub><b>Note:</b><code>Program Class Name* Should Be Same As UserName*</code></sub></h4>



        <label>UserName:</label>
        <input 
        defaultValue={userName}
        onChange={(e) => {
          const button = document.getElementById('submit');
          if (validatePassword(e.target.value)) { button.disabled = false; setUserName(e.target.value); } else button.disabled = true;
      
        }}></input>
        <a class="btn btn-warning btn-sm" onClick={setDefaultLanguage}>Set This Code As Default</a>

        <label>Language:</label>
        <select
          value={language}

          onChange={(e) => {
            const shouldSwitch = window.confirm(
              "Are you sure you want to change language? WARNING: Your current code will be lost."
            );
            if (shouldSwitch) {
              setLanguage(e.target.value);
            }
          }}
        >

          <option value="cpp">C++</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
        </select>



      </div>
      <br />

      <br />


      <div class="panel panel-default">
        <div class="panel-heading">
          <strong>JobId</strong> : {jobId}
          <br />
          <strong>Status : </strong>{status}
          <br />
          <strong>{renderTimeDetails()}</strong>
        </div>

        <div class="panel-body">
          <div class="row">
            <div class="col-sm-6 col-md-8 col-lg-8">
              <AceEditor
                mode="python"
                theme="monokai"
                fontSize={16}
                onChange={onChange}
                value={code}
                width="100%"
                height="500px"
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}

                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 4,
                }}
                name="UNIQUE_ID_OF_DIV"
                
              />
            </div>


            <div class="col-sm-6 col-md-3 col-lg-4">
              <textarea
                class="output"
                rows="24"
                cols="41"
                value={output}
              ></textarea>


            </div>

          </div>
        </div>
        <div class="panel-footer">
          
            <button id="submit" onClick={handleSubmit} class="btn btn-success btn-sm" >Run</button>

          


        </div>
      </div>



    </div>
  );
}

export default App;
