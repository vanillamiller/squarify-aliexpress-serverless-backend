# Squarify AliExpress Serverless Backend

This is the serverless backend to the Squarify AliExpress proof of concept web app that scrapes the relevant data from a provided AliExpress item page url and then maps it to a human readable format with the relevant details. This is then edited by the user and sent to their Square store as catalog items with associated options.

NOTE: Options are a relatively newer Square feature which is currently being rolled out as has not reached all users dashboards.

It consists of 3 api gateway endpoints and 1 custom authorizer.

This package utilizes jwt for authorization and as it is designed as a Square middleware application has no persistent database. Instead of storing the Oauth2 tokens in such a database, the Square Oauth2 auth and refresh tokens are encrypted with AES-256-gcm and sent along with the jwt.

SquareConnect npm package was not used due to its size and the wish to keep the lambda functions as uncluttered as possible (SquareConnect is just over 2MB, while this whole package is < 200 KB)

## Getting started

To use this package you must be a Square developer with a published app, as you will need an application id and also access to Square-connect v2 apis.

- [ ] You will need to configure the environment variables found in serverless.yml with the following values:
    - [ ] CLIENT_ID = your application id from the Square Developer dashboard.
    - [ ] CLIENT_SECRET = your client secret from the application dashboard
    - [ ] MASTER_KEY = should be a 256 bit string that would constitute a cryptographically strong password. This will be converted into a cryptographic buffer which is much stronger than using the standard string as the key in the encryption.js module.

- [ ] You will need to fill the public.key and private.key with a cryptographically valid private/public RSA256 key pair. These are used to sign and verify the jwt and can be easily generated here https://travistidwell.com/jsencrypt/demo/ or through OpenSSL command line https://rietta.com/blog/openssl-generating-rsa-key-from-command/

- [] To deploy, if you don't already have an AWS account, you will need to make one and I STRONGLY recommend that you create an IAM user with admin priveledges and never use your root account for anything besides billing, if that.

## Testing

I personally use `curl` from the terminal, however you can use Postman, the API-Gateway console or any other api invoking program you are comfortable with.

