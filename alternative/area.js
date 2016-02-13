if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

function key(label) {
    if (label == "male")
        return "groom"
    return "bride"
}

function notkey(label) {
    if (label == "male")
        return "bride"
    return "groom"
}

function GenderData(data) {
    this.data = data;
}

GenderData.prototype = {
    generate : function(age, gender) {
        counts = []
        for (idx in this.data) {
            var datum = this.data[idx]
            pindex = key(gender)
            notpindex = notkey(gender)
            if (datum[pindex] == age) {
                counts.push({
                    x : parseInt(datum[notpindex]),
                    y : parseInt(datum["count"])
                })
            }
        }
        return counts
    }
}

d3.csv("data.csv", function(data) {
    genderdata = new GenderData(data);

    var container = d3.select("svg#area")
    var container_width = parseInt(d3.select("#graph").style("width"))
    var gender = "male";
    var age = 28;
    var transition_duration = 50;
    var restricted_data = genderdata.generate(age, gender);

    var margin = {top: 20, right: 20, bottom: 40, left: 50},
        width = container_width - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([0, d3.max(restricted_data, function(d) { return 100; })])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, d3.max(restricted_data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(2)

    var area = d3.svg.area()
        .interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y0(height)
        .y1(function(d) { return y(d.y); });

    var svg = container
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
        .datum(restricted_data)
        .attr("class", "area")
        .attr("d", area);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    function transition(age, gender) {
        
        var d = genderdata.generate(age, gender);

        d3.selectAll("path.area")
            .datum(d)
            .style("stroke", "none")
            .transition()
                .duration(transition_duration)
                .attr("d", area);
        return d;
    }

    d3.select('#slider1').call(
        d3.slider()
            .min(0)
            .max(100)
            .step(1)
            .axis(
                d3.svg.axis()
                    .ticks(5)
                    .orient('top')
            )
            .value(age)
            .on("slide", function(evt, value) {
                age = Math.round(value);
                var data = transition(age, gender)
                d3.select("#slider-text span").text(age);
                update_narrative(data, age, gender)
            })
                
    )


    d3.selectAll(".gender-buttons button").on("click", function() {
        d3.selectAll(".gender-buttons button").classed("active", false)
        d3.select(this).classed("active", true)
        transition_duration = 1250;
        gender = this.id;
        var data = transition(age, gender);
        transition_duration = 50;
        update_narrative(data, age, gender);
    })

    function update_narrative(data, age, gender) {
        var fmt = d3.format(",")
        var count = d3.sum(data.map(function(el) {
            return el.y
        }))
        var msg = d3.select("#narrative")
        var gender = gender == "male" ? "women" : "men";

        var options = count < 100 ? "limited" : "endless";
        var str = "";
        if (age < 20 && count < 10) {
            str = "We don't want to be judgemental but ren't you a little young to get married?";
        } else {
            str = String.format("As a {0} year old {1} your options are {2}.", age, gender, options)
        }

        str += String.format(" {0} {1} married in 2014.", fmt(count), gender);
        msg.text(str)
    }
})
