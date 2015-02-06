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


    /*    ***********************************
     ***** End points Starting Here********
     ************************************ */
    //This is fired on the applicatino startup
    app.get('/getallcompanies', function (req, res) {

        try {
            request(mc.solrEP.SOLR + mc.solrEP.getAllCompaniesInitialStart + "&rows=15", function (error, response, companies) {

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
        var tempDataholder = "";
        var customerOverview = "";

        var query = mc.solrEP.SOLR + mc.solrEP.getCustomerOverview + companyId + "&wt=json&indent=true&rows=25";
        var queryNumber = mc.solrEP.SOLR + mc.solrEP.getCallCenterLogCount + companyId + "&fq=isCompany:false&rows=1&wt=json&indent=true";
        var queryRed = mc.solrEP.SOLR + mc.solrEP.getCallCenterLogCount + companyId + "&fq=isCompany:false&fq=callseverity:red&rows=0&wt=json&indent=true";
        var queryGreen = mc.solrEP.SOLR + mc.solrEP.getCallCenterLogCount + companyId + "&fq=isCompany:false&fq=callseverity:green&rows=0&wt=json&indent=true";
        var queryYellow = mc.solrEP.SOLR + mc.solrEP.getCallCenterLogCount + companyId + "&fq=isCompany:false&fq=callseverity:yellow&rows=0&wt=json&indent=true";
        var queryLinkedin = mc.solrEP.SOLR + mc.solrEP.getCallCenterLogCount + companyId + "&fq=isSocial:true&fq=source:linkedin&rows=0&wt=json&indent=true";
        var queryFacebook = mc.solrEP.SOLR + mc.solrEP.getCallCenterLogCount + companyId + "&fq=isSocial:true&fq=source:facebook&rows=0&wt=json&indent=true";
        var queryTwitter = mc.solrEP.SOLR + mc.solrEP.getCallCenterLogCount + companyId + "&fq=isSocial:true&fq=source:twitter&rows=0&wt=json&indent=true";
        //http://ec2-54-200-131-81.us-west-2.compute.amazonaws.com:8983/solr/select?q=companyid:1&fq=isSocial:true&fq=source:facebook&rows=1&wt=json&indent=true
        var something = "";
        try {
            request(query, function (error, response, company) {

                if (!error && response.statusCode === 200) {

                    var tempDataholder = JSON.parse(company);
                    customerOverview = tempDataholder.response.docs[0];

                    request(queryRed, function (error, response, redIssues) {
                        if (!error && response.statusCode === 200) {

                            tempDataholder = JSON.parse(redIssues);
                            customerOverview.redIssues = tempDataholder.response.numFound;

                            request(queryGreen, function (error, response, greenIssues) {
                                if (!error && response.statusCode === 200) {

                                    tempDataholder = JSON.parse(greenIssues);
                                    customerOverview.greenIssues = tempDataholder.response.numFound;

                                    request(queryYellow, function (error, response, yellowIssues) {
                                        if (!error && response.statusCode === 200) {
                                            tempDataholder = JSON.parse(yellowIssues);
                                            customerOverview.yellowIssues = tempDataholder.response.numFound;

                                            request(queryLinkedin, function (error, response, linkedinPosts) {
                                                if (!error && response.statusCode === 200) {
                                                    tempDataholder = JSON.parse(linkedinPosts);
                                                    customerOverview.linkedinPosts = tempDataholder.response.numFound;

                                                    request(queryFacebook, function (error, response, facebookPosts) {
                                                        if (!error && response.statusCode === 200) {
                                                            tempDataholder = JSON.parse(facebookPosts);
                                                            customerOverview.facebookPosts = tempDataholder.response.numFound;

                                                            request(queryTwitter, function (error, response, twitterPosts) {

                                                                tempDataholder = JSON.parse(twitterPosts);
                                                                customerOverview.twitterPosts = tempDataholder.response.numFound;

                                                                return res.send(customerOverview)
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }

                            });
                        }
                        //return res.send(customerOverview); return res.send(customerOverview)
                    });

                } else {
                    return res.send("Error Getting Basic data.", 500);
                }
            });
        }
        catch (err) {
            return res.send(err, 500);
        }
    });

    app.get('/getlogs', function (req, res) {

        var companyId = req.param('id');
        var query = mc.solrEP.SOLR + mc.solrEP.getCallLogs + companyId + "&fq=isCompany:false&rows=25&wt=json&indent=true"; // and is social=false;
        try {
            request(query, function (error, response, company) {

                if (!error && response.statusCode === 200) {

                    var customerOverview = JSON.parse(company);

                    return res.send(customerOverview.response.docs);
                } else {
                    return res.send("Points of Light is currently not available. Please try later.", 500);
                }
            });
        }
        catch (err) {
            return res.send(err, 500);
        }
    });

    app.get('/getsocial', function (req, res) {

        var companyId = req.param('id');

        var query = mc.solrEP.SOLR + mc.solrEP.getCallLogs + companyId + "&fq=isSocial:true&wt=json&indent=true";
        try {
            request(query, function (error, response, socialdata) {

                if (!error && response.statusCode === 200) {

                    var customerOverview = JSON.parse(socialdata);

                    return res.send(customerOverview.response.docs);
                } else {
                    return res.send("Points of Light is currently not available. Please try later.", 500);
                }
            });
        }
        catch (err) {
            return res.send(err, 500);
        }
    });

    app.get('/getsinglecompany', function (req, res) {

        var companyId = req.param('id');

        var query = mc.solrEP.SOLR + mc.solrEP.getSingleCompany + companyId + "&fq=isCompany:true&fl=fname,lname,id,email,companyname&wt=json&indent=true";

        try {
            request(query, function (error, response, socialdata) {

                if (!error && response.statusCode === 200) {

                    var customerOverview = JSON.parse(socialdata);

                    return res.send(customerOverview.response.docs);
                } else {
                    return res.send("Points of Light is currently not available. Please try later.", 500);
                }
            });
        }
        catch (err) {
            return res.send(err, 500);
        }
    });

    app.get('/searchasyoutype', function (req, res) {

        var searchTerm = req.param('id');

        var query = mc.solrEP.SOLR + mc.solrEP.searchAsYouType + searchTerm + "~1" + "&wt=json&rows=15&indent=true";
   var aaa;
        try {
            request(query, function (error, response, socialdata) {

                if (!error && response.statusCode === 200) {
                    var customerOverview = JSON.parse(socialdata);

                    return res.send(customerOverview.response.docs);
                } else {
                    return res.send("Points of Light is currently not available. Please try later.", 500);
                }
            });
        }
        catch (err) {
            return res.send(err, 500);
        }
    });

    app.get('/getcalllogcount', function (req, res) {

        var companyId = req.param('id');

        var query = mc.solrEP.SOLR + mc.solrEP.getCallCenterLogCount + companyId + "&fq=isCompany:false&rows=1&wt=json&indent=true";

        try {
            request(query, function (error, response, logObject) {

                if (!error && response.statusCode === 200) {
                    var logObjectData = JSON.parse(logObject);

                    return res.send(logObjectData.response.docs);
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