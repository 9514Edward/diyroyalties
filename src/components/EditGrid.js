import * as ReactDOM from "react-dom"
import React, { useState, useEffect } from "react";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { requiredValidator } from "./validators";
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


import orders from "./orders.json";
import { process } from "@progress/kendo-data-query";
import {
  IntlProvider,
  load,
  LocalizationProvider,
  loadMessages,
  IntlService,
} from "@progress/kendo-react-intl";

const dataState = {
  skip: 0,
  take: 10,
};

const locales = [
  {
      language: 'en-US',
      locale: 'en'
  },
  {
      language: 'es-ES',
      locale: 'es'
  }
]



export class EditGrid extends React.Component {

  


constructor(props) {
    super(props);
    
    var Summaries = [];
    var SummariesArray;
    var SUM = {};
    var Details = [];
    var detail ;
    var title = "";
    var ISBN = "";
    var counter = 1;
    var orderID = "";
    var CustomerID = 0;
    
    
    for (var key in props.data.summary) {
         SUM = { "customerID" : props.data.summary[key][1].toString().trim(),   "Title" :  props.data.summary[key][3].toString().trim(),  "ISBN":  props.data.summary[key][4].toString().trim(),  "orderID": counter.toString(), "details": [{	"SaleType": "Canada",   "IsReservee": true,    "Cuttoff1": 100,  "Rate1": 7.5,  "Cuttoff2": 0,  "Rate2": 0, "Cuttoff3": 0, "Rate4": 0}]};   
           counter ++;
        
         
         Summaries.push(SUM);
         
    }
    var test = JSON.stringify(Summaries);
    var page;
    var filter;

    
    this.state = {
        dataResult: process(Summaries, dataState), 
        Summaries: Summaries,
        orders: orders,
        filter: filter,
        dataState: dataState,
        summary: props.data.summary,
        royaltyrates: props.data.royaltyrates,
        statementsettings: props.data.statementsettings,
        currentLocale: locales[0],
       
    };
    

  }
   
 setPage = (event) => {
   //dataState sets the pager, dataResult pagess the data
   this.setState({ dataState: event, dataResult: process(this.state.Summaries, event) });
    
 }

