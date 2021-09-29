function searchCryptocurrency() {
    let cname = document.getElementById("name").value;
    document.getElementById("p").innerHTML = "Hello"
    fetch("https://api.coincap.io/v2/assets").then(Response => Response.json()).then(
        data => document.getElementById("p").innerHTML = data.data)

}

function showAllCrypto() {
    fetch("https://api.coincap.io/v2/assets").then(Response => Response.json()).then(
        data => {
            // var table = document.getElementById("myTable");
            // var row = table.insertRow(1);
            // row.classList.add("r1")

            // var cell1 = row.insertCell(0);
            // var cell2 = row.insertCell(1);
            // var cell3 = row.insertCell(2);

            
            // cell1.innerHTML = data.data[0]["name"];
            // cell2.innerHTML = "$ " + parseFloat(data.data[0]["priceUsd"]).toFixed(2);
            // cell3.innerHTML = data.data[0]["explorer"];
            console.log(data)
            return data;
        }).catch(e => {
            return e;
        })
}





function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; margin-top: 0px;">'+
    '<tr style="align-items: left;">'+
        '<td>id:</td>'+
        '<td>'+d.id+'</td>'+
    '</tr>'+
        '<tr>'+
            '<td>Full name:</td>'+
            '<td>'+d.name+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Current Price:</td>'+
            '<td>'+ "$ " + parseFloat(d.priceUsd).toFixed(2)+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Symbol:</td>'+
            '<td>'+d.symbol+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Market Cap Used:</td>'+
            '<td>'+"$ " + parseFloat(d.marketCapUsd).toFixed(2)+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Volume Used (24 hours):</td>'+
            '<td>'+"$ " + parseFloat(d.volumeUsd24Hr).toFixed(2)+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Extra info:</td>'+
            '<td><a href="'+d.explorer+'" style="color: white";>'+ d.explorer +'</a></td>'+
        '</tr>'+
    '</table>';
}
 
$(document).ready(function() {
    var table = $('#example').DataTable( {
        "ajax":" https://api.coincap.io/v2/assets",
        processing: true,
        'language': {
            'loadingRecords': '&nbsp;',
            'processing': '<div class="spinner" style="margin-top: 370px; margin-left: 370px;"></div><div style="font-size: 16px;">Refreshing Data ...</div>'
        },
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           '',
                "defaultContent": ''
            },
            { "data": "name" },
            { "data": "priceUsd", render: $.fn.dataTable.render.number( ',', '.', 2, '$ ' ) },
        ],
        colReorder: {
            realtime: true
            },
        // "order": [[1, 'asc']]
        "pageLength": 5,
        "bInfo" : false,
        "lengthChange": false,
        "initComplete": function(settings, json) {
            $(this).show();
            $("h1").show();
            $("h3").show();
            $("input").show();
            $("button").show();
            $(".paginate_button.next").show();
            $("body").click(function() {
                $(".paginate_button.next").show();
            })
            $(".paginate_button.previous").show();
            $("body").click(function() {
                $(".paginate_button.previous").show();
            })
            let UPDATE = 7 * 1000;
                setInterval( function () {
                    window.location.reload();
                    }, UPDATE );
          }
          
    } );
    
    $('#b').click(function(){
        table.search($("#name").val()).draw() ;
        })
    // Add event listener for opening and closing details
    $('#example tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
} );



// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelector('button').addEventListener('click', showAllCrypto, false);
//    }, false)