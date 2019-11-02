function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    var url = `/metadata/${sample}`;
    console.log(url)
    d3.json(url).then(function(response) {
      console.log(response)

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select('#sample-metadata').append('ul').append('b')

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    var age = response.AGE
    var bbType = response.BBTYPE
    var ETH = response.ETHNICITY
    var GEN = response.GENDER
    var LOC = response.LOCATION
    var WF = response.WFREQ

    // ---------------------------

    Object.entries(response).forEach(([d,i])=>{
      panel.append('li')
        .text(`${d.toUpperCase()}:    ${i}`)
    })



    // BONUS: Build the Gauge Chart
    
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // Use `d3.json` to fetch the metadata for a sample
  var url = `/samples/${sample}`;
  console.log(url)
  d3.json(url).then(function(response) {
    console.log(response)









    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      marker: {
        size: response.sample_values
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Marker Size',
      showlegend: false,
      height: 600,
      width: 600
    };
    
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pieTrace = {
      labels: response.otu_ids.slice(0,10),
      values: response.sample_values.slice(0,10),
      hovertext: response.otu_values,
      type: 'pie'
    }

    var layout = {
      showlegend: true,
    };
    Plotly.newPlot('pie', [pieTrace], layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(`You selected ${newSample}`)
  
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
