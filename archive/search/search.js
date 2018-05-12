 $(() => {


  var data = {
    resource_id: '54566d76-a809-4959-8622-61dc30b3114d', // the resource id
    limit: 5, // get 5 results
    sql: 'SELECT * FROM "54566d76-a809-4959-8622-61dc30b3114d"' // query for 'jones'
  };
  $.ajax({
    url: 'https://data.gov.au/api/3/action/datastore_search_sql',
    data: data,
    dataType: 'jsonp',
    success: function(data) {
      console.log('Total results found: ' + data.result.total)

    },
    cache:true
  });

})