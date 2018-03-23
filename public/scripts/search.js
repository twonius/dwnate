$('#campaign-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/campaigns?' + search, function(data) {
    $('#campaign-grid').html('');
    data.forEach(function(campaign) {
      $('#campaign-grid').append(`
            <div class="col-sm-3 col-xs-6">
                <div class="card card-block">
                    <a href="/campaigns/${ campaign._id }"><img alt="" class="team-img" src="${ campaign.image }"  style="width: 100%; height: 300px;">
                        <div class="card-title-wrap">
                            <span class="card-title">${ campaign.name }</span>
                        </div>
                        <div class="team-over">
                            <h4 class="hidden-md-down">
                                <a href="/campaigns/${ campaign._id }" class="btn btn-primary"> more info </a>
                            </h4>
                        </div>
                    </a>
                </div>
            </div>
      `);
    });
  });
});

$('#campaign-search').submit(function(event) {
  event.preventDefault();
});
