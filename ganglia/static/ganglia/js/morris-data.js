var metric_plot;   //global plot obj for plotting 


$(function(){    
    var init_dataset = data_for_plot("cpu");   // init to show cluster cpu util 
    metric_plot = $.plot("#area-chart", init_dataset, {
        grid: {
                borderColor: "#f3f3f3",
                borderWidth: 1,
                tickColor: "#f3f3f3"
              },
        series: {
            stack: true,
            lines: {
                show: true,
                fill: true
            }            
        },
	legend: {
	    noColumns: 4,
	    position: 'nw'
	}
    });        
});

/*function for getting usg data for specific host's metric*/
function get_hour_metric(mtc_name){    
    var v_array = [];
    var base_url = "http://114.212.189.132:8000/ganglia/hour_mtc_avg/" + mtc_name;
    var xml_doc;
    var xml_http = new XMLHttpRequest();    
    
    xml_http.open("GET",base_url,false);
    xml_http.send();
    xml_doc = jQuery.parseXML(xml_http.responseText); 

    $(xml_doc).find('row').each(function(){
            var time = parseFloat($(this).children(":eq(0)").text());
            var sum = parseFloat($(this).children(":eq(1)").text());
            var num = parseFloat($(this).children(":eq(2)").text())
            var avg = (sum/num).toFixed(2);
            v_array.push([time*1000,avg]);      //time series xaxis require x to be millis
            });            
    return v_array;
};


/*get all metric data of res from all hosts and preparing for plotting*/
function data_for_plot(res_name){
    var mtc_1,mtc_2,mtc_3,mtc_4;
    var d1,d2,d3,d4;
    var datasets;    
    if(res_name == "cpu"){        
        d1 = get_hour_metric("cpu_user");
        d2 = get_hour_metric("cpu_system");
        d3 = get_hour_metric("cpu_nice");
        d4 = get_hour_metric("cpu_idle");        
        datasets = [{data:d1,label:"cpu_user  ",color:"#3c8d00"},{data:d2,label:"cpu_system",color:"#3c8dcc"},
        {data:d3,label:"cpu_wait",color:"#eeeeff"},{data:d4,label:"cpu_idle",color:"#66ffee"}];               
    } 
    if(res_name == "mem"){        
        d1 = get_hour_metric("mem_free");
        d2 = get_hour_metric("mem_cached");
        d3 = get_hour_metric("mem_buffers");
        d4 = get_hour_metric("mem_total");
        datasets = [{data:d1,label:"mem_free",color:"#3c8d00"},{data:d2,label:"mem_cached",color:"#3c8dcc"},
        {data:d3,label:"mem_buffers",color:"#eeeeff"},{data:d4,label:"mem_total",color:"#66ffee"}];               
    }
    if(res_name == "load"){        
        d1 = get_hour_metric("load_one");
        d2 = get_hour_metric("load_five");
        d3 = get_hour_metric("load_fifteen");        
        datasets = [{data:d1,label:"load_one",color:"#3c8d00"},{data:d2,label:"load_five",color:"#3c8dcc"},
        {data:d3,label:"load_fifteen",color:"#3c8dff"}];        
    }
    if(res_name == "network"){        
        d1 = get_hour_metric("bytes_in");
        d2 = get_hour_metric("bytes_out");
        datasets = [{data:d1,label:"bytes_in",color:"#3c8d00"},{data:d2,label:"bytes_out",color:"#3c8dcc"}];        
    }
    return datasets;
}

function show_metric(res_name){
    var datasets = data_for_plot(res_name);
    metric_plot.setData(datasets);
    metric_plot.setupGrid();
    metric_plot.draw();
}

// $(function(){
//     var d1 = [];
//     for (var i = 0; i <= 50; i += 1) {
//         d1.push([i, parseInt(Math.random() * 10)]);
//     }    
//     var d2 = [];
//     for (var i = 0; i <= 50; i += 1) {
//         d2.push([i, parseInt(Math.random() * 10)]);
//     }

//     var d3 = [];
//     for (var i = 0; i <= 50; i += 1) {
//         d3.push([i, parseInt(Math.random() * 10)]);
//     }    

