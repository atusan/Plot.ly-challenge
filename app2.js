function buildMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // console.log(result);
        // console.log(resultArray);
        var PANEL = d3.select("#sample-metadata");
        // Use `.html("") to clear any existing metadata
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}
function buildCharts(sample) {
    d3.json("data/samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
        
       
        Trace1 = {
            x:otu_ids,
            y:sample_values,
            text: otu_labels,
            type: 'scatter',
            mode : 'markers',
            marker: {
                color: otu_ids,
                size: sample_values,  
              }
           

        };
        data1 = [Trace1];
        layout1 = {
            title:"Bacteria Cultures Per Sample",
            xaxis: { title: "OTU ID" },
        };


        Plotly.newPlot("bubble", data1, layout1); 

//buliding the bar chart
        Trace2 = {
            x : sample_values.slice(0, 10).reverse(),
            y : otu_ids.slice(0, 10).reverse().map(id =>`otu ${id}`),
            text : otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"

        };
        data2 = [Trace2];
        layout2 = {
            title:"Top 10 Bacteria Cultures Found"
        };


        Plotly.newPlot("bar", data2, layout2); 

    
    });
}


function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}
function optionChanged(newSample) {
   // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}
// Initialize the dashboard
init();
