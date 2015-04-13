var donut;   // for draw host status graph
var down_num = 0, up_num = 0;    //for update donut graph

$(function() {                    	
	var num_pair = get_host_num();
	up_num = num_pair[0];            
	down_num = num_pair[1];              
	donut = Morris.Donut({
		element: 'graph-holder',
		data: [{
			label: "Hosts Up",
			value: up_num
		}, {
			label: "Hosts Down",
			value: down_num
		}],
		resize: true
	});
});

//init cluster resource utilization
$(function(){
    update_util();
});

//update the Host up/down status every 120 seconds 
setInterval(update_host_status,120000);

//function for updating the cluster resourses untilization 
function update_util(){
    var cpu_elem = document.getElementById("cpu_util");
    var mem_elem = document.getElementById("mem_util");
    var disk_elem = document.getElementById("disk_util");
    var load_elem = document.getElementById("load_one");

    cpu_elem.innerHTML = 100 - get_mtc_avg('cpu_idle').toFixed(1);
    mem_elem.innerHTML = (100 - get_mtc_avg('mem_free') / get_mtc_avg('mem_total')).toFixed(1);
    disk_elem.innerHTML = (100 - 100 * get_mtc_avg('disk_free') /get_mtc_avg('disk_total')).toFixed(1);
    load_elem.innerHTML = get_mtc_avg('load_one').toFixed(1);	
    // cpu_elem.innerHTML = "50%";
    // var update_data = cal_util();
    // cpu_elem.innerHTML = update_data[ 0].toFixed(1) + '%';
    // mem_elem.innerHTML = update_data[1].toFixed(1) + '%';
    // disk_elem.innerHTML = update_data[2].toFixed(1) + '%';
    // load_elem.innerHTML = update_data[3].toFixed(1);
}


function get_mtc_avg(mtc_name){
	var base_url = "http://114.212.189.132:8000/ganglia/last_mtc_avg/" + mtc_name;
	var sum, num;
	var v_arr;
	var xml_http = new XMLHttpRequest();
	xml_http.open("GET",base_url,false);
	xml_http.send();
	
	var str = xml_http.responseText;
	v_arr = str.split(" ");	
	sum = parseFloat(v_arr[0]);
	num = parseInt(v_arr[1]);			
	return sum/num;
}


/*get avg of the requested resource value in last 150s*/
// function get_util_avg(req_url){
//     var count=0, sum = 0;    
//     var xml_http = new XMLHttpRequest();
//     xml_http.open("GET",req_url,false);
//     xml_http.send();
//     xmlDoc = jQuery.parseXML(xml_http.responseText);
//     $(xmlDoc).find('row').each(function(){            
//             var value = parseFloat($(this).children('v').text());
//             if(!isNaN(value)){                
//                 count += 1;
//                 sum += value;
//             }            
//             });    
//     return sum/count;
//   }

/*get specific metric usg data in last hour*/
// function get__data()

/*get specified host's update interval*/
function get_update_host(req_url){            
	var update_time;
	var xml_http = new XMLHttpRequest();
	xml_http.open("GET",req_url,false);
	xml_http.send();
	update_time = parseInt(xml_http.responseText);            
	return update_time;
}

/*function for update Host status Donut*/
function update_host_status(){            
	var num_pair = get_host_num();
	up_num = num_pair[0];            
	down_num = num_pair[1];            
	donut.setData([{
		label: "Hosts Up",
		value: up_num
	}, {
		label: "Hosts Down",
		value: down_num
	}]);
} 		
