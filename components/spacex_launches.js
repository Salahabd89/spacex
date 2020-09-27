import * as d3 from "d3";
import {
  select,
  csv,
  scaleLinear,
  scaleTime,
  extent,
  axisLeft,
  axisBottom,
  line,
  curveBasis,
} from "d3";
import { set } from "lodash";

import react, { useState, useEffect, useRef } from "react";

function Launches(props) {
  const ref = useRef(null);
  const [newdata, setData] = useState([]);
  const createTimeSeries = ({ datad, dateFormat, title }) => {
    let dateformat1 = "";
    let dateformat2 = "";
    let months = "";

    if (dateFormat == "year") {
      dateformat1 = "%Y";
      dateformat2 = "%Y";
      months = "12";
    } else {
      dateformat1 = "%Y-%m";
      dateformat2 = "%B %y";
      months = "1";
    }

    var parseTime = d3.timeParse(dateformat1);

    let svg = ref.current;

    let data = datad;

    var margin = { top: 20, right: 20, bottom: 30, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var maxYValue =
      d3.max(data, function (d) {
        return Math.round(d.value);
      }) + 2;

    // set the ranges
    var x = d3.scaleTime().rangeRound([margin.left, width - margin.right]);
    var y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.value))
      .range([height, 0])
      .nice();

    // define the line
    var valueline = d3
      .line()

      .curve(d3.curveLinear)
      .x(function (d) {
        return x(parseTime(d.dates));
      })
      .y(function (d) {
        return y(+d.value);
      });

    var chart = d3
      .select(svg)
      .append("svg")
      .attr("viewBox", `0 0 1300 600`)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(
      d3.extent(data, function (d) {
        return parseTime(d.dates);
      })
    );

    y.domain([
      0,
      d3.max(data, function (d) {
        return Math.round(+d.value);
      }) + 2,
    ]);

    // Add the scatterplot

    chart
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#4063b4")
      .attr("stroke-width", 4)
      .attr("d", valueline);

    chart
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeMonth.every(months))
          .tickFormat(d3.timeFormat(dateformat2))
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "1.5em")
      .attr("fill", "White")
      .attr("transform", "rotate(0)");

    chart
      .append("line")
      .classed("connecting-line", true)
      .attr("y1", height + 0.5)
      .attr("y2", height + 0.5)
      .attr("x1", 0)
      .attr("x2", 70)
      .style("stroke", "White");

    chart
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 60) + ")"
      )
      .style("text-anchor", "middle")
      .attr("fill", "White")
      .text("Period");

    chart.append("g").call(
      d3
        .axisLeft(y)
        .tickValues(d3.range(0, maxYValue + 1, 1))
        .tickFormat(d3.format("d"))
    );

    d3.selectAll("g").style("stroke", "White");
    d3.selectAll("g").attr("color", "White");

    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .attr("fill", "White")
      .text("# of Launches");

    chart
      .append("text")
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("stroke", "White")
      .attr("fill", "White")
      .text(title);

    // Define the div for the tooltip
    /*  var div = d3
      .select("g")
      .append("rect")
      .attr("class", "tooltip")
      .style("opacity", 1);
    // Add the scatterplot
    // Add the scatterplot
    chart
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", function (d) {
        return x(d.dates);
      })
      .attr("cy", function (d) {
        return y(+d.value);
      })
      .on("mouseover", function (d) {
        div.transition().duration(200).style("opacity", 0.9);
        div
          .html(parseTime(d.dates) + "<br/>" + d.value)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        div.transition().duration(500).style("opacity", 0);
      });*/
  };

  useEffect(() => {
    if (props.datad.length > 0) {
      createTimeSeries(props);
    }
  }, [props.datad, ref]);

  return <div ref={ref} />;
}

export default Launches;
