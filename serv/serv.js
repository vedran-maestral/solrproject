process.env.NODE_ENV = "production";
var mainEndPoint = "http://ec2-54-200-131-81.us-west-2.compute.amazonaws.com:8983/";

var mc = (require('../mainConfig.js')());
var request = require('request');

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-type, Authorization, Content-Length, X-Requested-With, Origin, Accept');

    res.header("Cache-Control", "no-cache", "must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", -1);

    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
};

var path = require("path"),
    express = require("express"),
    app = express();


app.configure('production', function () {
    var oneYear = 0;         //31557600000
    app.set('port', process.env.PORT || 80);
    app.use(express.compress());
    app.use(allowCrossDomain);
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(express.static(__dirname + './../', { maxAge: oneYear }));
    console.log("SERVING PROUDLY ALL YOUR NEEDS !!!");

    /*    ***********************************
     ***** End points Starting Here********
     ************************************ */
    //This is fired on the applicatino startup
    app.get('/getallcompanies', function (req, res) {

        //var mainEndPoint = "http://ec2-54-200-131-81.us-west-2.compute.amazonaws.com:8983/";

        //var solrGetCompanies = mainEndPoint + "solr/select?q=isCompany:true&fl=fname,lname,id,email,companyname&wt=json&indent=true";


        try {
            request(mc.solrEP.SOLR + mc.solrEP.getAllCompaniesInitialStart, function (error, response, companies) {

                if (!error && response.statusCode === 200) {

                    var allCompanies = JSON.parse(companies);
                    //todo. Add another layer of defense regarding user location???

                    return res.send(allCompanies.response);
                } else {
                    return res.send("Companie not available. Please try later.", 500);
                }
            });
        }
        catch (err) {
            return res.send(err, 500);
        }
    });

    app.get('/getcustomeroverview', function (req, res) {

        var companyId = req.param('id');

        var query = mc.solrEP.SOLR + mc.solrEP.getCustomerOverview + companyId + "&wt=json&indent=true";
        try {
            request(query, function (error, response, company) {

                if (!error && response.statusCode === 200) {

                    var customerOverview = JSON.parse(company);

                    return res.send(customerOverview.response.docs[0]);
                } else {
                    return res.send("Points of Light is currently not available. Please try later.", 500);
                }
            });
        }
        catch (err) {
            return res.send(err, 500);
        }
    });

    app.get('/getlogs', function (req, res) {

        var companyId = req.param('id');
//http://ec2-54-200-131-81.us-west-2.compute.amazonaws.com:8983/solr/select?q=companyid:1&wt=json&indent=true
        var query = mc.solrEP.SOLR + mc.solrEP.getCallLogs + companyId + "&wt=json&indent=true";
        try {
            request(query, function (error, response, company) {

                if (!error && response.statusCode === 200) {

                    var customerOverview = JSON.parse(company);

                    return res.send(customerOverview.response.docs[0]);
                } else {
                    return res.send("Points of Light is currently not available. Please try later.", 500);
                }
            });
        }
        catch (err) {
            return res.send(err, 500);
        }
    });


});
app.listen(80);