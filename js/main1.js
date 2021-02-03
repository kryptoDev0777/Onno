// ops:flp:d3
'use strict';
(function () {

    let jsonData = {
        "Pump": [
            {
                "Type": "Water",
                "Value": "10",
                "Start": "21/12/2020 15:20:00",
                "End": "23/12/2020 15:25:00"
            },
            {
                "Type": "SaltWater",
                "Value": "5",
                "Start": "23/12/2020 15:20:00",
                "End": "23/12/2020 15:25:00"
            }
        ],
        "Environment": [
            {
                "Type": "o2",
                "Value": "4",
                "Start": "12/23/2020 13:00:00", // supported format MM/DD/yy or yy/MM/DD
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "o2",
                "Value": "4",
                "Start": "12/23/2020 13:02:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "o2",
                "Value": "4",
                "Start": "12/23/2020 18:59:00",
                "End": "2020/12/23 23:25:00"
            },
            {
                "Type": "o2",
                "Value": "4",
                "Start": "12/23/2020 19:00:00",
                "End": "2020/12/23 23:25:00"
            },
            {
                "Type": "co2",
                "Value": "0",
                "Start": "12/23/2020 13:00:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "co2",
                "Value": "0",
                "Start": "12/23/2020 16:00:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "co2",
                "Value": "1",
                "Start": "12/23/2020 16:01:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "co2",
                "Value": "1",
                "Start": "12/23/2020 17:00:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "co2",
                "Value": "0",
                "Start": "12/23/2020 17:01:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "co2",
                "Value": "0",
                "Start": "12/23/2020 19:00:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "n2",
                "Value": "0",
                "Start": "12/23/2020 13:00:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "n2",
                "Value": "10",
                "Start": "12/23/2020 13:05:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "n2",
                "Value": "10",
                "Start": "12/23/2020 19:00:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "humidity",
                "Value": "30",
                "Start": "12/23/2020 13:00:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "humidity",
                "Value": "55",
                "Start": "12/23/2020 13:10:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "humidity",
                "Value": "55",
                "Start": "12/23/2020 19:00:00",
                "End": "23/12/2020 23:25:00"
            },
            {
                "Type": "temperature",
                "Value": "35",
                "Start": "12/23/2020 13:00:00",
                "End": "2020/12/23 23:25:00"
            },
            {
                "Type": "temperature",
                "Value": "37",
                "Start": "12/23/2020 13:03:00",
                "End": "2020/12/23 23:25:00"
            },
            {
                "Type": "temperature",
                "Value": "37",
                "Start": "12/23/2020 19:00:00",
                "End": "2020/12/23 23:25:00"
            }
        ],
        "Images": [
            {
                "Name": "img-1",
                "DateTime": "23/12/2020 16:20:00"
            },
            {
                "Name": "img-2",
                "DateTime": "23/12/2020 16:20:30"
            },
            {
                "Name": "img-3",
                "DateTime": "23/12/2020 22:20:00"
            },
            {
                "Name": "img-4",
                "DateTime": "23/12/2020 22:20:30"
            }
        ],
        "Functions": [
            {
                "Name":"Count number of cells",
                "DateTime": "23/12/2020 16:20:00"
            },
            {
                "Name":"Cell size",
                "DateTime": "23/12/2020 16:20:30"
            },
            {
                "Name":"Count number of alive and dead cells",
                "DateTime": "23/12/2020 22:20:00"
            },
            {
                "Name":"Count number of cells",
                "DateTime": "23/12/2020 22:20:30"
            },
            {
                "Name":"Count number of cells",
                "DateTime": "23/12/2020 22:20:00"
            },
        ]
    };

    let o2Data = loadDataBytype('Environment', 'o2'),
    co2Data = loadDataBytype('Environment', 'co2'),
    n2Data = loadDataBytype('Environment', 'n2'),
    humidityData = loadDataBytype('Environment', 'humidity'),
    temperatureData = loadDataBytype('Environment', 'temperature');

    window.setTimeout(() => {
        createGraph();
        setFuncName();
    }, 100);
    window.addEventListener("resize", function () {
        d3.select("#svgArea").html('');
        createGraph();
    });
// function section
// jquery function section
    function setFuncName()
    {
        $('.funcBox').each(function() {
            let alt = $(this).attr('alt').replace(/[^0-9.]/g, ''),
            con = jsonData.Functions[alt-1].Name;
            $(this).find(".funct-text").text(con);
        })
    }
// d3js function section
    function loadDataBytype(jsonType, type) {
        if (jsonData[jsonType] && jsonData[jsonType].length) {
            let _data = jsonData[jsonType].filter((_type) => _type['Type'] === type);
 
            return _data;
        }
    }
    function createGraph() {

        let svgArea = document.getElementById("svgArea"),
            idWidth = svgArea.offsetWidth,
            idHeight = svgArea.offsetHeight,
            padd = {
                top: 25,
                right: 20,
                bottom: 0,
                left: 35
            },
            space = 20,
            rest = 380,  // imageSection + funcsection+pumsection(css top value) = 356px;
            totalHeight = 600,
            svgWidth = idWidth - padd.right - padd.left,
            svgHeight = idHeight - padd.top - padd.bottom;
        // Set the ranges
        let x = d3.scaleTime().range([0, svgWidth]);
        let y = d3.scaleLinear().range([(totalHeight) / 5 - space, 0]);
        var tran = { k: 1, x: 0, y: 0 };
        temperatureData.forEach(function (d) {
            d.date = new Date(d.Start);
            d.value = +d.Value;
        });
        x.domain(d3.extent(temperatureData, (d) => d.date));
        let temperatureX = d3.extent(temperatureData, (d) => d.date);
        let temperatureX1 = temperatureX[0].getTime(),
            temperatureX2 = temperatureX[1].getTime(),
            temperatureXX = temperatureX2 - temperatureX1;
        // Define the axes
        let xAxis = d3.axisTop(x).ticks(10);
        let focusData;
        window.setTimeout(() => {
            createSpecificGraph(o2Data, 'red', 0);
            createSpecificGraph(co2Data, 'green', 1);
            createSpecificGraph(n2Data, 'rgb(210, 105, 30)', 2);
            createSpecificGraph(humidityData, 'blue', 3);
            createSpecificGraph(temperatureData, 'Maroon', 4);
        }, 500);

        let valueline = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.value);
            });
        let linePath, yAxisGroup, yAxis, iii = 0, diff;
        var yAxisGroup_array = [];
        let bisectDate = d3.bisector(function (d) { return d.date; }).left;
     
        // Adds the svg
        let svg = d3.select("#svgArea")
            .append("svg")
            .attr("width", idWidth)
            .attr("height", idHeight)
            .append("g")
            // .on("mouseover", function () { focus.style("display", "none"); })
            // .on("mouseout", function () { focus.style("display", "none"); })
            .on("mousemove", mousemoveFunc);

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", idWidth)
            .attr("height", idHeight);

        // Add the X Axis
        let xAxisGroup = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + padd.left + "," + padd.top + ")")
            .call(xAxis);

        // add the X gridlines
        let xGrid = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + padd.left + "," + svgHeight + ")")
            .call(make_x_gridlines()
                .tickSize(idHeight)
                .tickFormat("")
            );
        d3.select(".grid path").remove();
        // add sum elements
        let sum = svg.append("g")
            .attr("class", "sum");

        svg.append("rect")
            .attr("class", "overlayLeft")
            .attr("y", rest-5)
            .attr("width", 35)
            .attr("height", idHeight - rest)
            .attr("fill", "white");
        // tooltip
        let focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none")
        focus.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 5)
            .attr("stroke-width", "1")
            .attr("stroke", "red");

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 80)
            .attr("height", 40)
            .attr("x", -40)
            .attr("y", -20)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-date")
            .attr("x", -35)
            .attr("y", -5);

        focus.append("text")
            .attr("x", -35)
            .attr("y", 10)
            .text("Value:");

        focus.append("text")
            .attr("class", "tooltip-value")
            .attr("x", 5)
            .attr("y", 10);

        d3.selectAll(".svgMoved").selectAll('.ccc1')
            .style('width', (svgWidth / 6 - 20) + "px");
        d3.selectAll(".svgMoved").selectAll('.pumpMiddleSec')
        .style('width',(svgWidth - svgWidth / 3) + "px");
        //add zoom
        let zoom = d3.zoom()
            .scaleExtent([0.25, 10])// less than 1 means can resize smaller than  original size
            .translateExtent([[-svgWidth, svgHeight], [2 * svgWidth, 0]])
            .on("zoom", zoomed);
        // .on("wheel", function() { d3.event.preventDefault(); });

        function zoomed() {
            // sum.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y +")");
            // sum.attr("transform", d3.event.transform);
            tran = d3.event.transform;
            var transform = d3.event.transform;
            diff = padd.left * (transform.k - 1);
            var transformString = 'translate(' + (transform.x - diff) + ',' + '0) scale(' + transform.k + ',1)';
            // var transformString = 'translate(' + transform.x + ',' + '0)';
            sum.attr("transform", transformString);

            // linePath.attr("transform", d3.event.transform);//move bar chart because we dont want to change the tick scale
            xAxisGroup.call(xAxis.scale(d3.event.transform.rescaleX(x)));//rescaleX - change the xScale domain with the transforming info
            xGrid.call(d3.axisTop(x).ticks(10).scale(d3.event.transform.rescaleX(x))
                .tickSize(svgHeight)
                .tickFormat("")
            );
            // matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())
            d3.selectAll(".svgMoved").selectAll(".ccc1").style("transform", "matrix(" + 1 + ", 0, 0," + 1 + "," + transform.x + "," + 0 + ")");
            d3.selectAll(".svgMoved").selectAll(".pumpMiddleSec").style("transform","matrix("+1+",0,0,"+1+"," + transform.x + "," + 0 + ")");
            d3.select(".grid path").remove();
        }
        function createSpecificGraph(data, col, nn) {

            // Get the data
            data.forEach(function (d) {
                d.date = new Date(d.Start);
                d.value = +d.Value;
            });
            // Scale the range of the data
            let VX = d3.extent(data, (d) => d.date);
            let VX1 = VX[0].getTime(),
                VX2 = VX[1].getTime(),
                VXX = VX2 - VX1,
                pp = VXX / temperatureXX;
            x = d3.scaleTime().range([0, svgWidth * pp]);
            x.domain(d3.extent(data, (d) => d.date));
            var minValue = d3.min(data, (d) => d.value);
            var maxValue = d3.max(data, (d) => d.value);
            if(minValue == maxValue)
            {
                minValue--;
                maxValue++; 
            }
            y.domain([minValue, maxValue]);

            yAxis = d3.axisLeft(y).ticks(10);
            let yAxisRight = d3.axisRight(y).ticks(10);

            yAxisGroup = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + padd.left + "," + (rest + (totalHeight / 5) * nn) + ")")
                .call(yAxis);
            // add the Y gridlines
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(" + padd.left + "," + (rest + (totalHeight / 5) * nn) + ")")
                .call(make_y_gridlines()
                    .tickSize(-svgWidth)
                    .tickFormat("")
                );
            iii++;
            yAxisGroup_array[iii] = yAxisGroup
            d3.select(".grid path").remove();
            // Add the valueline path.
            linePath = sum.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", valueline)
                .attr("stroke", col)
                .attr("transform", "translate(" + padd.left + "," + (rest + (totalHeight / 5) * nn) + ")")
                .style("cursor","pointer")
                .on("click", environmentModal);
        }
        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisTop(x).ticks(5);
        }

        // gridlines in y axis function
        function make_y_gridlines() {
            return d3.axisLeft(y).ticks(10);
        }
        function mousemoveFunc() {
        }
        
        function formatLocalTime(date, timeFormat) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            if (timeFormat === 'localTime') {
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                return strTime;
            } else {
                minutes = minutes < 10 ? '0' + minutes : minutes;
                return hours + ':' + minutes;
            }
        }

        function environmentModal() 
        {   
            $('#modalContent').html('');
            let Con = `       <select name="environmentSel" id="environmentSel" class="form-control mb-1">
            <option>O2</option>
            <option>CO2</option>
            <option>N2</option>
            <option>Humidity</option>
            <option>Temperature</option>
            </select>
            <input type="text" class="form-control mb-1" id="environmentVal" placeholder="Value"> 
            <input type="date" class="form-control mb-1" id="environmentStart" placeholder="Start Time"> 
            <input type="date" class="form-control mb-1" id="environmentEnd" placeholder="End Time"> `
            $('#modalTitle').text("Environment");
            $('#modalContent').html(Con);
            modal.style.display = "block";
        }
   
        $('.img-cell img').on('click', function(evt){
            $('#modalContent').text('');
            var img = document.createElement("IMG");
            img.setAttribute('src', evt.target.currentSrc);

            document.getElementById("modalContent").appendChild(img);
            let alt = $(this).attr('alt');
            let con = jsonData.Images[alt - 1].Name;
            $('#modalTitle').text(con);
            modal.style.display = "block";
        });
        $('.PumpAddicon').on('click',function(){
            let addedCon = `<button id="pumpElementAdded" type="button" class = "btn btn-warning water-butt mb-2 pumpClassAdded" draggable="true" ondragstart = "drag(event)">
            <i title="Water" class="fa fa-sign-in status-down"></i>
            </button>`;
            $('.main').append(addedCon);
        });

        $('.addFunction').click(function () {
            let rand = Math.floor((Math.random() * 10000) + 1);
            let addedCon = `<div class="bs-box funcBox" id="funcElementAdded" draggable="true" ondragstart = "drag(event)" alt="${rand}">
            <span class="funct-element">
                <span class="funct-text"></span>
            </span>
        </div>`;
            $('.main').append(addedCon);
        });

        // $(document).on('click', '.pumpClassAdded', function(){
        //     d3.select('.pumpSection').on(".zoom", null);
        //     $(this).attr('id', 'redragpump');
        // });
        svg.call(zoom);
        d3.select('.imageSection')
        .call(zoom);
        d3.select('.funSection')
        .call(zoom);
        d3.select('.pumpSection')
        .call(zoom);
    }
})();
