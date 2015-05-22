var mtc_plot,onshow_mtc,time_slot,update_inter;
var mtc_title = document.getElementById('on_show_metric');
var mtc_time = document.getElementById('time_name');
var elem = "#mtc-chart";
var init_alert = 1;    //whether setup a timely task
var alert_interval_id;    //this is for cancel alert setinterval func

//init func 
$(function(){          
    $('#unit').html(get_unit(res_name));
    onshow_mtc = mtc_name[0];
    mtc_title.innerHTML = onshow_mtc;
    time_slot = '1';
    update_inter = 3000;
    mtc_plot = plot_mtc(elem,onshow_mtc,time_slot);    
});

$(function(){
    setInterval(update_plot,update_inter);
});

//checkbox on popup div,checked for not showwing again
$('#enableAlert').on('change', function() {     
  if (this.checked) {    
    clearInterval(alert_interval_id);                       //stop timely alert_func    
    $("#alert-content-setted").hide();  
    $("#alert-content").fadeIn();    
  }  
  else{
    $("#alert-content").hide();    
    $("#alert-content-setted").fadeIn();      
    alert_interval_id = setInterval(alert_func,3000);      //unchecked,start timely alert_func again
  }
});

//action afer click pull down time choice 
function switch_time(time_s){
    if(time_s == '1'){
        mtc_time.innerHTML = 'last hour';
        update_inter = 3000;
    }
    if(time_s == '2'){
        mtc_time.innerHTML = 'last day';
        update_inter = 50000;
    }
    if(time_s == '3'){
        mtc_time.innerHTML = 'last week';
        update_inter = 500000;
    }
    if(time_s == '4'){
        mtc_time.innerHTML = 'last month';
        update_inter = 5000000;
    }
    time_slot = time_s;
    mtc_plot = plot_mtc(elem,onshow_mtc,time_s);
}

//action after click sidebar list item
function switch_mtc(mtc_n){
    var data;
    onshow_mtc = mtc_n;
    time_slot = '1';
    update_inter = 5000;
    mtc_time.innerHTML = 'last hour';
    mtc_title.innerHTML = onshow_mtc;

    update_plot();
}

//function for updating graph timely
function update_plot(){
    var data = get_plot_data(onshow_mtc,time_slot);
    mtc_plot.setData(data);
    mtc_plot.setupGrid();
    mtc_plot.draw();
}

/**
  get unit
  **/
  function get_unit(axes_name){
    var unit = "";
    if(axes_name == "Mem")
        unit = " GB";
    else if(axes_name == "Disk")
        unit = " GB";
    else if(axes_name == "Cpu")
        unit = " %";
    else if(axes_name == "Network")
        unit = " p/s";
    return unit;
  }

/*
 * basic plot func 
 */
