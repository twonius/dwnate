$('#campaign-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/campaigns?' + search, function(data) {
    $('#campaign-grid').html('');
    data.forEach(function(campaign) {
      $('#campaign-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ campaign.image }">
            <div class="caption">
              <h4>${ campaign.name }</h4>
            </div>
            <p>
              <a href="/campaigns/${ campaign._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#campaign-search').submit(function(event) {
  event.preventDefault();
});
