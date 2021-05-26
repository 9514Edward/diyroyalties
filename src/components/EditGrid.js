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

//import options from "./data.js";

const EditGrid = (props) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const locales = [
    {
      language: "en-US",
      locale: "en",
    },
    {
      language: "es-ES",
      locale: "es",
    },
  ];
  const [dataState, setDataState] = React.useState({
    skip: 0,
    take: 20,
    sort: [
      {
        field: "orderDate",
        dir: "desc",
      },
    ],
    group: [
      {
        field: "customerID",
      },
    ],
  });
 
  const [currentLocale, setCurrentLocale] = React.useState(locales[0]);
  const [dataResult, setDataResult] = React.useState(
    process(orders, dataState)
  );

  const dataStateChange = (event) => {
    setDataResult(process(orders, event.dataState));
    setDataState(event.dataState);
  };

  const expandChange = (event) => {
    const isExpanded =
      event.dataItem.expanded === undefined
        ? event.dataItem.aggregates
        : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;
    setDataResult({ ...dataResult });
  };
  const handleSubmit = (dataItem) => alert(JSON.stringify(dataItem, null, 2));

  let _pdfExport;

  const exportExcel = () => {
    _export.save();
  };

  let _export;

  const exportPDF = () => {
    _pdfExport.save();
  };
  const LTEData = [
    { label: "Less than or equal to cuttoff (More $ for payee)", value: "phone" },
    { label: "Less than cuttoff (Less $ for payee)", value: "email" },
  ];
  const DetailComponent = (props) => {
    const dataItem = props.dataItem;
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
      onSubmit={handleSubmit}
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
    <LocalizationProvider language={currentLocale.language}>
      <IntlProvider locale={currentLocale.locale}>
        <div>
          <ExcelExport
            data={orders}
            ref={(exporter) => {
              _export = exporter;
            }}
          >

            <Grid
              style={{
                height: "860px"
              }}
              sortable={true}
              filterable={true}
              groupable={true}
              reorderable={true}
              pageable={{
                buttonCount: 4,
                pageSizes: true,
              }}
              data={dataResult}
              {...dataState}
              onDataStateChange={dataStateChange}
              detail={DetailComponent}
              expandField="expanded"
              onExpandChange={expandChange}
            >






              <GridToolbar>
                Locale:&nbsp;&nbsp;&nbsp;
                <DropDownList
                  value={currentLocale}
                  textField="language"
                  onChange={(e) => {
                    setCurrentLocale(e.target.value);
                  }}
                  data={locales}
                />
                &nbsp;&nbsp;&nbsp;
                <button
                  title="Export to Excel"
                  className="k-button k-primary"
                  onClick={exportExcel}
                >
                  Export to Excel
                </button>
                &nbsp;
                <button className="k-button k-primary" onClick={exportPDF}>
                  Export to PDF
                </button>
              </GridToolbar>
              <GridColumn field="Title" width="200px" />
              <GridColumn field="Contributor" width="280px" />
              <GridColumn field="ISBN"  width="800px" />

            </Grid>
          </ExcelExport>
          
          <GridPDFExport
            ref={(element) => {
              _pdfExport = element;
            }}
            margin="1cm"
          >
            {
              <Grid
                data={process(orders, {
                  skip: dataState.skip,
                  take: dataState.take,
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

export default EditGrid;

