import * as d3 from "d3";
import react, { useState, useEffect, useRef } from "react";

function Barchart(props) {
  const ref = useRef(null);

  const createBarChart = (props) => {
    let svg = ref.current;

    let data = props.data;

    d3.selectAll("svg").remove();

    var margin = { top: 20, right: 20, bottom: 30, left: 120 },
      width = 1200 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.5),
      y = d3.scaleLinear().rangeRound([height, 0]);

    data.forEach(function (d) {
      d.category = d.category;
      d.value = +d.value;
    });

    var chart = d3
      .select(svg)
      .append("svg")
      .attr("viewBox", `0 0 1400 600`)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 60) + ")"
      )
      .attr("fill", "White")
      .text("Rockets");

    x.domain(data.map((d) => d.category));
    y.domain([
      0,
      d3.max(data, function (d) {
        return +d.value;
      }) +
        d3.max(data, function (d) {
          return +d.value;
        }) *
          0.05,
    ]);

    chart
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", "12px")
      .attr("color", "White")
      .call(d3.axisBottom(x));

    chart
      .append("g")
      .style("font-size", "12px")
      .attr("color", "White")
      .call(d3.axisLeft(y));

    chart
      .selectAll("body")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.category);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(d.value);
      })
      .attr("fill", "#4063b4");

    chart
      .selectAll("body")
      .data(data)
      .enter()
      .append("text")
      .text(function (d) {
        let format = d3.format(",");
        return format(d.value);
      })
      .attr("x", function (d) {
        return x(d.category) + x.bandwidth() / 2;
      })
      .attr("y", function (d) {
        return y(d.value) - 5;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .attr("fill", "White")
      .attr("text-anchor", "middle");

    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 4)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("fill", "White")
      .text(props.axisLabels.y_label);
  };

  useEffect(() => {
    if (props.data.length > 0) {
      createBarChart(props);
    }
  }, [props.data, ref]);

  return <div ref={ref} />;
}

export default Barchart;

/*

.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
*/
