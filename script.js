function populateTable(data) {
    // Create table header
    let tableHtml = "<table><tr><th>Rank</th><th>Name</th><th>Brand Channel</th><th>Subscribers (millions)</th><th>Primary Language</th><th>Category</th><th>Country</th></tr>";
    // Create table rows
    data.forEach(function (row) {
        // Create table cells
        tableHtml += `<tr><td>${row.Rank}</td><td>${row.Name}</td><td>${row['Brand channel']}</td><td>${row['Subscribers (millions)']}</td><td>${row['Primary language']}</td><td>${row.Category}</td><td>${row.Country}</td></tr>`;
    });
    // Close table
    tableHtml += "</table>";
    // Add table to page
    document.getElementById('data-table').innerHTML = tableHtml;
}

let originalData = [];

// Fetch and store the data once
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        originalData = data; // Store the data
        populateTable(originalData); // Populate table with original data
    })
    .catch(error => console.error('Error loading JSON:', error));

document.getElementById('search-button').addEventListener('click', function () {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filterOption = document.getElementById('filter-dropdown').value;

    const filteredData = originalData.filter(row => {
        if (filterOption && searchInput) {
            // Check if the property exists and is not null
            if (row[filterOption] !== undefined && row[filterOption] !== null) {
                // Compare the lowercase property value with the search input
                return row[filterOption].toString().toLowerCase().includes(searchInput);
            }
            return false;
        } else if (searchInput) {
            // If no filter option, search across all fields
            return Object.values(row).some(value =>
                value.toString().toLowerCase().includes(searchInput)
            );
        }
        return true; // Return all data if no search input
    });

    populateTable(filteredData);
});


document.getElementById('search-button').addEventListener('click', function () {
    const searchInput = document.getElementById('search-input');
    const filterOption = document.getElementById('filter-dropdown');
    filterOption.value = '';
    searchInput.value = '';
});


document.getElementById('graphs-tab').addEventListener('click', function () {
    // Hide the table and show the graph
    document.getElementById('data-table').style.display = 'none';
    document.getElementById('search-input').style.display = 'none';
    document.getElementById('filter-dropdown').style.display = 'none';
    document.getElementById('search-button').style.display = 'none';

    // Show the graph containers
    var graphContainerCountry = document.getElementById('graph-container-country');
    var graphsContainerSub = document.getElementById('graphs-container-sub');
    graphContainerCountry.style.display = 'block'; // or 'flex'
    graphsContainerSub.style.display = 'block'; // or 'flex'

    // Create bar chart

    // Get the data for the graph
    const graphDataSubscribers = originalData.map((row, index) => ({
        x: index + 1, // or any other value
        y: row['Subscribers (millions)'],
        label: row.Name
    }));
    // Create the chart
    const chartSubs = new CanvasJS.Chart("graphs-container-sub", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
            text: "Top 50 YouTube Channels by Subscribers"
        },
        axisY: {
            title: "Subscribers (millions)"
        },
        data: [{
            type: "column",
            dataPoints: graphDataSubscribers
        }]
    });
    chartSubs.render();

    // Create pie chart

    // Count the number of channels for each country
    const countryCounts = originalData.reduce((counts, row) => {
        counts[row.Country] = (counts[row.Country] || 0) + 1;
        return counts;
    }, {});

    // Convert the counts to the format expected by CanvasJS
    const graphDataCountries = Object.entries(countryCounts).map(([country, count]) => ({
        y: count,
        label: country
    }));

    // Create the chart
    const chartCountry = new CanvasJS.Chart("graph-container-country", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
            text: "Number of Channels by Country"
        },
        data: [{
            type: "pie",
            dataPoints: graphDataCountries
        }]
    });

    chartCountry.render();

    // Create the line chart
    const graphDataSubscribersLine = originalData.map((row, index) => ({
        x: index + 1, // or any other value
        y: row['Subscribers (millions)'],
        label: row.Name
    }));
    const chartSubsLine = new CanvasJS.Chart("line-chart-container", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
            text: "Top 50 YouTube Channels by Subscribers"
        },
        axisY: {
            title: "Subscribers (millions)"
        },
        data: [{
            type: "line",
            dataPoints: graphDataSubscribersLine
        }]
    });

    chartSubsLine.render();


    //scatter/bubble chart


    const graphDataSubscribersBubble = originalData.map((row, index) => ({
        x: index + 1, // or any other value
        y: row['Subscribers (millions)'],
        label: row.Name
    }));
    const chartSubsBubble = new CanvasJS.Chart("scatter-chart-container", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
            text: "Top 50 YouTube Channels by Subscribers"
        },
        axisY: {
            title: "Subscribers (millions)"
        },
        data: [{
            type: "bubble",
            dataPoints: graphDataSubscribersBubble
        }]
    });

    chartSubsBubble.render();

});

// chart objects
let chartCountry;
let chartSubs;

document.getElementById('table-tab').addEventListener('click', function () {
    // Hide the graph and show the table
    document.getElementById('search-input').style.display = '';
    document.getElementById('filter-dropdown').style.display = '';
    document.getElementById('search-button').style.display = '';
    document.getElementById('data-table').style.display = '';
    document.getElementById('graph-container-country').style.display = 'none';
    document.getElementById('graphs-container-sub').style.display = 'none';
    // Destroy the charts
    if (chartCountry) {
        chartCountry.destroy();
    }
    if (chartSubs) {
        chartSubs.destroy();
    }
});


// Hide the graph containers when the page loads
window.onload = function () {
    document.getElementById('graph-container-country').style.display = 'none';
    document.getElementById('graphs-container-sub').style.display = 'none';
};