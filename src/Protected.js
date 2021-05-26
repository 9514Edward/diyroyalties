import React, { useEffect } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { withRouter } from "react-router-dom";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import '@progress/kendo-theme-default/dist/all.css';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import './App.css';
import { AppBar, AppBarSection, AppBarSpacer, Avatar, BottomNavigation } from '@progress/kendo-react-layout';
import { diyGetRoy }  from './graphql/mutations';
import { diyGetRoyDetails }  from './graphql/mutations';
import { diyGetDefaults }  from './graphql/mutations';
import { diyGetDropdowns }  from './graphql/mutations';
import  MultiSelectAll from './components/MultiSelectAll';
import  EditGrid from './components/EditGrid';
import  EditDefaults from './components/EditDefaults';
import { Window } from '@progress/kendo-react-dialogs';

let kendokaAvatar = 'https://www.telerik.com/kendo-react-ui-develop/images/kendoka-react.png';





class Protected extends React.Component {
      constructor(props) {
        super(props);
        this.windowRef = React.createRef();
        this.submitRef = React.createRef();
        this.state = {
          result: "No results yet",
          statements: "",
          statementsettings: "",
          dropdowns: "",
          defaults: "",
          selectedOptions: [],
          visible: true,
          events: [],
          windowRef: this.windowRef
          
        };



      };
    


      getUser = async () => {

        let _Auth = Auth;
        _Auth
          .currentAuthenticatedUser()
          .then((user) => {
            this.setState({ username: user.username });
            this.props.history.push('/protected')
          }
          )
          .catch((err) => console.log(err));
      };
    

      signOut = async() =>  {
        await Auth.signOut();

        this.props.history.push("/home");

      }

      editDefaults  = async() => {

        var clientId = '18c67da7-a451-11';
        this.setState({ clientid: clientId });
        var result;
        try {
    
          var data = await API.graphql(
            graphqlOperation(diyGetDefaults, {
              input: {
                clientId: clientId
              },
              result
            })
          );
          this.setState({ result: "success!" });
          var obj = data.data.diyGetDefaults.toString().replace('{defaults=','').replace('}','');;
          var records = JSON.parse(obj);
          var thisdefault = {
            "label": "All",
            "value": "*"
          };
          var defaults = []
       //   statements.push(statement);
          defaults.thisdefault = thisdefault;
            thisdefault = [{
              "LTE": records[0],
              "Frequency": records[1],
              "Type": records[2],
          }]
          defaults.push(thisdefault);
          this.setState({ defaults:defaults, visible: true });
    
          } catch (err) {
            console.log(err);
          };
        };	


        getDropdowns  = async() => {

          var clientId = '18c67da7-a451-11';
          var result;
          try {
      
            var data = await API.graphql(
              graphqlOperation(diyGetDropdowns, {
                input: {
                  clientId: clientId
                },
                result
              })
            );
            this.setState({ result: "success!" });
            var obj = data.data.diyGetDropdowns.toString().replace('{dropdowns=','').replace('}','');;
            var records = JSON.parse(obj);
            var dropdowns = [];
            var dropdown = {};
              
         //   statements.push(statement);
            dropdowns.dropdown = dropdown;
            for (var key in records) {
              dropdown = {
                "category": records[key][0],
                "label": records[key][2],
                "value": records[key][3]
              }
              dropdowns.push(dropdown);
            }
            this.setState({ dropdowns:dropdowns  });
            } catch (err) {
              console.log(err);
            };
          };


        findStatements  = async() => {
          document.body.classList.add('busy-cursor');
          this.setState({ statementsettings: "" });
          var clientId = '18c67da7-a451-11';
          var search = '*'
          var result;
          try {
      
            var data = await API.graphql(
      
              graphqlOperation(diyGetRoy, {
                input: {
                  clientId: clientId,
                  search: search
                },
                result
              })
            );
            this.setState({ result: "success!" });
            var obj = data.data.diyGetRoy.toString().replace('{body=','').replace('}','');;
            var records = JSON.parse(obj);
            var statement = {
              "label": "All",
              "value": "*"
            };
            var statements = []
         //   statements.push(statement);
            statements.statement = statement;
            for (var key in records) {
              statement = {
                "label": records[key][3],
                "value": records[key][1]
              }
              statements.push(statement);
            }
            this.setState({ statements: statements, visible: true });
      
            } catch (err) {
              console.log(err);
              document.body.classList.remove('busy-cursor');
            };
            document.body.classList.remove('busy-cursor');
          };	
  
