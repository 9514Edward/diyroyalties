
import React from 'react'
import '@progress/kendo-theme-default/dist/all.css';
import './App.css';
import { Auth } from 'aws-amplify'
import { AppBar, AppBarSection, AppBarSpacer, Avatar } from '@progress/kendo-react-layout';


let kendokaAvatar = 'https://www.telerik.com/kendo-react-ui-develop/images/kendoka-react.png';



class Public extends React.Component {
  

  getUser = async () => {

    let _Auth = Auth;
    _Auth
      .currentAuthenticatedUser()
      .then((user) => {
        this.setState({ username: user.username });
        this.props.history.replace('/protected');
       
      }
      )
      .catch((err) => console.log(err));
  };



  componentDidMount()  {
    let _Auth = Auth;
    this.getUser();
  
  }


  render() {
   // const [positionMode, setPositionMode] = React.useState("static");
    const modes = ["static", "sticky", "fixed"];
  

    const handleChange = e => {
    //    setPositionMode(e.target.value);
    }




    return (
        <React.Fragment>
          <AppBar>
            <AppBarSection>
              <button className="k-button k-button-clear">
                <span className="k-icon k-i-menu" />
              </button>
            </AppBarSection>
  
            <AppBarSpacer style={{ width: 4 }} />
  
            <AppBarSection>
              <h1 className="title">Royalty Run</h1>
            </AppBarSection>
  
            <AppBarSpacer style={{ width: 32 }} />
  
            <AppBarSection>
              <ul>
                <li><span>What's New</span></li>
                <li><span>About</span></li>
                <li><span><a href="/Protected">Sign In</a></span></li>
                
              </ul>
            </AppBarSection>
  
            <AppBarSpacer />
  

  
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
      );
};

};


export default Public


