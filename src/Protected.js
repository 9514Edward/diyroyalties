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
import  MultiSelectAll from './components/MultiSelectAll';
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

      findStatements  = async() => {
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
          };
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
  try {
    
    var data = await API.graphql(

      graphqlOperation(diyGetRoyDetails, {
        input: {
          royList: this.state.selectedOptions.toString()
        },
        result
      })
    );
    this.setState({ result: "success!" });
    var obj = data.data.diyGetRoyDetails.toString().replace('{body=','').replace('}','');;
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
    };

}
/* END DIALOG SECTION */


        componentDidMount()  {
          let _Auth = Auth;
          this.getUser();
        
        }
              
    render() {
      // const [positionMode, setPositionMode] = React.useState("static");
       const modes = ["static", "sticky", "fixed"];
       const { match, location, history } = this.props
       const {
        statements
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
              <h1 className="title">RoyaltyRun</h1>
            </AppBarSection>
  
            <AppBarSpacer style={{ width: 32 }} />
  
            <AppBarSection>
              <ul>
                <li><span>What's New</span></li>
                <li><span>About</span></li>
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

              <div className="align-bottom">
                <button type="button" className="k-button" onClick={this.toggleDialog}>Cancel</button>
                <button  type="button" className="k-button k-primary" onClick={this.runStatements}>Submit</button>
              </div>

 
          </form>
        }
        
        

               
        </blockquote>
        </div>
          </div>

      );

    };
  };



export default (withAuthenticator(withRouter(Protected)))