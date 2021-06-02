import React, { useState, useEffect } from "react";

// Step 2 - Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Step 3 - Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Step 4 - Include the chart type
import Column3D from "fusioncharts/fusioncharts.charts";

// Step 5 - Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Step 6 - Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Column3D, FusionTheme);

const buildChartData = (data, casesType) => {
  console.log(casesType);
  let chartData = [];
  // let i = 0;
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      //returning object
      let newDataPoint = {
        label: date,
        value: data[casesType][date] - lastDataPoint, //getting the case difference between previous date and current date.
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date]; //previous date
    // console.log(lastDataPoint, (i += 1));
  }
  // console.log(chartData);
  return chartData;
};

function LineGraph({ casesType }) {
  console.log(casesType);
  const [data, setData] = useState([]);
  // console.log(data);
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=100")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let chartData = buildChartData(data, casesType);
        // console.log(chartData);

        setData(chartData);
      });
  }, [casesType]);

  //Create a JSON object to store the chart configurations

  const chartConfigs = {
    type: "column3d", // The chart type
    width: "100%", // Width of the chart
    height: "300", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        caption: "Corona stats for the last 100 days", //Set the chart caption
        captionFont: "Arial",
        captionFontSize: "18",
        useRoundEdges: "1",
        labelAlpha: "70",
        captionFontBold: "1",
        yAxisValueFont: "verdana,sans",
        xAxisValueFont: "verdana,sans",
        yAxisValueFontSize: "10px",
        xAxisValueFontSize: "10px",
        xAxisValueFontColor: "#ff0000",
        yAxisValueFontColor: "#ff0000",
        yAxisValueFontBold: "1",
        yAxisValueFontItalic: "1",
        yAxisValueAlpha: "50",
        xAxisNameFontColor: "#000",
        yAxisNameFontColor: "#000",
        xAxisName: "Date", //Set the x-axis name
        yAxisName: "Cases", //Set the y-axis name
        showBorder: "1",
        theme: "fusion", //Set the theme for your chart
      },
      // Chart Data - from step 2
      data,
    },
  };

  return (
    <div className="lineGraph">
      {data?.length > 0 && <ReactFC {...chartConfigs} />}
    </div>
  );
}

export default LineGraph;
