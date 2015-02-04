$(document).ready(function () {

   var getCompaniesEP = "getallcompanies",
       getCustomerOverviewEP = "getcustomeroverview",
       getCallcenterEP = "",
       getSocialMediaEP = "";

    var mainIntroQuery = "solr/select?q=isCompany:true&fl=fname,lname&wt=json&indent=true";

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
    $("#call-center").on("click", showCallCenter);
    $("#social-media").on("click", showSocialMedia);



    function showCustomerOverview () {
        var getCustomerOverview = "http://localhost/getallcompanies";
        var source   = $("#ribbon-template").html();
        var template = Handlebars.compile(source);

        //var widgetRenderer = Handlebars.compile(widgetTemplate);


        $.ajax({
            url: navapp.clientLocation + getCustomerOverviewEP + "?id=" + navapp.id, //TO DO Get this from config
            //data: JSON.stringify(navapp),
            contentType: "text/plain",
            type: 'POST',
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                $("#ribbon-container").html(template(data));
debugger;
            }
        }).fail(function (err) {

        }).done(function () {

        });


    };

    function showCallCenter () {
        $.ajax({
            url: getCompanies, //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            //async: false,
            dataType: "json",
            crossDomain: true,
            success: function (data) {

            }
        }).fail(function (err) {

        }).done(function () {

        });
        alert("I am call center");
    };

    function showSocialMedia () {
        $.ajax({
            url: getCompanies, //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            //async: false,
            dataType: "json",
            crossDomain: true,
            success: function (data) {

            }
        }).fail(function (err) {

        }).done(function () {

        });
        alert("I am social media");
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