from django.shortcuts import render,get_object_or_404
from django.http import HttpResponse
from ganglia.models import Resource,Metric,Host
import json
from ganglia.util import str_to_list,res_img,read_ganglia_conf,add_items,reason_func
import os 
import commands 
from sys import stdin,stdout,stderr
import time 


# Create your views here.
def index(request):
    #add content to database
    hname_list = read_ganglia_conf()
    add_items(hname_list)
    #get content from table
    host_list = Host.objects.all()
    resource_list = Resource.objects.all()
#    get_relate(resource_list)
    context = {'resource_list': resource_list,'host_list':host_list}
    return render(request,'ganglia/index.html',context)

def host_info(request,host_id):
    host = get_object_or_404(Host,pk=host_id)
    res_list = Resource.objects.filter(host=host);
    context = {'host':host,'res_list':res_list}    
    return render(request,'ganglia/host.html',context)

def res_info(request,resource_id):    
    res = get_object_or_404(Resource,pk=resource_id)
    mtc_list = Metric.objects.filter(resource=res)
    context = {'res':res,'mtc_list':mtc_list}
    return render(request,'ganglia/res.html',context);

# def detail(request,resource_id):    
#     res = get_object_or_404(Resource,pk=resource_id)
#     metric_list = Metric.objects.filter(resource=res)

#     #generate graph for every metric
#     path_list = res_img(metric_list)

#     mtc_list = []
#     for metric in metric_list:
#         mtc= {}
#         mtc["mtc_name"] = metric.metric_name
#         mtc['img_path'] = path_list[metric.metric_name]
#         mtc_list.append(mtc)
    
#     rel_namelist = reason_func(res.res_name)
#     print rel_namelist
#     rel_list = []
#     for rel_name in rel_namelist:
#         """attention after filter you get a list"""
#         rel_fil = Resource.objects.filter(res_name=rel_name.strip(),res_hostname=res.res_hostname)
#         if not len(rel_fil)==0:
#             rel_list.append(rel_fil[0])
#     return render(request,"ganglia/detail.html",{'resource':res,'metric_list':mtc_list,'relate_list':rel_list})


'''
considering there is one and only one specified cluster
this function generated the according xml of the rrd
'''
def get_text(request, host_name, rrd_name, time_slot):
    base_url = "/var/lib/ganglia/rrds/my_cluster/"
    rrd_path = base_url + host_name + "/" + rrd_name + ".rrd"

    end = "now"    
    if time_slot == "1": 
        start = "end-1h"
        step = "10"
    elif time_slot == "2":
        start = "end-1d"
        step = "240"
    elif time_slot == "3":
        start = "end-1w"
        step = "1200"
    elif time_slot == "4":
        start = "end-1m"
        step = "4000"
    # for index page get resource utilization 
    elif time_slot == "8":      
        start = "end-60"
        step = "15" 
    else:        
        start = "end-600"
        step = "10"
    command = "rrdtool xport --start %s --end %s DEF:ds=%s:sum:AVERAGE:step=%s XPORT:ds:legend" % (start,end,rrd_path,step)
    status,output = commands.getstatusoutput(command)
    return HttpResponse(output)


'''
get the last update time of the host metrics 
return UNIX timestamp and now time interval 
'''
def last_update(request,host_name):
    base_url = "/var/lib/ganglia/rrds/my_cluster/" + host_name + "/load_one.rrd";
    command = "rrdtool lastupdate %s" % base_url
    status,output = commands.getstatusoutput(command)
    '''
    output string format is: 
     sum

     timestamp:  value
    '''
    #get the time stamp
    start = output.rindex("\n") + 1
    end = output.index(":")
    update_time = int(output[start:end])

    now_ts = int(time.time())
    interval = now_ts - update_time;
    return HttpResponse(interval);


