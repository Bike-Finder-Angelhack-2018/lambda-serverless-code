const axios = require('axios');
const ACCESS_KEY = require('./config');

exports.handler = async (event) => {
  const latitude = event.queryStringParameters.latitude;
  const longitude = event.queryStringParameters.longitude;
  const searchRadius = event.queryStringParameters.searchRadius || 1;
  
  try {
    const result = await axios.get(`https://api.coord.co/v1/bike/location?latitude=${latitude}&longitude=${longitude}&radius_km=${searchRadius}&access_key=${ACCESS_KEY}`); 
    const bikeData = result.data.features;
    
    const results = [];

    bikeData.forEach((bike) => {
      const bikeLatitude = bike.properties.lat;
      const bikeLongitude = bike.properties.lon;
      const bikeType = bike.properties.location_type;
      const stationName = bike.properties.name;
      const docksAvailable = bike.properties.num_docks_available;
      
      if (docksAvailable > 0) {
        results.push({
          bikeLatitude, 
          bikeLongitude, 
          bikeType, 
          stationName,
          docksAvailable
        });
      }
    return results;
   });
    
    return { 
      body: JSON.stringify(results),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    
  } catch(e) {
    return e;
  }

};
