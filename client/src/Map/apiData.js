const axios = require("axios");

async function getMapData() {
  let res;
  try {
    const data = {
      address: "Hello Future",
      coordinates: {
        lat: 37.7590624,
        lng: -122.4140595,
      },
      radius: 1,
    };
    res = await axios.post("/api/map/data", data);
  } catch (error) {
    console.log(error);
  }
  return res;
}

getMapData()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