 setFilter = (event) => {
  //dataState sets the pager, dataResult pagess the data
  this.setState({ dataState: event.dataState, dataResult: process(this.state.Summaries, event.dataState) });
   
}



expandChange = (event) => {
    const isExpanded =
        event.dataItem.expanded === undefined ?
            event.dataItem.aggregates : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;

    this.setState({ ...this.state });
}

_pdfExport
exportExcel = () => {
    this._export.save();
}

_export 
exportPDF = () => {
    this._pdfExport.save();
}




setCurrentLocale = (event) => {
  this.setState({currentLocale: event});

}

pageChange = (event) =>
 {  
   
  this.setPage(event.page);
};
  render() {
    const {
      hasContent,
    } = this.state;

const  DetailComponent = (props) => {
    const dataItem = props.dataItem;

    const [currentLocale, setCurrentLocale] = React.useState(locales[0]);
  
    const [dataResult, setDataResult] = React.useState(
      process(this.state.Summaries, this.state.dataState)
    ); 
    



  function  dataStateChange(event) {
      setDataResult(process(this.state.Summaries, event.dataState));
      this.setDataState(event.dataState);
    };


    const LTEData = [
      { label: "Less than or equal to cuttoff (More $ for payee)", value: "phone" },
      { label: "Less than cuttoff (Less $ for payee)", value: "email" },
    ];



  return (
    <div>
      <section
        style={{
          width: "200px",
          float: "left",
        }}
      > 



      </section>

      <Grid
          style={{
            width: "1000px",
          }}
          data={dataItem.details}
          
        />
        <Form
      onSubmit={this.handleSubmit}
      render={(formRenderProps) => (
        <FormElement  style={{ maxWidth:1200 }}>
          <fieldset className={"k-form-field-wrap"}>
          <table>
          <ul>
            <td width="40%">
          <Field
                name={"checkgte"}
                component={Input}
                type={"radio"}
                label={"Discount Breaks LTE"}
                hint={"Discount breaks less than or equal to will result in higher payment to contributor."}
                component={FormRadioGroup}
                data={LTEData}
              />
</td>
<td width="20%">
              <Field
                name={"PublicationDate"}
                component={Input}
                label={"Pub Date: "}
                hint={"Initial Publication Date"}
                component={FormDatePicker}
                validator={requiredValidator}
              />
</td>
<td width="20%">

              <Field
                name={"FinalStatementDate"}
                component={Input}
                label={"Final Statement Date:"}
                hint={"Last Date of period in which the statement marked as 'Final' is to be generated"}
                component={FormDatePicker}
                validator={requiredValidator}
              />
</td>
<td width="20%">

              <Field
                name={"Advance Paid"}
                component={Input}
                label={"Advance: "}
                hint={"Last date of period in which the advance was earned"}
                component={FormDatePicker}
                validator={requiredValidator}
              />
              </td>
              </ul>
              <ul>
                <td width="25%">
              <Field
                name={"BottomLineMultiplier"}
                component={Input}
                label={"Bottom Line Multiplier: "}
                hint={"Enter a percent multiplier to decrease the payment by."}
              />
</td>
<td width="25%">

              <Field
                name={"BottomLineText"}
                component={Input}
                label={"Bottom Line Multiplier Description: "}
                hint={"Enter an explanation of the bottom line multiplier amount which will appear on the statement"}
              />
</td>
<td width="25%">

              <Field
                name={"MiscAmount"}
                component={Input}
                label={"Misc Amount: "}
                hint={"Enter a one-time amount to add or subtract to the payment."}
              />
</td>
<td width="25%">

              <Field
                name={"MiscAmountDesc"}
                component={Input}
                label={"Misc Amount Description: "}
                hint={"Enter an explanation of the one-time amount which will appear on the statement"}
              />
              </td>
</ul>
</table>
</fieldset>

        </FormElement>
        
     
      )}
    />
      </div>

    );
  };

  return (
    <LocalizationProvider language={this.state.currentLocale.language}>
      <IntlProvider locale={this.state.currentLocale.locale}>
        <div>
          <ExcelExport
            data={this.state.Summaries}
            ref={(exporter) => {
              this._export = exporter;
            }}
          >

            <Grid
              style={{
                height: "860px"
              }}
              sortable={true}
              filterable={true}
              filter={this.state.filter}
              onDataStateChange={(e) => this.setFilter(e)}
              groupable={true}
              reorderable={true}
              pageable={{
                buttonCount: 4,
                pageSizes: true,
              }}
              data={this.state.dataResult}
              {...this.state.dataState}
              
              detail={DetailComponent}
              expandField="expanded"
              onExpandChange={this.expandChange}
              total={this.state.Summaries.length}
              
              onPageChange={this.pageChange}
            >

              <GridToolbar>
                Locale:&nbsp;&nbsp;&nbsp;
                <DropDownList
                  value={this.currentLocale}
                  textField="language"
                  onChange={(e) => {
                    this.setCurrentLocale(e.target.value);
                  }}
                  data={this.locales}
                />
                &nbsp;&nbsp;&nbsp;
                <button
                  title="Export to Excel"
                  className="k-button k-primary"
                  onClick={this.exportExcel}
                >
                  Export to Excel
                </button>
                &nbsp;
                <button className="k-button k-primary" onClick={this.exportPDF}>
                  Export to PDF
                </button>
              </GridToolbar>
              
              <GridColumn field="ISBN"  width="200px" />
              <GridColumn field="Contributor" width="280px" />
              <GridColumn field="Title" width="800px" />

            </Grid>
          </ExcelExport>
          
          <GridPDFExport
            ref={(element) => {
              this._pdfExport = element;
            }}
            margin="1cm"
          >
            {
              <Grid
                data={process(this.state.Summaries, {
                  skip: this.state.dataState.skip,
                  take: this.state.dataState.take,
                })}
              >
                <GridColumn field="customerID" width="200px" />
                <GridColumn
                  field="orderDate"
                  filter="date"
                  format="{0:D}"
                  width="300px"
                />
               </Grid>
            }
          </GridPDFExport>

        </div>
      </IntlProvider>
    </LocalizationProvider>
  );
};
}
export default EditGrid;