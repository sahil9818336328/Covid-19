import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

// changing colors depending on case type.
const casesTypeColors = {
  cases: {
    hex: "#ff4d4d",
    multiplier: 1000,
  },
  recovered: {
    hex: "#66b366",
    multiplier: 1200,
  },
  deaths: {
    hex: "#b30000",
    multiplier: 2000,
  },
};

// sorting data with highest cases
export const sortData = (data) => {
  let sortedData = [...data];
  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

// formatting number of cases
export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

// display cirle and info for every country..
export const showMapData = (data, casesType) =>
  data.map((country, index) => (
    <Circle
      key={index}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
