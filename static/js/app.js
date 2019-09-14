function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then((metaName) => {
    var metadataPanel = d3.select("#sample-metadata")
    metadataPanel.html("")
    Object.entries(metaName).forEach(([key,value])=>{
    metadataPanel.append("h6").text(`${key} : ${value}`)
    })
  })
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data
    d3.json(`/samples/${sample}`).then((sampleBubble) => {
      var bubble_ids = sampleBubble.otu_ids
      var bubble_values = sampleBubble.sample_values
      var bubble_labels = sampleBubble.otu_labels

      var bubbleTrace = {
        x: bubble_ids,
        y: bubble_values,
        text: bubble_labels,
        mode: "markers",
        marker: {
          color: bubble_ids,
          size: bubble_values, 
          colorscale: "Earth"
        }
      };

      var data = [bubbleTrace];

      var layout = {
        showLegend: false
      };

      Plotly.newPlot("bubble", data, layout);
    }
    )

    // @TODO: Build a Pie Chart
    d3.json(`/samples/${sample}`).then((samplePie) => {
      var ids = samplePie.otu_ids
      var values = samplePie.sample_values
      var labels = samplePie.otu_labels

      var pieTrace = [{
        values: values.slice(0,10),
        labels: ids.slice(0,10),
        hovertext: labels.slice(0,10),
        hoverinfo: "hovertext",
        type: "pie"
      }]
      Plotly.plot("pie", pieTrace)
    }
    )

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
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
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
