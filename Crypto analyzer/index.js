function searchCryptocurrency() {
  let cname = document.getElementById("name").value;
  document.getElementById("p").innerHTML = "Hello";
  fetch("https://api.coinstats.app/public/v1/charts?period=24h&coinId=bitcoin")
    .then((Response) => Response.json())
    .then((data) => {
      return data.data;
    });
}

async function showAllCrypto() {
  $("#frontPageData").hide();
  const response = await fetch(
    "https://api.coinstats.app/public/v1/charts?period=24h&coinId=bitcoin"
  );
  var d = await response.json();
  return d;
}

function format(d) {
  // `d` is the original data object for the row
  return (
    '<div class="slider">' +
    '<table cellpadding="5" cellspacing="0" border="0" style="margin-top: 0px; text-align: left; font-size: 12px; margin-bottom: 7px;">' +
    '<tr style="align-items: left;">' +
    "<td>id:</td>" +
    "<td>" +
    d.id +
    "</td>" +
    "<td>name:</td>" +
    "<td>" +
    d.name +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Symbol</td>" +
    "<td>" +
    d.symbol +
    "</td>" +
    "<td>icon</td>" +
    "<td>" +
    "<img src=" +
    d.icon +
    " alt=" +
    d.icon +
    ' style="width: 16px; height: 16px; border: none;"/></td>' +
    "</tr>" +
    "<tr>" +
    "<td>Current Price:</td>" +
    "<td>" +
    "$ " +
    parseFloat(d.price).toFixed(2) +
    "</td>" +
    "<td>priceBTC</td>" +
    "<td>" +
    "$ " +
    parseFloat(d.priceBtc).toFixed(2) +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Market Cap:</td>" +
    '<td style="white-space: pre">' +
    "$ " +
    parseFloat(d.marketCap).toFixed(2) +
    "</td>" +
    "<td>Volume:</td>" +
    '<td style="white-space: pre">' +
    "$ " +
    parseFloat(d.volume).toFixed(2) +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>More Info:</td>" +
    '<td><a style="color: white;" href="' +
    d.websiteUrl +
    '">' +
    d.websiteUrl +
    "</a></td>" +
    "</tr>" +
    "<tr>" +
    '<td><button id="' +
    d.id +
    '"class="bgraphButton"><i class="fa fa-line-chart"></i> view graph</button></td>' +
    "</tr>" +
    "</table>" +
    "</div>"
  );
}

$(document).ready(function () {
  var table = $("#example").DataTable({
    ajax: {
      url: "https://api.coinstats.app/public/v1/coins?skip=0&currency=USD",
      dataSrc: "coins",
    },
    columns: [
      {
        className: "details-control",
        orderable: false,
        data: "",
        defaultContent: "",
      },
      {
        data: "name",
        render: function (data, type, row, meta) {
          return (
            "<img src=" +
            row["icon"] +
            " alt=" +
            row["icon"] +
            " style='width: 16px; height: 16px; border: none;'/>" +
            " " +
            data
          );
        },
      },
      {
        data: "price",
        render: $.fn.dataTable.render.number(",", ".", 2, "$ "),
      },
    ],
    colReorder: {
      realtime: true,
    },
    // "order": [[1, 'asc']]
    pageLength: 5,
    bInfo: false,
    lengthChange: false,
    initComplete: function (settings, json) {
      $(this).show();
      $("h1").show();
      $("h3").show();
      $("input").show();
      $("button").show();
      $("#hidden_button").hide();
      $("#b").click();
      $(".dataTables_paginate").css("margin-bottom", "40px");
      $("#auto_refresh_check").show();
      $("#auto_refresh_check").css("display", "flex", "align-items", "end");
      var autoRefresh = false;


      $("#check").on("change", function() {
        let checkBoxValue = $("#check").prop("checked");
        if(checkBoxValue) {
          chrome.storage.local.set({ "autoRefresh": true }, function () {});
          // alert(table.language.processing);
          // $("#example").DataTable().processing = false;
          setInterval(function() {table.ajax.reload(null, false);}, 5000);
          setInterval(function() {$("#hidden_button").click()}, 1);
        } else {
          chrome.storage.local.set({ "autoRefresh": false }, function () {});
          const interval_id = window.setInterval(function () {},
          Number.MAX_SAFE_INTEGER);

          for (let i = 1; i < interval_id; i++) {
            window.clearInterval(i);
          }
        }
      });

      chrome.storage.local.get(["autoRefresh"], function (result) {
        let localAutoRefresh = result["autoRefresh"];
        if (localAutoRefresh === true) {
          // $("#check").click();
          $("#check").attr("checked", true);
          setInterval(function () {
            table.ajax.reload();
          }, 5000);
        } else {
          $("#check").attr("checked", false);
        }
      });



      $("body").click(function () {
        $(".paginate_button.next").show();
      });
      $(".paginate_button.previous").show();
      $("body").click(function () {
        $(".paginate_button.previous").show();
      });

     
      $("body").click();
    },
  });

  $("body").click();

  $("#b").click(function () {
    table.search($("#name").val()).draw();
  });
  $('input').on('keypress', function(e) {
    var code = e.keyCode || e.which;
    if(code==13){
      table.search($("#name").val()).draw();
    }
});

setInterval(function() {if(table.search($("#name").val()) == "") {table.search($("#name").val()).draw();}}, 5);

  var openRows = new Array();

  /**
   * Close all previously opened rows
   *
   * @param {object} table which is to be modified
   * @param {object} selectedRow needs to determine,
   * which other rows can be closed
   * @returns {null}
   */
  $("#b").click();
  function closeOpenedRows(table, selectedRow) {
    $.each(openRows, function (index, openRow) {
      // not the selected row!
      if ($.data(selectedRow) !== $.data(openRow)) {
        var rowToCollapse = table.row(openRow);
        rowToCollapse.child.hide();
        openRow.removeClass("shown");
        // replace icon to expand
        $(openRow)
          .find("td.details-control")
          .html('<span class="glyphicon glyphicon-plus"></span>');
        // remove from list
        var index = $.inArray(selectedRow, openRows);
        openRows.splice(index, 1);
        $("#b").click();
      }
    });
  }
  // Add event listener for opening and closing details
  $("#example tbody").on("click", "td.details-control", function () {
    var tr = $(this).closest("tr");
    var row = table.row(tr);

    if (row.child.isShown()) {
      $("div.slider", row.child()).slideUp(function () {
        row.child.hide();
        tr.removeClass("shown");
      });
    } else {
      // Open this row
      closeOpenedRows(table, tr);
      row.child(format(row.data()), "no-padding").show();
      tr.addClass("shown");

      $("div.slider", row.child()).slideDown();
      openRows.push(tr);
      $(".bgraphButton").click(function () {
        var id = $(this).attr("id");
        createGraph(id);
      });
    }
  });
});