//     datasets_1 = [{data:d1,label:"one",color:"#3c8d00"},{data:d2,label:"two",color:"#3c8dcc"},{data:d3,label:"three",color:"#3c8dff"}];       
//     datasets_2 = [{data:d1,label:"one_1",color:"#3c8d00"},{data:d2,label:"two_1",color:"#3c8dcc"},{data:d3,label:"three_1",color:"#3c8dff"}];       
//     datasets_3 = [{data:d1,label:"one_2",color:"#3c8d00"},{data:d2,label:"two_2",color:"#3c8dcc"},{data:d3,label:"three_2",color:"#3c8dff"}];       
//     datasets_4 = [{data:d1,label:"one_3",color:"#3c8d00"},{data:d2,label:"two_3",color:"#3c8dcc"},{data:d3,label:"three_3",color:"#3c8dff"}]; 

    
//     $.plot("#cpu-area-chart", datasets_1, {
//         grid: {
//                 borderColor: "#f3f3f3",
//                 borderWidth: 1,
//                 tickColor: "#f3f3f3"
//               },
//         series: {
//             stack: true,
//             lines: {
//                 show: true,
//                 fill: true
//             }            
//         }
//     });        
// });



// function show_metric(show_id){ 
//     var child_node;
//     var metric_graph = document.getElementById('metric-graph');   //holder for four metric graph
//     var g_title = document.getElementById('on_show_metric');  // title of the graph        
//     var on_show = document.getElementById(show_id);    

//     if(show_id == 'cpu-area-chart')
//         g_title.innerHTML = "Cluster Cpu last_hour";
//     else if(show_id == 'mem-area-chart')
//         g_title.innerHTML = "Cluster Mem last_hour";
//     else if(show_id == 'disk-area-chart')
//         g_title.innerHTML = "Cluster Disk last_hour";
//     else
//         g_title.innerHTML = "Cluster Load last_hour";

//     child_node = metric_graph.children;
//     for(var i=0;i<child_node.length;i++){        
//         child_node[i].style.display = 'none';
//     }        
//     on_show.parentNode.style.display = 'block';
// }

// $(function() {

//     Morris.Area({
//         element: 'cpu-area-chart',
//         data: [{
//             period: '2010 Q1',
//             iphone: 2666,
//             ipad: null,
//             itouch: 2647            
//         }, {
//             period: '2010 Q2',
//             iphone: 2778,
//             ipad: 2294,
//             itouch: 2441
//         }, {
//             period: '2010 Q3',
//             iphone: 4912,
//             ipad: 1969,
//             itouch: 2501
//         }, {
//             period: '2010 Q4',
//             iphone: 3767,
//             ipad: 3597,
//             itouch: 5689
//         }, {
//             period: '2011 Q1',
//             iphone: 6810,
//             ipad: 1914,
//             itouch: 2293
//         }, {
//             period: '2011 Q2',
//             iphone: 5670,
//             ipad: 4293,
//             itouch: 1881
//         }, {
//             period: '2011 Q3',
//             iphone: 4820,
//             ipad: 3795,
//             itouch: 1588
//         }, {
//             period: '2011 Q4',
//             iphone: 15073,
//             ipad: 5967,
//             itouch: 5175
//         }, {
//             period: '2012 Q1',
//             iphone: 10687,
//             ipad: 4460,
//             itouch: 2028
//         }, {
//             period: '2012 Q2',
//             iphone: 8432,
//             ipad: 5713,
//             itouch: 1791
//         }],
//         // behaveLikeLine: true,        
//         lineWidth: 1,
//         xkey: 'period',
//         ykeys: ['iphone', 'ipad', 'itouch'],
//         labels: ['iPhone', 'iPad', 'iPod Touch'],
//         pointSize: 2,
//         hideHover: 'auto',
//         resize: true
//     });    
// });


// $(function() {

