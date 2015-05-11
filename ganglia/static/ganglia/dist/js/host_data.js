var plot_msg = {};


$(function(){	
    var cpu_plot,disk_plot,mem_plot,net_plot;
    cpu_plot = plot_func("#cpu-chart",'cpu','1',true);    
    plot_msg['cpu'] ={'plot':cpu_plot,'time_slot':'1','update_intv':3000};

    mem_plot = plot_func("#mem-chart",'mem','1',false);
    plot_msg['mem'] ={'plot':mem_plot,'time_slot':'1','update_intv':3000};

    disk_plot = plot_func("#disk-chart",'disk','1',false);
    plot_msg['disk'] ={'plot':disk_plot,'time_slot':'1','update_intv':3000};

    net_plot = plot_func("#net-chart",'net','1',false);
    plot_msg['net'] ={'plot':net_plot,'time_slot':'1','update_intv':3000};
});


//set update func for all plots
$(function(){    
    setInterval(function(){
            // alert('cpu');
            update_plot(plot_msg['cpu']['plot'],'cpu',plot_msg['cpu']['time_slot']);
        },plot_msg['cpu']['update_intv']);    
    setInterval(function(){
        // alert('mem');
            update_plot(plot_msg['mem']['plot'],'mem',plot_msg['mem']['time_slot']);
        },plot_msg['mem']['update_intv']);
    setInterval(function(){
        // alert('disk');
            update_plot(plot_msg['disk']['plot'],'disk',plot_msg['disk']['time_slot']);
        },plot_msg['disk']['update_intv']);
    setInterval(function(){
        // alert('net');
            update_plot(plot_msg['net']['plot'],'net',plot_msg['net']['time_slot']);
        },plot_msg['net']['update_intv']);
});


/*
 * basic plot func 
 */
function plot_func(elem_id,res_name,time_slot,stack_opt){
    var time_fmt,tooltip_op;
    if(time_slot == '1'){
        time_fmt = "%H:%M";
        tooltip_op = {
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        };
    }
    if(time_slot == '2'){
        time_fmt = "%m/%d %H:%M";        
        tooltip_op = {
            month: "short",day: "numeric", hour: "2-digit", minute: "2-digit"
        };
    }
    if(time_slot == '3'){
        time_fmt = "%m/%d";        
        tooltip_op = {
            month: "short",day: "numeric"
        };
    }
    if(time_slot == '4'){
        time_fmt = "%m/%d";        
        tooltip_op = {
            month: "short",day: "numeric"
        };
    }
    var obj_plot = $.plot(elem_id, get_plot_msg(res_name,time_slot), {
        xaxis: {
                    mode: "time",                  
                    timeformat: time_fmt
                },
        grid: {
                borderColor: "#f3f3f3",
                borderWidth: 1,
                hoverable: true,
                clickable: true,
                tickColor: "#f3f3f3"
              },
        series: {
            stack: stack_opt,
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

    $("<div id='tooltip'></div>").css({
            position: "absolute",
            display: "none",
            border: "2px solid #FFFF99",
            padding: "10px",
            "background-color": "#FFCC99", 
            "border-radius":"3px",
            opacity: 0.9
        }).appendTo("body");

    $(elem_id).bind("plothover", function (event, pos, item) {
            if (item) {                
                var x = item.datapoint[0]/1000,
                y = item.datapoint[1].toFixed(2);
                var t = new Date(1970,0,1);                              
                t.setSeconds(x);
                $("#tooltip").html(t.toLocaleDateString("en-US",tooltip_op)+"<br/>"+item.series.label+": "+y).  
                css({top: item.pageY+5, left: item.pageX+5}).
                fadeIn(150);
            } else {
                $("#tooltip").hide();
            }
    });

    return obj_plot;
}


//action for click pull down select list
function switch_time(res_name,time_slot){    
    var time_elem = document.getElementById("time_"+res_name);
    plot_msg[res_name]['time_slot'] = time_slot;

    //update the plot_msg according to the timeslot clicked
    if(time_slot == '1'){
        plot_msg[res_name]['update_intv'] = 3000;
        time_elem.innerHTML = 'last_hour';
    }
    if(time_slot == '2'){
        plot_msg[res_name]['update_intv'] = 50000;
        time_elem.innerHTML = 'last_day';
    }
    if(time_slot == '3'){
        plot_msg[res_name]['update_intv'] = 500000;
        time_elem.innerHTML = 'last_week';
    }
    if(time_slot == '4'){
        plot_msg[res_name]['update_intv'] = 5000000;
        time_elem.innerHTML = 'last_month';
    }

    plot_msg[res_name]['plot']=redraw_plot(res_name,time_slot);
}


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

  /*
 *get metrics msg of a res with a specified time interval 
 */
function get_plot_msg(res_name,time_slot){
    var base_url = "/ganglia/xml/" + hostname;
    var dataset = [];   //for datas of every metric
    var url_list = [];  //url for metrics 
    var mtc_name = [];    
    var plot_color = ["#3c8d00","#3c8dcc","#eeeeff","#66ffee"];

    if(res_name == 'cpu'){
        mtc_name = ['cpu_system','cpu_user','cpu_idle','cpu_nice'];        
        url_list.push(base_url+'/'+'cpu_system/'+time_slot+'/');
        url_list.push(base_url+'/'+'cpu_user/'+time_slot+'/');
        url_list.push(base_url+'/'+'cpu_idle/'+time_slot+'/');
        url_list.push(base_url+'/'+'cpu_nice/'+time_slot+'/');
    }
    if(res_name == 'mem'){        
        mtc_name = ['mem_total','mem_free','mem_shared','mem_buffers'];
        url_list.push(base_url+'/'+'mem_total/'+time_slot+'/');
        url_list.push(base_url+'/'+'mem_free/'+time_slot+'/');
        url_list.push(base_url+'/'+'mem_shared/'+time_slot+'/');
        url_list.push(base_url+'/'+'mem_buffers/'+time_slot+'/');
    }
    if(res_name == 'disk'){
        mtc_name = ['disk_free','disk_total'];
        url_list.push(base_url+'/'+'disk_free/'+time_slot+'/');
        url_list.push(base_url+'/'+'disk_total/'+time_slot+'/');
    }
    if(res_name == 'net'){
        mtc_name = ['bytes_in','bytes_out'];
        url_list.push(base_url+'/'+'bytes_in/'+time_slot+'/');
        url_list.push(base_url+'/'+'bytes_out/'+time_slot+'/');
    }

    for(var i=0; i<url_list.length; i++){
        var data_pair = get_mtc_msg(url_list[i]);        
        var plot_data = {data:data_pair,label:mtc_name[i],color:plot_color[i]};
        dataset.push(plot_data);    
    }

    return dataset;
}

//update graph regulary
function update_plot(plot_obj,res,time_slot){    
    var update_data;
    update_data = get_plot_msg(res,time_slot);
    plot_obj.setData(update_data);
    plot_obj.setupGrid();
    plot_obj.draw();
}


//redraw the graph
function redraw_plot(res_name,time_slot){
    var elem,stack_opt;
    if(res_name == 'cpu'){
        elem = '#cpu-chart';
        stack_opt = true;
    }
    if(res_name == 'mem'){
        elem = '#mem-chart';
        stack_opt = true;
    }
    if(res_name == 'disk'){
        elem = '#disk-chart';
        stack_opt = false;
    }
    if(res_name == 'net'){
        elem = '#net-chart';
        stack_opt = false;
    }
    return plot_func(elem,res_name,time_slot,stack_opt);
}