function plot_mtc(elem_id,mtc_n,time_s){
    var time_fmt,tooltip_op;
    if(time_s == '1'){
        time_fmt = "%H:%M";
        tooltip_op = {
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        };
    }
    if(time_s == '2'){
        time_fmt = "%y/%m/%d %H:%M";        
        tooltip_op = {
            month: "short",day: "numeric", hour: "2-digit", minute: "2-digit"
        };
    }
    if(time_s == '3'){
        time_fmt = "%y/%m/%d";        
        tooltip_op = {
            month: "short",day: "numeric"
        };
    }
    if(time_s == '4'){
        time_fmt = "%y/%m/%d";        
        tooltip_op = {
            month: "short",day: "numeric"
        };
    }
    var obj_plot = $.plot(elem_id, get_plot_data(mtc_n,time_s), {
        xaxis: {
                    mode: "time",                  
                    timeformat: time_fmt
                },
        yaxis: {
                tickFormatter: function(v){
                    return v + get_unit(res_name);
                }
        },
        grid: {
                borderColor: "#f3f3f3",
                borderWidth: 1,
                hoverable: true,
                clickable: true,
                tickColor: "#f3f3f3"
              },
        series: {            
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

//prepare data for plotting
function get_plot_data(metric_name,time_s){
  var url = "/ganglia/xml/" + hostname + '/' + metric_name + '/' + time_s +'/';
  var data_pair = get_mtc_msg(url);
  if(metric_name.substring(0,3) == 'mem')
    data_pair = mem_data_modify(data_pair);
  var dataset = [{data:data_pair,label:metric_name,color:"#3c8dcc"}];  
  return dataset;
}

//get msg from background
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



//reset alert info 
function reset_input(){        
    $('#selector').get(0).selectedIndex = 0;        
    document.getElementById("low_b").value = "";
    document.getElementById("up_b").value = "";    
}

//reset popup checkbox when click close
function reset_check(){
    document.getElementById("enableAlert").checked = false;
}


//function when submit button is clicked 
function check_func(){    
    if(document.getElementById('up_b').value.length == 0 || document.getElementById('low_b').value.length == 0){
        alert("please input!!");
    }  
    else{    
      var s = document.getElementById("selector");    
      var alert_name = s.options[s.selectedIndex].text;
      $("#alert-content").hide();
      $("#alert-name").html(alert_name+" "+get_unit(res_name));
      $("#upper-setted").html($("#up_b").val());
      $("#lower-setted").html($("#low_b").val());
      $("#alert-content-setted").fadeIn();              
      alert_interval_id = setInterval(alert_func,3000);      
    }
}

/**
  function to check whether the specified metric exceed the threshold 
 **/
function alert_func(){    
    if(document.getElementById('up_b').value.length == 0 || document.getElementById('low_b').value.length == 0){
        alert("please input!!");
    }      
    var base_url = "/ganglia/xml/" + hostname + '/';
    var s = document.getElementById("selector");        
    var alert_mtc = s.options[s.selectedIndex].text;    
    var upper_bound = $("#up_b").val();
    var lower_bound = $("#low_b").val();        
    var m_value = [];
    var alert_sign = 1;
    var all_NaN = 1;  

    //checkbox is not checked, return directly    

    if(alert_mtc == "all_together"){   //all metric of the resource together              
        var all_mtc_array = [];          

        for(var i =0;i<mtc_name.length; i++){    //get all metric xml data in last 10 minutes            
            var m_url = base_url + mtc_name[i] + '/5/';
            var m_data = get_mtc_msg(m_url);            
            all_mtc_array.push(m_data);
        }

        for(var i=0;i<all_mtc_array[0].length;i++){
            m_value.push(all_mtc_array[0][i][1]);
        }
        for(var i=1;i<all_mtc_array.length;i++){
            for(var j=0;j<m_value.length;j++){          
                m_value[j] += all_mtc_array[i][j][1];
            }            
        }
    }
    else{           //only one metric of the resource in the page        
        var alert_url = base_url + alert_mtc + "/5/";        
        var xml_data = get_mtc_msg(alert_url);           
        for (var i=0;i<xml_data.length;i++){
            m_value.push(xml_data[i][1])      
        }      
    }
    
    //judge whether all value is within the threshold
    for(var i=0;i<m_value.length;i++){      
        if(!isNaN(m_value[i])){
            all_NaN = 0;
            if(m_value[i]<upper_bound && m_value[i]>lower_bound){
                alert_sign = 0;
            }      
        }      
    }

    if(all_NaN ==1 )
        alert("all Num is NaN!!");    
    else if(alert_sign ==1){
        $("#warn-mtc").html(alert_mtc);
        $("#myModal").modal("show");
        var log = "exceed the threshold(" + lower_bound + ", " + upper_bound+")";
        post_log(hostname,res_name,alert_mtc,log);
    }            
}


function post_log(hostname,resname,mtcname,log){
    $.ajax({
        url:"/ganglia/alert_post/",
        type:"POST",
        data:{
            csrfmiddlewaretoken: csrf_token,
            host_name: hostname,
            res_name: resname,
            mtc_name: mtcname,
            log_info: log
        },
        success: function(response){alert(response);},
        complete: function(){},
        error: function(xhr,testStatus,thrownError){ alert("post data error");}
    });
}