//     Morris.Area({
//         element: 'mem-area-chart',
//         data: [{
//             period: '2010 Q1',
//             iphone: 2666,
//             ipad: null,
//             itouch: 2647
//         }, {
//             period: '2010 Q2',
//             iphone: 2778,
//             ipad: 2294,
//             itouch: 2441
//         }, {
//             period: '2010 Q3',
//             iphone: 4912,
//             ipad: 1969,
//             itouch: 2501
//         }, {
//             period: '2010 Q4',
//             iphone: 3767,
//             ipad: 3597,
//             itouch: 5689
//         }, {
//             period: '2011 Q1',
//             iphone: 6810,
//             ipad: 1914,
//             itouch: 2293
//         }, {
//             period: '2011 Q2',
//             iphone: 5670,
//             ipad: 4293,
//             itouch: 1881
//         }, {
//             period: '2011 Q3',
//             iphone: 4820,
//             ipad: 3795,
//             itouch: 1588
//         }, {
//             period: '2011 Q4',
//             iphone: 15073,
//             ipad: 5967,
//             itouch: 5175
//         }, {
//             period: '2012 Q1',
//             iphone: 10687,
//             ipad: 4460,
//             itouch: 2028
//         }, {
//             period: '2012 Q2',
//             iphone: 8432,
//             ipad: 5713,
//             itouch: 1791
//         }],
//         // behaveLikeLine: true,        
//         lineWidth: 4,
//         xkey: 'period',
//         ykeys: ['iphone', 'ipad', 'itouch'],
//         labels: ['iPhone', 'iPad', 'iPod Touch'],
//         pointSize: 2,
//         hideHover: 'auto',
//         resize: true
//     });    
// });

// $(function() {

//     Morris.Area({
//         element: 'disk-area-chart',
//         data: [{
//             period: '2010 Q1',
//             iphone: 2666,
//             ipad: null,
//             itouch: 2647
//         }, {
//             period: '2010 Q2',
//             iphone: 2778,
//             ipad: 2294,
//             itouch: 2441
//         }, {
//             period: '2010 Q3',
//             iphone: 4912,
//             ipad: 1969,
//             itouch: 2501
//         }, {
//             period: '2010 Q4',
//             iphone: 3767,
//             ipad: 3597,
//             itouch: 5689
//         }, {
//             period: '2011 Q1',
//             iphone: 6810,
//             ipad: 1914,
//             itouch: 2293
//         }, {
//             period: '2011 Q2',
//             iphone: 5670,
//             ipad: 4293,
//             itouch: 1881
//         }, {
//             period: '2011 Q3',
//             iphone: 4820,
//             ipad: 3795,
//             itouch: 1588
//         }, {
//             period: '2011 Q4',
//             iphone: 15073,
//             ipad: 5967,
//             itouch: 5175
//         }, {
//             period: '2012 Q1',
//             iphone: 10687,
//             ipad: 4460,
//             itouch: 2028
//         }, {
//             period: '2012 Q2',
//             iphone: 8432,
//             ipad: 5713,
//             itouch: 1791
//         }],
//         // behaveLikeLine: true,        
//         lineWidth: 7,
//         xkey: 'period',
//         ykeys: ['iphone', 'ipad', 'itouch'],
//         labels: ['iPhone', 'iPad', 'iPod Touch'],
//         pointSize: 2,
//         hideHover: 'auto',
//         resize: true
//     });    
// });

// $(function() {

//     Morris.Area({
//         element: 'load-area-chart',
//         data: [{
//             period: '2010 Q1',
//             iphone: 2666,
//             ipad: null,
//             itouch: 2647
//         }, {
//             period: '2010 Q2',
//             iphone: 2778,
//             ipad: 2294,
//             itouch: 2441
//         }, {
//             period: '2010 Q3',
//             iphone: 4912,
//             ipad: 1969,
//             itouch: 2501
//         }, {
//             period: '2010 Q4',
//             iphone: 3767,
//             ipad: 3597,
//             itouch: 5689
//         }, {
//             period: '2011 Q1',
//             iphone: 6810,
//             ipad: 1914,
//             itouch: 2293
//         }, {
//             period: '2011 Q2',
//             iphone: 5670,
//             ipad: 4293,
//             itouch: 1881
//         }, {
//             period: '2011 Q3',
//             iphone: 4820,
//             ipad: 3795,
//             itouch: 1588
//         }, {
//             period: '2011 Q4',
//             iphone: 15073,
//             ipad: 5967,
//             itouch: 5175
//         }, {
//             period: '2012 Q1',
//             iphone: 10687,
//             ipad: 4460,
//             itouch: 2028
//         }, {
//             period: '2012 Q2',
//             iphone: 8432,
//             ipad: 5713,
//             itouch: 1791
//         }],
//         // behaveLikeLine: true,        
//         lineWidth: 12,
//         xkey: 'period',
//         ykeys: ['iphone', 'ipad', 'itouch'],
//         labels: ['iPhone', 'iPad', 'iPod Touch'],
//         pointSize: 2,
//         hideHover: 'auto',
//         resize: true
//     });    
// });

