

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const request = require("request");
const https= require("https");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public")); // ****VERY VERY IMP this is a very imp function basically one very imp thing to note is the files styles.css and image files are static(kept in our PC and not hosted anywhere like bootstrap CDN), so to handle these files or to make our server include this with main html file we need to use this function which allows server to pick up all static files from server pc and reflect their functionality the argument of this is one folder name where all those such files are kept in this case public *****

app.get("/",function(req,res){
  res.sendFile( __dirname +  "/signup.html");

});

app.post("/",function(req,res){
  const firstName=req.body.fname;
  const lastName=req.body.lname;
  const email=req.body.email;
  //**** Code to post data on mailchimp list entered by users****
  const data={        // basically here we need to store our subscriber data in our mailchimp API lists and for that it can be done in JSON format so first we need to create a JS object and put our inputted data bu host in that object and then convert that object in JSON format using stringify function
    members: [
      {
        email_address: email,
        status: "subscribed",     // all this can be referenced from mailchimp API documentation
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);
  // now in previous weather website we just make get request to fetch some data from the API but here we need to post data entered by the host(user) to the mailchimp list so for that we need to use diff functions of htpps native module and by checking the documentation we can see we should use a request sub-module to post some data on external server-API
  const url="https://us19.api.mailchimp.com/3.0/lists/uniquekey"; //adding endpoint as the URL  BEWARE OF YOUR usX server replace  X in default url link wiht your server number i.e 19 here
  // basically this options is an argument associated with the https.request() function it is very imp basically it is to specify what things are needed to be done by request function like method,authentication etc. check its documentation for more
  const options={
    method: "POST",
    auth: "harsh77:apikey"       // this authorization is for our list used check its documentation on mailchimp and request-options doc
   // auth: "username:pass(API key)"
  }

  const request=https.request(url,options,function(response){

    if(response.statusCode===200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));        // now most importantly we need to post our data entered bu user to the mailchimp list so we need to store this request in some variable and later on use it to post
    });
  });

  request.write(jsonData);
  request.end();

});

// basically this is for redirecting using try again button on failure page
app.post("/failure",function(req,res){
  res.redirect("/");
});
app.listen( process.env.PORT || 3000,function(){    // here as we are deploying our dynamic site to heoku servers their servers can use any port yo listen so for that use process.env.PORT command and we can use it with 3000 as or so as to use locally too
  console.log("Hello console from port 3000");
});


// one very imp think to note is if any time you get any error while deploying a server use **** heroku logs***** to get the error

// it is very imp to create a Procfile as basically for heroku servers after they receive host request they need to return our site so we need to write web: node ourfilename.js (JS file from which our site should load first)
