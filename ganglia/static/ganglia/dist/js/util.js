function mem_data_modify(data){
    var new_data = [];
    var v;
    for( var i=0; i<data.length; i++){
        v = (data[i][1]/1000000).toFixed(2);
        new_data.push([data[i][0],v]);
    }
    return new_data;
}