import axios from "axios";
import * as d3 from "d3";
import Launches from "../components/spacex_launches";
import Barchart from "../components/rockets";
import react, { useState, useEffect } from "react";
import _ from "lodash";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import AppBar from "@material-ui/core/AppBar";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography colorTextPrimary="red">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function spacex() {
  const [launchbyDate, setLaunchByDate] = useState([]);
  const [launchbyYear, setLaunchByYear] = useState([]);
  const [getrockets, setrockets] = useState([]);
  const [barchtData, setBRdata] = useState([]);
  const [value, setValue] = useState(0);

  const theme = useTheme();

  let data = [];
  let rockets = [];

  let xAxis = "";
  let yAxis = "";

  const [selection, setSelection] = useState(1);
  const [loaded, isLoaded] = useState(false);
  const [labels, setLabels] = useState({ y_label: "", x_label: "" });

  const handleChange = (event) => {
    setSelection(event.target.value);
  };

  function barchartData(value) {
    if (getrockets != null) {
      getrockets.data.map((d, i) => {
        rockets.push({ value: _.get(d, value), category: d.rocket_name });
      });

      setBRdata(
        rockets.sort(function (a, b) {
          if (a.value > b.value) {
            return -1;
          }
          if (b.value > a.value) {
            return 1;
          }
          return 0;
        })
      );
    }
  }

  const getCostPerLaunch = () => {
    xAxis = "Rocket";
    yAxis = "Cost per Launch ($m)";

    setLabels({ y_label: yAxis, x_label: xAxis });

    barchartData("cost_per_launch");
  };

  const getHeight = () => {
    xAxis = "Rocket";
    yAxis = "Height (m)";

    setLabels({ y_label: yAxis, x_label: xAxis });

    barchartData("height.meters");
  };

  const getMass = () => {
    xAxis = "Rocket";
    yAxis = "Mass (kg)";

    setLabels({ y_label: yAxis, x_label: xAxis });

    barchartData("mass.kg");
  };

  const get_launch = async () => {
    await axios
      .get("https://api.spacexdata.com/v3/launches")
      .then(function (response) {
        response.data.map((d, i) => {
          data.push({
            value: d.mission_name,
            dates: d.launch_date_local.substring(0, 7),
            year: d.launch_date_local.substring(0, 4),
            upcoming: d.upcoming,
          });
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    var byDate = _(data)
      .filter(function (d) {
        return d.year === "2020" && d.upcoming === false;
      })
      .groupBy("dates")
      .map(function (items, date) {
        return { dates: date, value: items.length };
      })
      .value();

    var byYear = _(data)
      .filter(function (d) {
        return d.year != "2021" && d.upcoming === false;
      })
      .groupBy("year")
      .map(function (items, date) {
        return { dates: date, value: items.length };
      })
      .value();

    setLaunchByYear(byYear);
    setLaunchByDate(byDate);
  };

  const get_rockets = async () => {
    await axios
      .get("https://api.spacexdata.com/v3/rockets")
      .then(function (response) {
        setrockets(response);
        isLoaded(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    get_launch();
    get_rockets();
  }, []);

  useEffect(() => {
    if (selection == 1 && loaded == true) {
      getCostPerLaunch();
    }

    if (selection == 2 && loaded == true) {
      getHeight();
    }

    if (selection == 3 && loaded == true) {
      getMass();
    }
  }, [selection, loaded]);

  const handleTabChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const useOutlinedInputStyles = makeStyles((theme) => ({
    root: {
      "& $notchedOutline": {
        borderColor: "#a7afb4",
      },
      "&:hover $notchedOutline": {
        borderColor: "#a7afb4",
      },
      "&$focused $notchedOutline": {
        borderColor: "#a7afb4",
      },
    },
    focused: {},
    notchedOutline: {},
  }));

  const outlinedInputClasses = useOutlinedInputStyles();

  const indicatorList = ["#a7afb4"].map((x) =>
    makeStyles((theme) => ({
      indicator: {
        backgroundColor: x,
      },
    }))
  );

  const [selected, setSelected] = useState(0);

  const setTabValue = (idx) => {
    console.log(idx);
    setSelected(idx);
  };

  return (
    <div style={{ backgroundColor: "#1b1b1e" }}>
      <style>{"body { background-color: #1b1b1e; }"}</style>
      <>
        <Tabs
          inkBarStyle={{ background: "blue" }}
          onChange={(e, idx) => setTabValue(idx)}
          classes={{
            indicator: indicatorList[selected]().indicator,
          }}
          value={value}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab
            label={
              value == 0 ? (
                <span style={{ color: "White" }}>Rockets</span>
              ) : (
                <span style={{ color: "gray" }}>Rockets</span>
              )
            }
          />
          <Tab
            label={
              value == 1 ? (
                <span style={{ color: "White" }}>Launches</span>
              ) : (
                <span style={{ color: "gray" }}>Launches</span>
              )
            }
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Grid style={{ marginLeft: "15%" }}>
            <FormControl>
              <Select
                input={
                  <OutlinedInput
                    name="age"
                    id="outlined-age-simple"
                    classes={outlinedInputClasses}
                  />
                }
                style={{
                  borderColor: "White",
                  color: "White",
                  icon: {
                    fill: "White",
                  },
                }}
                variant="outlined"
                value={selection}
                onChange={handleChange}
              >
                <MenuItem value={1}>Cost Per Launch</MenuItem>
                <MenuItem value={2}>Height (m)</MenuItem>
                <MenuItem value={3}>Mass (Kg)</MenuItem>
              </Select>
            </FormControl>
            <Barchart data={barchtData} axisLabels={labels}></Barchart>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid style={{ marginLeft: "15%", marginTop: "5%" }}>
            <Launches
              datad={launchbyDate}
              dateFormat={"yearmonth"}
              title={"SpaceX launches this year (2020)"}
            ></Launches>
          </Grid>
          <Grid style={{ marginLeft: "15%", marginTop: "10%" }}>
            <Launches
              datad={launchbyYear}
              dateFormat={"year"}
              title={"SpaceX launches since inception"}
            ></Launches>
          </Grid>
        </TabPanel>
      </>
    </div>
  );
}