          statementSettings  = async() => {
            document.body.classList.add('busy-cursor');
            this.setState({ statements: "" });
            var clientId = '18c67da7-a451-11';
            var search = '*'
            var result;
            try {
        
              var data = await API.graphql(
        
                graphqlOperation(diyGetRoy, {
                  input: {
                    clientId: clientId,
                    search: search
                  },
                  result
                })
              );
              this.setState({ result: "success!" });
              var obj = data.data.diyGetRoy.toString().replace('{body=','').replace('}','');;
              var records = JSON.parse(obj);
              var statementsetting = {
                "label": "All",
                "value": "*"
              };
              var statementsettings = []
           //   statements.push(statement);
              statementsettings.statementsetting = statementsetting;
              for (var key in records) {
                statementsetting = {
                  "label": records[key][3],
                  "value": records[key][1]
                }
                statementsettings.push(statementsetting);
              }
              this.setState({ statementsettings: statementsettings, visible: true });
        
              } catch (err) {
                console.log(err);
                document.body.classList.remove('busy-cursor');
              };
              document.body.classList.remove('busy-cursor');
            };	
    


 
/* BEGIN DIALOG SECTION */
toggleDialog = () => {
  if (this.state.visible) {
      this.setState({
          visible: !this.state.visible
      });
  } else {
      this.setState({
          visible: !this.state.visible
      });
  }
  alert(JSON. stringify(this.state.selectedOptions));

}
runStatements =  async() => {
  var result;
  this.setState({ statementsettings: "" });
  var endDate = "2020-06-30";
  if (this.state.visible) {
      this.setState({
          visible: !this.state.visible
      });
  } else {
      this.setState({
          visible: !this.state.visible
      });
  }
  try {
    var selectedList = this.state.selectedOptions;
    var arrayLength = selectedList.length;
    for (var i = 0; i < arrayLength; i++) {
        console.log(selectedList[i]);
        var data = await API.graphql(
         graphqlOperation(diyGetRoyDetails, {
           input: {
              royToGet: JSON.stringify(this.state.selectedOptions[i]),
              endDate: endDate
           },
           result
         })
       );
       this.setState({ result: "success!" });
       var returnval = data.data.diyGetRoyDetails.toString().replace('{settings=','').replace('}','');
       
       var settings = returnval.split("invoices=")[0].replace('], ', ']');
       var invoices = returnval.split("invoices=")[1].split(", priorsales")[0];
       var priorsales = returnval.split("priorsales=")[1].split(", royaltyrates=")[0];
       var royaltyrates = returnval.split("royaltyrates=")[1].split(", startingpoint=")[0];
       var startingpoint = returnval.split("startingpoint=")[1];
       var settingsJson = JSON.parse(settings);
       var invoicesJson = JSON.parse(invoices);
       var priorsalesJson = JSON.parse(priorsales);
       var royaltyratesJson = JSON.parse(royaltyrates);
       var startingpointJson = JSON.parse(startingpoint);
       alert(startingpointJson);
      }
    } catch (err) {
      console.log(err);
    };
}
/* END DIALOG SECTION */


        componentDidMount()  {
          let _Auth = Auth;
          this.getUser();
          this.getDropdowns();
        
        }
              
    render() {
      // const [positionMode, setPositionMode] = React.useState("static");
       const modes = ["static", "sticky", "fixed"];
       const { match, location, history } = this.props
       const {
        statements,
        statementsettings
      } = this.state;


    return (
        <div>
        <div>
        <React.Fragment>
          <AppBar>
            <AppBarSection>
              <button className="k-button k-button-clear">
                <span className="k-icon k-i-menu" />
              </button>
            </AppBarSection>
  
            <AppBarSpacer style={{ width: 4 }} />
  
            <AppBarSection>
              <h1 className="title">DIY Royalties</h1>
            </AppBarSection>
  
            <AppBarSpacer style={{ width: 32 }} />
  
            <AppBarSection>
              <ul>
                <li><span>What's New</span></li>
                <li><span>About</span></li>
                <li><span><a href="#" onClick={this.editCompany}>Company</a></span></li>
                <li><span><a href="#" onClick={this.statementSettings}>Statement Settings</a></span></li>
                <li><span><a href="#" onClick={this.editDefaults}>Defaults</a></span></li>
                <li><span><a href="#" onClick={this.editTemplates}>Templates</a></span></li>
                <li><span><a href="#" onClick={this.findStatements}>Run</a></span></li>
              </ul>
            </AppBarSection>
  
            <AppBarSpacer />
            <AppBarSection>
              <span className="k-appbar-separator" />
            </AppBarSection> 

            <AppBarSection>
              <ul>
                <li><span><a onClick={this.signOut}>Sign Out</a></span></li>
              </ul>
            </AppBarSection>
            <AppBarSection>
              <span className="k-appbar-separator" />
            </AppBarSection>
  
            <AppBarSection>
              <a href="/profile"><Avatar shape="circle" type="image">
                <img src={kendokaAvatar} />
              </Avatar></a>
            </AppBarSection>
          </AppBar>
          <style>{`
                  body {
                      background: #dfdfdf;
                  }
                  .title {
                      font-size: 18px;
                      margin: 0;
                  }
                  ul {
                      font-size: 14px;
                      list-style-type: none;
                      padding: 0;
                      margin: 0;
                      display: flex;
                  }
                  li {
                      margin: 0 10px;
                  }
                  li:hover {
                      cursor: pointer;
                      color: #84cef1;
                  }
                  .k-button {
                      padding: 0;
                  }
                  .k-badge-container {
                      margin-right: 8px;
                  }
              `}</style>
        </React.Fragment >
        </div>
        <div >



          <blockquote>
        {this.state.statements.length > 0  && this.state.visible &&
        <form ref={this.windowRef} >
              <MultiSelectAll  data={this.state} />
          </form>
        }
       {this.state.statementsettings.length > 0  && this.state.visible &&
        <form ref={this.windowRef} >
            <EditGrid />
              <div className="align-bottom">
                <button type="button" className="k-button" onClick={this.toggleDialog}>Cancel</button>
                <button  type="button" className="k-button k-primary" onClick={this.runStatements}>Submit</button>
              </div>

 
          </form>
        }        
        {this.state.defaults.length > 0  && this.state.visible &&
        <form ref={this.windowRef} >

              <EditDefaults  data={this.state} />
 
          </form>
        }
        

               
        </blockquote>
        </div>

          </div>

      );

    };
  };



export default (withAuthenticator(withRouter(Protected)))