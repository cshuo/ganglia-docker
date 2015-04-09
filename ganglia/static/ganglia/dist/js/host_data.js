var cpu_plot,disk_plot,mem_plot,net_plot;

/*
 * get metric msg using req_url
 */
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



$(function(){	

	cpu_plot = $.plot("#cpu-chart", get_plot_msg('cpu','1'), {
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
        }
    });        

    mem_plot = $.plot("#mem-chart", get_plot_msg('mem','1'), {
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

    disk_plot = $.plot("#disk-chart", get_plot_msg('disk','1'), {
        grid: {
                borderColor: "#f3f3f3",
                borderWidth: 1,
                tickColor: "#f3f3f3"
              },
        series: {
            stack: false,
            lines: {
                show: true,
                fill: false
            }            
        }
    });        

    net_plot = $.plot("#net-chart", get_plot_msg('net','1'), {
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