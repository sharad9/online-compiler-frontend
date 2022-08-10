import axios from "axios";
import "./App.css";
import stubs from "./stubs";
import React, { useState, useEffect } from "react";
import moment from "moment";
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import $ from 'jquery';
import Popper from 'popper.js';

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  let pollInterval;

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
    };
    try {
      setOutput("");
      setStatus(null);
      setJobId(null);
      setJobDetails(null);
      const { data } = await axios.post("https://sasa-online-compiler.herokuapp.com/run", payload);
      if (data.jobId) {
        setJobId(data.jobId);
        setStatus("Submitted.");

        // poll here
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `https://sasa-online-compiler.herokuapp.com/status`,
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
      <div class="container-fluid">
        <a class="btn btn-warning btn-sm" onClick={setDefaultLanguage}>Set Default</a>
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
          <div class="container-fluid">
        
              <textarea
                rows="20"
                cols="65"
                value={code}

                onChange={(e) => {
                  setCode(e.target.value);
                }}
              ></textarea>
            
              <textarea
                rows="20"
                cols="35"
                value={output}
              ></textarea>

            
          </div>
        </div>
        <div class="panel-footer">
          <a onClick={handleSubmit} class="btn btn-success btn-sm">Submit</a>

        </div>
      </div>



    </div>
  );
}

export default App;