setInterval(function () {
  $("#hidden_button").click();
}, 50);
$("#b").click();

async function createGraph(id) {
  const response = await fetch(
    "https://api.coinstats.app/public/v1/charts?period=24h&coinId=" + id
  );
  
  $("#frontPageData").hide();
  var d = await response.json();
  setTimeout(2000);
  const labels = [];
  const data1 = [];
  let count = 0;
  for (let i = 0; i < d["chart"].length; i += 12) {
    labels[count] = new Date(d["chart"][i][0] * 1000).toLocaleTimeString();
    data1[count] = d["chart"][i][1];
    count += 1;
  }

  console.log(labels);

  $("#anotherPageData").show();
  $("body").css("width", "440px");
  $("body").css("height", "420px");
  $("#myChart").css("width", "440px");
  $("#myChart").css("height", "420px");
  $("#backButton").click(function () {
    history.go(0);
  });


  async function currentData() {
    var response1 = await fetch(
      "https://api.coinstats.app/public/v1/coins?skip=0&limit=5&currency=USD"
    );
    let d1 = await response1.json();
    return d1;
  }

  let d2 = await currentData();

  var price;

  for (let i = 0; i < d2["coins"].length; i++) {
    if (d2["coins"][i]["id"] == id) {
      price = d2["coins"][i]["price"];
    }
  }

  function fetchRealTimeData(chart, data, labels) {
    chart.data.datasets.forEach((dataset) => {
      let data = dataset.data;
      let labels = chart.data.labels;
      labels.shift();
      labels.push(new Date().toLocaleTimeString());
      chart.data.labels = labels;
      const first = price;
      console.log(first);
      data.shift();
      data.push(first);
      dataset.data = data;
    });
    chart.update();
  }

  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Time",
          data: data1,
          backgroundColor: ["rgba(113, 88, 203, .15)"],
          borderColor: ["rgba(113, 88, 203, 1)"],
          borderWidth: 1,
          fill: "start",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      animation: {
        duration: 1000,
      },
      tooltips: {
        intersect: false,
        backgroundColor: "rgba(113, 88, 203, 1)",
        titleFontSize: 16,
        titleFontStyle: "400",
        titleSpacing: 4,
        titleMarginBottom: 8,
        bodyFontSize: 12,
        bodyFontStyle: "400",
        bodySpacing: 4,
        xPadding: 8,
        yPadding: 8,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          title: function (t, d) {
            const o = d.datasets.map((ds) => ds.data[t[0].index] + "%");

            return o.join(", ");
          },
          label: function (t, d) {
            return d.labels[t.index];
          },
        },
      },
      title: {
        text: "Public Bandwidth",
        display: true,
      },
      maintainAspectRatio: true,
      spanGaps: false,
      elements: {
        line: {
          tension: 0.3,
        },
      },
      plugins: {
        filler: {
          propagate: false,
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
            },
          },
        ],
      },
    },
  });

  setInterval(() => fetchRealTimeData(myChart), 5000);
}

$('body').append('<div id="loadingDiv" class="spinner" style="margin-top: 370px; margin-left: 370px;"></div><div id="loadingText" class="loadingText"style="font-size: 16px;">Refreshing Data ...</div>');
$(window).on('load', function(){
  setTimeout(removeLoader, 1200); //wait for page load PLUS two seconds.
});
function removeLoader(){
  $( "#loadingDiv" ).remove(); //makes page more lightweight 
    $( "#loadingText" ).remove();
}
