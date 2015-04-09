var mtc_plot;

$(function(){
    mtc_plot = $.plot("#mtc-chart", get_plot_data(mtc_name[0],'1'), {
        grid: {
                borderColor: "#f3f3f3",
                borderWidth: 1,
                tickColor: "#f3f3f3"
              },
        series: {
            stack: false,
            lines: {
                show: true,
                fill: true
            }            
        }
    });        
});

function get_plot_data(metric_name,time_slot){
  var url = "http://114.212.189.132:8000/ganglia/xml/" + hostname + '/' + metric_name + '/' + time_slot +'/';
  var data_pair = get_mtc_msg(url);
  var dataset = [{data:data_pair,label:metric_name,color:"#3c8dcc"}];  
  return dataset;
}


function get_mtc_msg(req_url){
    var v_array = [];
    var xml_http = new XMLHttpRequest();
      xml_http.open("GET",req_url,false);
      xml_http.send();
    xmlDoc = jQuery.parseXML(xml_http.responseText);
    $(xmlDoc).find('row').each(function(){
            var time = parseFloat($(this).children('t').text());
            var value = parseFloat($(this).children('v').text());
            v_array.push([time*1000,value]);      //time series xaxis require x to be millis
            });
    return v_array;
  }

/*
 * get metric msg using req_url
 */
