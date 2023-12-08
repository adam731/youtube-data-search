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