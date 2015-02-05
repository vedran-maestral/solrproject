$(document).ready(function () {

    var getCompaniesEP = "getallcompanies",
        getCustomerOverviewEP = "getcustomeroverview",
        getCallCenterLogEP = "getlogs",
        getSocialMediaEP = "getsocial",
        getSingleCompanyEP = "getsinglecompany",
        getSearchAsYoutype = "searchasyoutype";


    function getAllCompanies() {
        var numberOfRecords = 0;

        $.ajax({
            url: navapp.clientLocation + getCompaniesEP, //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            //async: false,
            dataType: "json",
            crossDomain: true,
            success: function (data) {

                 numberOfRecords = data.numFound;

                data.docs.forEach(function (key, index, whole) {
                    $('#navigator-table tr:last').before('' +
                        '<tr id="' + key.id + '" class="table-row getnavobject"><td class="table-cell">' + key.companyname + '</td>' +
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
                console.log(e.currentTarget.id);
                navapp.id = e.currentTarget.id;
            });
            Messenger().post({
                message: "Total records Found - " + numberOfRecords + "<br>" + "Displaying first 20",
                hideAfter: 6
            });

           /* for (var i=0; i < numberOfPages; i++){
                var html;
                html = "<a href='http://www.w3schools.com'>"+ i + "</a>" + " ";
                $("#paginator").append(html);
            }*/
        });
    }

    getAllCompanies();

    function searchAsYouType() {

        var companyName = $("#search-text").val();

        if (companyName === "") {
            $("#table-body").empty().append(" <tr> </tr>");
            getAllCompanies();
            return;
        }
        debugger;

        $.ajax({
            url: navapp.clientLocation + getSearchAsYoutype + "?id=" + companyName, //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            //async: false,
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                debugger;
                if (data.length === 0) {
                    return;
                }
                $("#table-body").empty();
                data.forEach(function (key, index, whole) {
                    $("#table-body").append(" <tr> </tr>");
                    $('#navigator-table tr:last').before('' +
                        '<tr id="' + key.id + '" class="table-row getnavobject"><td class="table-cell">' + key.companyname + '</td>' +
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
                console.log(e.currentTarget.id);
                navapp.id = e.currentTarget.id;

                Messenger().post({
                    message: "Selected - record with ID: " + navapp.id,
                    hideAfter: 6
                });
            });
        });
    }

    function singleCompanySearch() {
        $("#table-body").empty().append(" <tr> </tr>");

        var companyId = $("#search-id-text").val();

        if (companyId === "") {
            getAllCompanies();
            return;
        }

        $.ajax({
            url: navapp.clientLocation + getSingleCompanyEP + "?id=" + parseInt(companyId), //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            //async: false,
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                data.forEach(function (key, index, whole) {
                    $('#navigator-table tr:last').before('' +
                        '<tr id="' + key.id + '" class="table-row getnavobject"><td class="table-cell">' + key.companyname + '</td>' +
                        '<td class="table-cell">' + key.id + '</td>' +
                        '<td class="table-cell">' + key.email + '</td>' +
                        '<td class="table-cell">' + key.fname + '</td>' +
                        '<td class="table-cell">' + key.lname + '</td>' +
                        '</td></tr>');
                })
            }
        }).fail(function (err) {

        }).done(function (key) {
            $(".getnavobject").on("click", function (e) {

                $("#maintabs").show();
                console.log(e.currentTarget.id);
                navapp.id = e.currentTarget.id;
            });
            Messenger().post({
                message: "Found - record with ID: " + key.id,
                hideAfter: 6
            });

        });
    }

    //Register event handlers
    $("#customer-overview").on("click", showCustomerOverview);
    $("#call-center").on("click", showCallCenterLogs);
    $("#social-media").on("click", showSocialMedia);

    $("#searchid-button").on("click", singleCompanySearch);

    $("#search-id-text").on("keyup", function (e) {
        debugger;
        if (e.which === 13) {
            singleCompanySearch();
        }
    });

    $("#temp-button").on("click", searchAsYouType);

    $("#search-text").on("keyup", searchAsYouType);

    function showCustomerOverview() {

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

    function showCallCenterLogs() {
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

    function showSocialMedia() {
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
});