// https://data.gov.au/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"54566d76-a809-4959-8622-61dc30b3114d"%20as%20a%20WHERE%20CAST(a."Female"%20as%20BOOL)%20=%20True
$(() => {
    $.getJSON({
        url: 'https://data.gov.au/api/3/action/datastore_search?callback=?',
        data: {
            resource_id: '54566d76-a809-4959-8622-61dc30b3114d', // the resource id
            limit: 2,
            filters: '{"Female":"True", "Town":"Sydney"}' // query for 'jones'
        },
        dataType: 'jsonp',
        success: (data) => {
            console.log('Total results found: ' + data.result.total);
            for(var i = 0 ; i < data.result.total ; i++){
                //console.log('Data: ' + data.result.records[i].ToiletID)
                console.log(JSON.stringify(data.result.records[i]));
            }
            
        },
        cache: true,
        // processData: false
    });

    console.log("done");
}
);
