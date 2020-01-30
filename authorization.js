'use strict';

// more or less a redundant step but hides client id from the user by not directly inserting it into the link.
module.exports.authorizer = async event => {
  // const id=process.env.CLIENT_ID;
  const id = "sandbox-sq0idb-9-aHuRqCAFAbgjNyoQy9RA";
  const url="https://squareupsandbox.com/oauth2/authorize?client_id=" + id + "&scope=INVENTORY_WRITE"
  const response = {
    statusCode: 301,
    headers: {
        Location: url
      }
    };

  return response;

};
