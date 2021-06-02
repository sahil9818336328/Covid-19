import React from "react";
import "../css/infobox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

// CORONA STATS
const InfoBox = ({
  title,
  cases,
  total,
  active,
  isRed,
  isLightRed,
  ...props
}) => {
  return (
    <Card
      className={`infoBox ${active && isRed ? "infoBox--red" : ""} 
        ${active && !isRed ? "infoBox--selected" : ""} ${
        active && isLightRed ? "infoBox--dark" : ""
      }
`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title} <span className="infoBox__today">today</span>
        </Typography>

        <h2 className={`infoBox__cases `}>{cases}</h2>

        <Typography className="infoBox__total" color="textSecondary">
          <span className="infoBox__total">Total</span> : {total}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
