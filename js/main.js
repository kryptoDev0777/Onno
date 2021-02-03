// ops:flp:d3
'use strict';
(function () {

    // let jsonData = {
    //     "Protocol": {
    //         "ProtocolId": 1,
    //         "Name": "Cell growth 2",
    //         "Description": "Second test"
    //     },
    //     "Elements": [
    //         {
    //             "ProtocolElementId": 1,
    //             "Type": "Pump",
    //             "Configuration": {
    //                 "Type": "Salt Water",
    //                 "Value": 10,
    //                 "Direction": "In"
    //             },
    //             "Start": 120,
    //             "Duration": 20
    //         },
    //         {
    //             "ProtocolElementId": 2,
    //             "Type": "Pump",
    //             "Configuration": {
    //                 "Type": "Water",
    //                 "Value": "5",
    //                 "Direction": "Out"
    //             },
    //             "Start": 2590,
    //             "Duration": 10
    //         },
    //         {
    //             "ProtocolElementId": 3,
    //             "Type": "Temperature",
    //             "Configuration": {
    //                 "Value": "37"
    //             },
    //             "Start": 0,
    //             "Duration": 3600
    //         },
    //         {
    //             "ProtocolElementId": 4,
    //             "Type": "Temperature",
    //             "Configuration": {
    //                 "Value": "20"
    //             },
    //             "Start": 200,
    //             "Duration": 3600
    //         }
    //         ,
    //         {
    //             "ProtocolElementId": 5,
    //             "Type": "Temperature",
    //             "Configuration": {
    //                 "Value": "30"
    //             },
    //             "Start": 800,
    //             "Duration": 3600
    //         }
            
    //     ]
    // };

    var jsonData = d3.json("http://145.131.29.141:8080");

    let min = jsonData.Elements.sort((b, c) => (b.Start - c.Start))[0].Start;
    let max = jsonData.Elements.sort((b, c) => ((b.Start + b.Duration) - (c.Start + c.Duration)))[jsonData.Elements.length - 1].Start + jsonData.Elements.sort((b, c) => ((b.Start + b.Duration) - (c.Start + c.Duration)))[jsonData.Elements.length - 1].Duration;
    let o2Data = loadDataBytype('Elements', 'o2'),
        co2Data = loadDataBytype('Elements', 'co2'),
        n2Data = loadDataBytype('Elements', 'n2'),
        humidityData = loadDataBytype('Elements', 'humidity'),
        temperatureData = loadDataBytype('Elements', 'Temperature'),
        pumpData = loadDataBytype("Elements", "Pump"),
        imageData = loadDataBytype("Elements", "Images"),
        functionsData = loadDataBytype("Elements", "Functions");
    window.setTimeout(() => {
        createGraph();
    }, 100);
    window.addEventListener("resize", function () {
        d3.select("#svgArea").html('');
        createGraph();
    });


    function loadDataBytype(jsonType, type) {
        if (jsonData[jsonType] && jsonData[jsonType].length) {
            var _data = jsonData[jsonType].filter((_type) => _type['Type'] === type);
            var result = _data.map(function(data){return data});
            if(type != "Pump" && type != "Images" && type != "Functions")
            {
                if(_data != null && _data.length > 0)
                {
                    for(var i = 0; i <  _data.length; i++)
                    {
                        if(_data.length > i + 1)
                        {
                            var temp = {};
                            temp['ProtocolElementId'] = _data[i].ProtocolElementId;
                            temp['Configuration'] = _data[i].Configuration;
                            temp['Start'] = _data[i+1].Start;
                            temp['Type'] = _data[i].Type;
                            temp['Duration'] = _data[i].Duration;
                            result.splice(i*2+1, 0, temp);
                        }
                        else if(_data.length == i + 1)
                        {
                            var temp = {};
                            temp['ProtocolElementId'] = _data[i].ProtocolElementId;
                            temp['Configuration'] = _data[i].Configuration;
                            temp['Start'] = _data[i].Start + _data[i].Duration;
                            temp['Type'] = _data[i].Type;
                            temp['Duration'] = _data[i].Duration;
                            result.push(temp);
                        }
                    }
                }
            }
           
            return result;
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
        let x = d3.scaleLinear().range([0, svgWidth]);
        let y = d3.scaleLinear().range([(totalHeight) / 5 - space, 0]);
        var tran = { k: 1, x: 0, y: 0 };
      
        x.domain([min, max]);
      
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

                return x(d.Start);
            })
            .y(function (d) {
                return y(d.Configuration.Value);
            });
        let linePath, yAxisGroup, yAxis, iii = 0, diff;
        var yAxisGroup_array = [];
        // Adds the svg

        let svg = d3.select("#svgArea")
            .append("svg")
            .attr("width", idWidth)
            .attr("height", idHeight)
            .append("g");

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", idWidth)
            .attr("height", idHeight);
        let images = svg.selectAll('image')
            .data(imageData)
            .enter()
            .append('image')
            .attr("width", "140px")
            .attr("height", "140px")
            .attr("class", "draggable")
            .attr("alt", d => d.Name)
            .attr('start', function (d) { return d.Start })
            .attr("transform", "translate(" + padd.left + ",0)")
            .attr('xlink:href', './Images/20201207_163149_B1_12897x12123y26000z_10x_BF.jpg')
            .attr('x', function (d, i) { return ((d.Start - min) / (max - min)) * svgWidth })
            .attr('y', 50);

        let functions = svg.selectAll('.function')
            .data(functionsData)
            .enter()
            .append("svg:foreignObject")
            .attr("class", "function")
            .attr("width", "120px")
            .attr("height", "140px")
            .attr('start', function (d) { return d.Start })
            .attr("transform", "translate(" + padd.left + ",0)")
            .attr('x', function (d, i) { return ((d.Start - min) / (max - min)) * svgWidth })
            .attr('y', 180)
            .append("xhtml:body")
            .html(function (d) {
                return `<div class="bs-box functionModal" alt="${Math.floor((Math.random() * 10000) + 1)}" >
                                <span class="funct-element">
                                    <span class="funct-text">${d.Name}</span>
                                </span>
                            </div>`});
        console.log(pumpData);
        let pumps = svg.selectAll('.pump')
            .data(pumpData)
            .enter()
            .append("svg:foreignObject")
            .attr("class", "pump")
            .attr("type", "Pump")
            .attr("start", function (d) { return d.Start })
            .attr("during", function (d) { return d.Duration })
            .attr("dateType", "Start")
            .attr("index", function (d, i) { return i; })
            .attr("time", function (d) { return d.Start })
            .attr("width", "74px")
            .attr("height", "50px")
            .attr("transform", "translate(" + padd.left + ",0)")
            .attr('x', function (d, i) { return ((d.Start - min) / (max - min)) * svgWidth })
            .attr('y', 315)
            .append("xhtml:body")
            .html(function (d) { return `<button class="pumpModal draggable btn btn-info water-butt mb-2" amount=${d.Configuration.Value} type=${d.Configuration.Direction} start="${d.Start}" end="${d.End}"><i class="fa fa-sign-${d.Configuration.Direction == "In" ? "in" : "out"} ${d.Configuration.Direction === "In" ? "status-down" : "status-up"}"></i></button>` })

        setInitialEvents();


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
            .attr("y", rest - 5)
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
            .style('width', (svgWidth - svgWidth / 3) + "px");
        //add zoom
        let zoom = d3.zoom()
            .scaleExtent([0.25, 10])// less than 1 means can resize smaller than  original size
            .translateExtent([[-svgWidth, svgHeight], [2 * svgWidth, 0]])
            .on("zoom", zoomed);
        // .on("wheel", function() { d3.event.preventDefault(); });
        var currentZoomLevel = 1;
        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisTop(x).ticks(5);
        }

        // gridlines in y axis function
        function make_y_gridlines() {
            return d3.axisLeft(y).ticks(10);
        }
        function createSpecificGraph(data, col, nn) {

            // Get the data
            let VX = d3.extent(data, (d) => d.Start);
            let VX1 = VX[0],
                VX2 = VX[1],
                VXX = VX2 - VX1,
                pp = VXX / (max - min);
            x = d3.scaleLinear().range([0, svgWidth * pp]);
            x.domain(d3.extent(data, (d) => d.Start));
            var minValue = d3.min(data, (d) => d.Configuration.Value);
            var maxValue = d3.max(data, (d) => d.Configuration.Value);
            if(data == null || data.length == 0){minValue = 0; maxValue = 1;}
            if (minValue == maxValue) {
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

            linePath = sum.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", valueline)
                .attr("stroke", col)
                .attr("transform", "translate(" + padd.left + "," + (rest + (totalHeight / 5) * nn) + ")")
                .style("cursor", "pointer")
                .on("click", function () {
                    var mx = d3.mouse(svg.node())[0] - 35; // x position of cursor
                    var temp = 0;
                    for (var i = 0; i < data.length; i++) {
                        if ((parseInt(min + (max - min) * (mx - tran.x) / svgWidth)) > data[i].Start) {
                            temp = i;
                        }
                    }
                    $('#modalContent').html('');

                    let Con = ` <select name="environmentSel" id="environmentSel" class="form-control mb-1">
                        <option>O2</option>
                        <option>CO2</option>
                        <option>N2</option>
                        <option>Humidity</option>
                        <option>Temperature</option>
                        </select>
                        <label>Value</label>
                        <input type="text" class="form-control mb-1" id="environmentVal" value=${data[temp].Configuration.Value}> 
                        <label>Start</label>
                        <input type="number" class="form-control mb-1" id="pumpStartDate" value=${data[temp].Start} > 
                        <label>Duration</label>
                        <input type="number" class="form-control mb-1" id="pumpEndDate"  value=${data[temp].Duration} >`

                    $('#modalTitle').text("Environment");
                    $('#modalContent').html(Con);
                    modal.style.display = "block";
                });
          
        }

        function setInitialEvents() {

            //    Drag and Drop Function
            var deltaX = 0;
            var dragHandler = d3.drag()
                .on("start", function () {
                    var current = d3.select(this);
                    deltaX = current.attr('x') - d3.event.x / currentZoomLevel;
                })
                .on("drag", function () {
                    var eventX = d3.event.x / currentZoomLevel;
                    d3.select(this).attr("x", eventX + deltaX);
                    d3.select(this).attr('start', parseInt(min + (max - min) * (eventX + deltaX) / svgWidth));
                }).on("end", function () {
                    d3.select(this)._groups[0][0].classList.add('newElement', 'newElement')
                    $("#success-alert").fadeTo(3000, 500).slideUp(500, function () {
                        $("#success-alert").slideUp(500);
                    });

                });
            dragHandler(svg.selectAll("image"));
            dragHandler(svg.selectAll("foreignObject"));

            // Pump Show Modal
            $('.pumpModal').on('click', function (event) {
                $('#modalContent').html('');
                let Con = ` 
                <label>Water</label>
                <select name="pumpSel" id="pumpSel" class="form-control mb-1" value=${$(this).attr('type') === "Water" ? 1 : 0}>
                <option>Water</option>
                <option>Salt water</option>
                </select>
                <label>Amount</label>
                <input type="text" class="form-control mb-1" id="pumpAmount" value=${$(this).attr('amount')} > 
                <label>Start</label>
                <input type="number" class="form-control mb-1" id="pumpStartDate" value=${$(event.target.closest('.pump')).attr('start')} > 
                <label>Duration</label>
                <input type="number" class="form-control mb-1" id="pumpEndDate"  value=${$(event.target.closest('.pump')).attr('duration')} > `
                $('#modalTitle').text("Pump Option");
                $('#modalContent').html(Con);
                modal.style.display = "block";
            });
            // Image show Modal
            $('image').on('click', function (evt) {
                $('#modalContent').text('');
                var img = document.createElement("IMG");
                img.setAttribute('src', $(this).attr('href'));

                document.getElementById("modalContent").appendChild(img);
                $('#modalTitle').text($(this).attr('alt'));
                modal.style.display = "block";
            });
            //  Function Modal
            $('.functionModal').on('click', function (evt) {
                modal.style.display = 'block';
                $('#modalTitle').text('Function');
                let self = $(this).attr('alt'),
                    funcName = $(this).find('.funct-text').text();
                let Con = `<select name="funcList" id="funcList" class="form-control" alt="${self}">\
                <option ${(funcName == "Count number of cells") ? "selected" : ""}>Count number of cells</option>\
                <option ${(funcName == "Count number of alive and dead cells") ? "selected" : ""}>Count number of alive and dead cells</option>\
                <option ${(funcName == "Cell size") ? "selected" : ""}>Cell size</option>\
                </select>`;
                $('#modalContent').html(Con);
            })
            // new Image Modal
            $('.newImageModal').on('click', function () {
                modal.style.display = 'block';
                $('#modalTitle').text('New image');
                let self = $(this).attr('alt');
                let Con = `<label>Zoom level</label><select  class="form-control" alt="${self}">\
                <option >5x</option>\
                <option >10x</option>\
                <option >20x</option>\
                </select>
                <label>Light</label><select  class="form-control" alt="${self}">\
                <option >Normal</option>\
                <option >Green</option>\
                <option >Blue</option>\
                <option >Ultraviolet</option>\
                </select>`;
                $('#modalContent').html(Con);
            });
        }

        function zoomed() {
            currentZoomLevel = d3.event.transform.k;
            tran = d3.event.transform;
            var transform = d3.event.transform;
            diff = padd.left * (transform.k - 1);
            var transformString = 'translate(' + (transform.x - diff) + ',' + '0) scale(' + transform.k + ',1)';
            sum.attr("transform", transformString);
            xAxisGroup.call(xAxis.scale(d3.event.transform.rescaleX(x)));//rescaleX - change the xScale domain with the transforming info
            xGrid.call(d3.axisTop(x).ticks(10).scale(d3.event.transform.rescaleX(x))
                .tickSize(svgHeight)
                .tickFormat("")
            );
            // matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())
            d3.selectAll(".svgMoved").selectAll(".ccc1").style("transform", "matrix(" + 1 + ", 0, 0," + 1 + "," + transform.x + "," + 0 + ")");
            d3.selectAll(".svgMoved").selectAll(".pumpMiddleSec").style("transform", "matrix(" + 1 + ",0,0," + 1 + "," + transform.x + "," + 0 + ")");
            d3.selectAll("image").style("transform", "matrix(" + 1 + ",0,0," + 1 + "," + transform.x + "," + 0 + ") scale(" + transform.k + ",1)");
            d3.selectAll(".function").style("transform", "matrix(" + 1 + ",0,0," + 1 + "," + transform.x + "," + 0 + ") scale(" + transform.k + ",1)");
            d3.selectAll(".pump").style("transform", "matrix(" + 1 + ",0,0," + 1 + "," + transform.x + "," + 0 + ") scale(" + transform.k + ",1)");
            d3.selectAll(".newElement").style("transform", "matrix(" + 1 + ",0,0," + 1 + "," + transform.x + "," + 0 + ") scale(" + transform.k + ",1)");
            d3.select(".grid path").remove();
        }

        //  Add Element functions Start ---------------------------
        // Add Pump Function
        $('.PumpAddicon').on('click', function () {
            svg.append("svg:foreignObject")
                .attr("type", "Pump")
                .attr("class", "pump")
                .attr("start", "0")
                .attr("duration", "0")
                .attr("dateType", "Start")
                .attr("index", function (d, i) { return i; })
                .attr("time", "time")
                .attr("width", "74px")
                .attr("height", "50px")
                .attr('x', 10)
                .attr('y', 315)
                .append("xhtml:body")
                .html(function (d) { return `<button class="pumpModal draggable btn btn-info water-butt mb-2" amount="0" type="Water" start="0" duration="0"><i class="fa fa-sign-in status-down"></i></button>` })
            setInitialEvents();
        });
        // Add Functions function
        $('.addFunction').click(function () {
            svg.append("svg:foreignObject")
                .attr("width", "120px")
                .attr("height", "140px")
                .attr("style", "color: yellow;")
                .attr('x', 10)
                .attr('y', 180)
                .append("xhtml:body")
                .html(function (d) {
                    return `<div class="bs-box functionModal" alt="${Math.floor((Math.random() * 10000) + 1)}" >
                                <span class="funct-element">
                                    <span class="funct-text"></span>
                                </span>
                            </div>`});
            setInitialEvents();
        });
        // Add Graph function
        $('.addGraph').click(function () {
            $('#modalContent').text('');
            let con = ` <label>Value</label>  <input type="text" class="form-control mb-1" id="environmentVal"> 
            <label>Start</label> <input type="number" class="form-control mb-1" id="environmentStart"> 
            <label>Duration</label> <input type="number" class="form-control mb-1" id="environmentEnd"> `;
            $('#modalContent').html(con);
            let alt = $(this).attr('title');
            $('#modalTitle').text(alt);
            modal.style.display = "block";
        })
        // Add Image function
        $('.addImage').on('click', function (event) {
            svg.append("svg:foreignObject")
                .attr("dateType", "Start")
                .attr("time", "time")
                .attr("width", "100px")
                .attr("height", "135px")
                .attr('x', 10)
                .attr('y', 40)
                .append("xhtml:body")
                .html(function (d) {
                    return `<div class="bs-box newImageModal" alt="${Math.floor((Math.random() * 10000) + 1)}">
                                <span> New Image</span>
                            </div>`});
            setInitialEvents();
        })
        //  Add Element functions End ---------------------------

        // Element Click Events

        svg.call(zoom);
        d3.select('.imageSection')
            .call(zoom);
        d3.select('.funSection')
            .call(zoom);
        d3.select('.pumpSection')
            .call(zoom);
    }
})();
