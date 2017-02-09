console.log('LOADING KEYS:', __key__);

const auth = __key__;

 var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret,
};

const buildYelpContainer = yelpObj => {
  let name = yelpObj.name;
  let phone = yelpObj.phone;
  let rating = yelpObj.rating;
  let ratingCount = yelpObj.review_count;
  let image = yelpObj.image_url;

  let $container = $('<div><div/>');

  let $name = $('<div>NAME: ' + name + '<div/>');
  let $phone = $('<div>PHONE: ' + phone + '<div/>');
  let $rating = $('<div>RATING: ' + rating + '<div/>');
  let $ratingCount = $('<div>RATING COUNT: ' + ratingCount + '<div/>');
  let $image = $('<img src="' + image + '">');

  $container.append($name);
  $container.append($phone);
  $container.append($rating);
  $container.append($ratingCount);
  $container.append($image);
  $container.append('<div> <div/>');
  $('#app').append($container);
};

function cb(data) {
  console.log('GOT DATA');        
  console.log(data.businesses);
  data.businesses.forEach(i => {
    buildYelpContainer(i);
  });
}

const yelpQuery = (queryz) => {
  let terms = queryz;
  let location = 'Diamond+Bar';

  let parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['location', location]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  const message = {
    'action' : 'https://api.yelp.com/v2/search',
    'method' : 'GET',
    'parameters' : parameters,
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  const parameterMap = OAuth.getParameterMap(message.parameters);

  $.ajax({
    'url' : message.action,
    'data' : parameterMap,
    'dataType' : 'jsonp',
    'jsonpCallback' : 'cb',
    'cache': true
  })
  .done(function(data, textStatus, jqXHR) {
    // console.log('success[' + data + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
  });
};

const eventListeners = () => {
  console.log('LOADING event listeners...');
  $('button').on('click', () => {
    let query = $('input').val();
    yelpQuery(query);
  });
};

const main = () => {
  eventListeners();
};

main();