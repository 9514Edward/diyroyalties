import * as ReactDOM from "react-dom"
import React, { useState, useEffect } from "react";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { requiredValidator } from "./validators";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { diySaveDefaults }  from './../graphql/mutations';
import { 
  Input 
} from "@progress/kendo-react-inputs";
import {
  Form,
  Field,
  FormElement,
  FieldWrapper,
  Checkbox,
  ColorPicker,
  Switch

} from "@progress/kendo-react-form";
import { FormCheckbox, FormDatePicker, FormRadioGroup } from "./Form-Components";

import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Fade } from "@progress/kendo-react-animation";




import {
  IntlProvider,
  load,
  LocalizationProvider,
  loadMessages,
  IntlService,
} from "@progress/kendo-react-intl";

import { process } from "@progress/kendo-data-query";


//Use the concept of code splitting if this page gets too big.

class EditDefaults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdowns: [],
	    defaults: [],
      clientid: "",
      success: false,
      error: false,
    };




   

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dropdowns = props.data.dropdowns;
    this.defaults = props.data.defaults;
    this.clientid = props.data.clientid;
 

    this.Frequencies = [];
    this.Frequency = {};
    this.DDTypes = [];
    this.DDType = {};
    this.LTE = {};
    this.LTEs = [];
    
    for (var key in this.dropdowns) {
        if(this.dropdowns[key].category === "Frequency")
        {
           this.Frequency =  this.dropdowns[key].label;
           this.Frequencies.push(this.Frequency);
        }
        if(this.dropdowns[key].category === "Type")
        {
          this.DDType =  this.dropdowns[key].label;
           this.DDTypes.push(this.DDType);
        }    
        if(this.dropdowns[key].category === "YN")
        {
          if( this.dropdowns[key].label == "Y")
            this.LTE =  {label: "Sales at a discount of less than or equal to cuttoff get the rate (more $ for payee)", value: "Y"};
          if( this.dropdowns[key].label == "N")
             this.LTE =  {label: "Sales at a discount of less than cuttoff get the rate", value: "N"};
          this.LTEs.push(this.LTE);
        }        
    }
    
  }



  componentDidMount() {
   this.setState({ddtype : this.defaults[0][0].Type, frequency: this.defaults[0][0].Frequency, lte: this.defaults[0][0].LTE, clientid: this.clientid })
  }



  handleSubmit = async(dataItem) =>  {  
    try {
      document.body.classList.add('busy-cursor');
      var result = null;
      var data = await API.graphql(
        graphqlOperation(diySaveDefaults, {
          input: {
            clientid: this.state.clientid,
            frequency: this.state.frequency,
            ddtype: this.state.ddtype,
            lte: this.state.lte
          },
          result
        })
      );
      document.body.classList.remove('busy-cursor');
      this.setState({ success: true });
      } catch (err) {
        console.log(err);
        this.setState({ error: true });
        document.body.classList.remove('busy-cursor');
      };

  }

  handleChange(event) {
    
    if(event.target.name == "Type")
      this.setState({ ddtype : event.value });
      if(event.target.name == "Frequency")
      this.setState({ frequency : event.value });
      if(event.target.element.innerHTML.includes("LTE") )
      {
        if(event.value == "N")
             this.setState({ lte : "N" });   
        else
          this.setState({ lte : "Y" });   
      }

  }
  

  render() {
    const {
      hasContent,
    } = this.state;

 


    return (
      <Form
      onSubmit={this.handleSubmit}
      //setState={setSelectedOptions}
      initialValues={{
        LTE: this.defaults[0][0].LTE,
        Frequency: this.defaults[0][0].Frequency,
        Type: this.defaults[0][0].Type

      }}
      render={( formRenderProps, allowSubmit, reset, submitting, pristine, values, valid, state) => (
        <FormElement  style={{ maxWidth: 500, margin:"1%" }}>
          <fieldset className={"k-form-field-wrap"}>
          <Field
                name={"LTE"}
                component={Input}
                ref={"LTE"}
                type={"radio"}
                label={"Less than or equal to"}
                hint={"Sales at a discount of less than or equal to the cuttoff will result in higher payment to contributor."}
                component={FormRadioGroup}
                onChange={this.handleChange}
                data={this.LTEs}


          />
          <DropDownList
                name={"Frequency"}
                component={Input}
                label={"Statement Frequency"}
                hint={"Default value for the frequency of statements"}
                onChange={this.handleChange}
                data={this.Frequencies}
                value={this.state.frequency}


          />

          <DropDownList
                name={"Type"}
                component={Input}
                label={"Type"}
                hint={"Payments to be based on..."}
                onChange={this.handleChange}
                data={this.DDTypes}
                value={this.state.ddtype}

          />
<div className="k-form-buttons">
          <Button
              className="k-button  k-primary"
              type="button"
              onClick={this.handleSubmit}
             // disabled={!formRenderProps.allowSubmit}
          >
            Save
         </Button>
</div>
</fieldset>

      <NotificationGroup
      style={{
        bottom: 0,
        right: "50%",
        alignItems: "flex-start",
        flexWrap: "wrap-reverse",
      }}
    >
      <Fade>
        {this.state.success && (
          <Notification
            type={{
              style: "success",
              icon: true,
            }}
            closable={true}
            onClose={setTimeout(() => {
              this.setState({ success: false });
            }, 3000) }
          >
            <span>Your data has been saved.</span>
          </Notification>
        )}
      </Fade>
      <Fade>
        {this.state.error && (
          <Notification
            type={{
              style: "error",
              icon: true,
            }}
            closable={true}
            onClose={setTimeout(() => {
              this.setState({ error: false });
            }, 3000) }
          >
            <span>Error saving data.</span>
          </Notification>
        )}
      </Fade>
    </NotificationGroup>    
    </FormElement>    
      )}
    />

    

    );
  };
  
}
export default EditDefaults;
