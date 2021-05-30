import logo from './logo.svg';
import '@progress/kendo-theme-default/dist/all.css';
import './App.css';
import React from "react";
// Amplify

import { Amplify, API, graphqlOperation } from "aws-amplify";
import aws_exports from './aws-exports';

import { runRoyFunc }  from './graphql/mutations';
import { findStatements }  from './graphql/mutations';
import awsconfig from './aws-exports';

API.configure(awsconfig);



Amplify.configure(aws_exports);



class App extends React.Component {
  
  constructor(props) {

    const initialDataState = {
      skip: 0,
      take: 10,
    };
    





  };


  



  hi = async() => {
    alert('hi');
  }
  
  runRoyalties  = async() => {
    var ISBN = '74942298';
    var result;
    try {

      var pictures = await API.graphql(

        graphqlOperation(runRoyFunc, {
          input: {
            contractId: ISBN
          },
          result
        })
      );
      this.setState({ result: "success!" });
      
      } catch (err) {
        console.log(err);
      };
    };
    findStatements2  = async() => {
      var clientId = '18c67da7-a451-11';
      var search = '*'
      var result;
      try {
  
        var data = await API.graphql(
  
          graphqlOperation(findStatements2, {
            input: {
              clientId: clientId,
              search: search
            },
            result
          })
        );
        this.setState({ result: "success!" });
        var test = 'hi';
        var obj = data.data.findStatements2.toString().replace('{body=','').replace('}','');;
        var records = JSON.parse(obj);
  
        } catch (err) {
          console.log(err);
        };
      };	
	
	
    render() {
      
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
            </a>
            <button onClick={this.findStatements}>Run</button>
            <label>{this.state.result}</label>.
            <label>todo online Review, email button, pay button, load vendors from quickbooks, upload payments to quickbooks???</label>
  
          </header>
        </div>
      );
    }
  }
  
  export default App;
  