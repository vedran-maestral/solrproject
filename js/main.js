$(document).ready(function () {

   var getCompaniesEP = "getallcompanies",
       getCustomerOverviewEP = "getcustomeroverview",
       getCallCenterLogEP = "getlogs",
       getSocialMediaEP = "getsocial";

    $.ajax({
        url: navapp.clientLocation + getCompaniesEP, //TO DO Get this from config
        data: "",//JSON.stringify(stuffToSend),
        contentType: "text/plain",
        type: 'GET',
        //async: false,
        dataType: "json",
        crossDomain: true,
        success: function (data) {
            data.docs.forEach(function (key, index, whole){
                $('#navigator-table tr:last').before('' +
                    '<tr id="'+key.id+'" class="table-row getnavobject"><td class="table-cell">' + key.companyname + '</td>' +
                    '<td class="table-cell">' + key.id + '</td>' +
                    '<td class="table-cell">' + key.email + '</td>' +
                    '<td class="table-cell">' + key.fname + '</td>' +
                    '<td class="table-cell">' + key.lname + '</td>' +
                    '</td></tr>');
            })
        }
    }).fail(function (err) {

    }).done(function () {
        $(".getnavobject").on("click", function (e) {

            $("#maintabs").show();
           //$("#call-center").show();
            //$("#social-media").show();
            console.log(e.currentTarget.id);
            navapp.id = e.currentTarget.id;

        });
    });

    //Register event handlers
    $("#customer-overview").on("click", showCustomerOverview);
    $("#call-center").on("click", showCallCenterLogs);
    $("#social-media").on("click", showSocialMedia);


    function showCustomerOverview () {

        $("#main-container").empty();
        var getCustomerOverview = "http://localhost/getallcompanies";
        var source = $("#ribbon-template").html();
        var sourceDisplay = $("#customer-overview-template").html();

        var templateRibbon = Handlebars.compile(source);
        var templateDisplay = Handlebars.compile(sourceDisplay);

        $.ajax({
            url: navapp.clientLocation + getCustomerOverviewEP + "?id=" + navapp.id, //TO DO Get this from config
            //data: JSON.stringify(navapp),
            contentType: "text/plain",
            type: 'GET',
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                $("#ribbon-header").html(templateRibbon(data));
                $("#main-container").append(templateDisplay(data));
            }
        }).fail(function (err) {

        }).done(function () {

        });
    };

    function showCallCenterLogs () {
        var source = $("#ribbon-template").html();
        var templateRibbon = Handlebars.compile(source);
        var sourceDisplay = $("#call-center-template").html();
        var templateDisplay = Handlebars.compile(sourceDisplay);

        $("#main-container").empty();

        $.ajax({
            url: navapp.clientLocation + getCallCenterLogEP + "?id=" + navapp.id, //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                $("#ribbon-header").html(templateRibbon(data));
                data.forEach(function (key) {
                    $("#main-container").append(templateDisplay(key));
                });

            }
        }).fail(function (err) {

        }).done(function () {

        });

    };

    function showSocialMedia () {
        var source = $("#ribbon-template").html();
        var templateRibbon = Handlebars.compile(source);
        var sourceDisplay = $("#social-media-template").html();
        var templateDisplay = Handlebars.compile(sourceDisplay);

        $.ajax({
            url: navapp.clientLocation + getSocialMediaEP + "?id=" + navapp.id, //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            //async: false,
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                $("#ribbon-header").html(templateRibbon(data));
                data.forEach(function (key) {
                    debugger;
                    $("#main-container").append(templateDisplay(key));
                });
            }
        }).fail(function (err) {

        }).done(function () {

        });
    };



   /* $("#searchbutton").on("click", searchSOLR);
    $("#searchValue").keyup(function (e) {
        if (e.which === 13) {
            searchSOLR();
        }
    });*/








    function searchSOLR() {

        var searchCriteria = $("#solrsearchcriteria").val();

        $("#contentholder").empty();
        $("#totalresults").empty();
        $("#returnedresults").empty();

        var searchParam = $("#searchValue").val();

        var html = "";

        var data = {"query": {
            "term": { "description": searchParam },
            "size": "50"
        }};

        //var searchStringSOLR = "http://ec2-54-68-99-106.us-west-2.compute.amazonaws.com:8983/solr/select?q=description:" + searchParam + "&wt=json&indent=true";
        var searchStringSOLR = "http://ec2-54-148-31-2.us-west-2.compute.amazonaws.com:8983/solr/select?q=" + searchCriteria + ":" + searchParam + "&wt=json&indent=true";


        $.ajax({
            url: searchStringSOLR,
            type: 'POST',
            // contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            crossDomain: true,
            data: JSON.stringify(data),
            success: function (data) {
                var totalresults = data.response.numFound;

                $("#totalresults").append("Total Results: " + totalresults);
                $("#returnedresults").append("Returned results: " + data.response.docs.length + "<br>" + "<hr>");

                if(searchCriteria === "id" && data.response.numFound > 0) {

                    console.log("Hello There");

                    var description =  data.response.docs[0].description;
                    var id = data.response.docs[0].id;

                    html = "You are correcting id: " + id + "<br>" + "<input id='editdescription' placeholder='"+ description +"'>" + "<br>" +
                        "<button id='savebtn' type='button'>Save</button> " ;


                    $("#contentholder").append(html);
                    return;
                }

                for (var i = 0; i < totalresults; i++) {
                    html = "";
                    var id = data.response.docs[i].id;
                    var subject = data.response.docs[i].subject;
                    var weight = data.response.docs[i].weight;
                    //var title =data.response.docs[i].title;
                    var description = data.response.docs[i].description;
                    html = "This is id: " + "<i>" + id + "</i>" + "<br>" + "Person name is: " + subject + "<br>" + "Description Field: " + description + "<br>" + "Product Weight: " + weight + "<hr>";
                    $("#contentholder").append(html);
                }


                console.log("And this is success: " + data);
                // $("#contentholder").text(data);
            }
        }).fail(function (error) {
            console.log("Search Failed")
        })
    }

////////////////////////////////////////////////////////
//*ADDING THE STUFF TO SOLR SEARCH ON AMAZON AWS*///
//////////////////////////////////////////////////////
    function postOnElastic(postNumber) {

        var that = this;


        for (var i = 177620; i < 33000000; i++) {

            var randomPhrase = MMPhraseGenerator.phrase();
            var randomName = MMPhraseGenerator.name();

            var data = {
                id: "mistraltech" + i,
                weight: 1 + i,
                subject: randomName,
                description: randomPhrase,
                porezniobveznik: "Yes"
            };

            var stuffToSend = [];

            stuffToSend.push(data);

            $.ajax({
                url: 'http://ec2-54-148-31-2.us-west-2.compute.amazonaws.com:8983/solr/update/json?commit=true', //TO DO Get this from config
                data: JSON.stringify(stuffToSend),
                contentType: "text/plain",
                type: 'POST',
                //async: false,
                dataType: "json",
                crossDomain: true,
                success: function (data) {
                    console.log("Indexed so far: " + i);

                }
            }).fail(failedPost)
        }

        function failedPost(error) {
            console.log("Something went wrong" + error);
        }
    }
})