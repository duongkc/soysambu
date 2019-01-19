$(document).ready(function() {
    /** GLOBAL VARIABLES ***/
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November",
                        "December"];
    const yearBackgroundColors = {2017: "rgba(245, 205, 121,0.6)",
                                  2018: "rgba(186, 220, 88,0.6)",
                                  2019: "rgba(234, 134, 133,0.6)",
                                  2020: "rgba(106, 137, 204,0.6)"};
    const yearBorderColors = {2017: "rgba(245, 205, 121,1)",
                              2018: "rgba(186, 220, 88,1)",
                              2019: "rgba(234, 134, 133,1)",
                              2020: "rgba(106, 137, 204,1)"};


    /*** DATA RETRIEVAL AND PROCESSING ***/
    function getSightingsData() {
        return new Promise(function (resolve) {
            $.getJSON("records", function (sightings) {
                resolve(sightings)
            });
        })
    }

    function processData(sightings) {
        /* Object structure to use as a template for yearly sighting data */
        const dataTemplate = {
            sightingsPerMonth: {"January": 0, "February": 0,  "March": 0, "April": 0, "May": 0,
                                "June": 0, "August": 0, "September": 0, "October": 0, "November": 0,
                                "December": 0}
        };
        let data = {};

        /* Iterate through sighting */
        $.each(sightings, function(key, sighting) {
            const date = new Date(sighting.date),
                  year = date.getFullYear(),
                  month = date.getMonth();

            /* Check if year is not in current data object.
               If not, add year as key with a deep clone of dataTemplate as value.
             */
            if (!(year in data)) {
                data[year] = $.extend(true, {}, dataTemplate);
            }

            data[year].sightingsPerMonth[monthNames[month]] += 1;
        });

        return data;
    }


    /*** CHART - SIGHTINGS - DISTRIBUTION PER MONTH ***/
    function createDistPerMonthChart(data) {
        const canvas = $("#distribution-per-month");

        /* Create a dataset for each year containing that years sightingsPerMonth data. */
        let datasets = [];
        for (let year in data) {
            datasets.push(
                {label: year.toString(),
                 data: Object.values(data[year].sightingsPerMonth),
                 backgroundColor: yearBackgroundColors[year],
                 borderColor: yearBorderColors[year],
                 borderWidth: 2}
            )
        }

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: monthNames,
                datasets: datasets
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Yearly giraffe sightings per month'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            minRotation: 45
                        }
                    }]
                },
                tooltips: {
                    mode: 'index'
                }
            }
        });
    }

    getSightingsData()
        .then(processData)
        .then(createDistPerMonthChart);
});
