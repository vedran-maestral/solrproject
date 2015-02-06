$(document).ready(function () {

    var getCompaniesEP = "getallcompanies",
        getCustomerOverviewEP = "getcustomeroverview",
        getCallCenterLogEP = "getlogs",
        getSocialMediaEP = "getsocial",
        getSingleCompanyEP = "getsinglecompany",
        getSearchAsYoutype = "searchasyoutype",
        getCallCenterStat = "getcalllogcount";


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
                $("#table-body").empty().append(" <tr> </tr>");
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
                navapp.id = e.currentTarget.id;

                Messenger().post({
                    message: "Selected record ID - " + e.currentTarget.id + "<br>",
                    hideAfter: 6
                });

            });
            Messenger().post({
                message: "Total records Found - " + numberOfRecords + "<br>" + "Displaying first 20",
                hideAfter: 6
            });
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

        $.ajax({
            url: navapp.clientLocation + getSearchAsYoutype + "?id=" + companyName, //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            //async: false,
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                if (data.length === 0) {
                    Messenger().post({
                        message: "No match found",
                        hideAfter: 2
                    });
                    return;
                }
                $("#table-body").empty();

                Messenger().post({
                    message: "Found: " + data.length,
                    hideAfter: 2
                });

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
        if (e.which === 13) {
            singleCompanySearch();
        }
    });

    $("#temp-button").on("click", searchAsYouType);

    $("#search-text").on("keyup", searchAsYouType);

    function showCustomerOverview() {

        $("#main-container").empty();


        var source = $("#ribbon-template").html();
        var sourceDisplay = $("#customer-overview-template").html();

        var templateRibbon = Handlebars.compile(source);
        var templateDisplay = Handlebars.compile(sourceDisplay);

        $("#loaderIcon").append("<img id='theImg' src='./img/preloader.gif'/>");
        $.ajax({
            url: navapp.clientLocation + getCustomerOverviewEP + "?id=" + navapp.id, //TO DO Get this from config
            //data: JSON.stringify(navapp),
            contentType: "text/plain",
            type: 'GET',
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                debugger;
                $("#ribbon-header").html(templateRibbon(data));
                $("#main-container").append(templateDisplay(data));

                $('#loaderIcon').empty();

                var riskValues = new JustGage({
                    id: "riskValues",
                    value: data.riskvalues,
                    min: 0,
                    max: 100,
                    title: "Risk Values",
                    label: "",
                    shadowOpacity: 1,
                    shadowSize: 0,
                    shadowVerticalOffset: 10
                });

                var trashHoldValues = new JustGage({
                    id: "trashHold",
                    value: 50,
                    min: 0,
                    max: 100,
                    title: "Trashhold Value",
                    label: "",
                    startAnimationTime: 2000,
                    startAnimationType: ">",
                    refreshAnimationTime: 1000,
                    refreshAnimationType: "bounce"
                });

                //gauge graphics
             /*   var red = new JustGage({
                    id: "redIssues",
                    value: data.redIssues,
                    min: 0,
                    max: 100,
                    title: "Red Issues",
                    levelColors: [
                        "#ef1a1a",
                        "#ef1a1a",
                        "#ef1a1a"
                    ]
                });

                var green = new JustGage({
                    id: "greenIssues",
                    value: data.greenIssues,
                    min: 0,
                    max: 100,
                    title: "Green",
                    levelColors: [
                        "#7bdb1c",
                        "#7bdb3c",
                        "#7bdb4c"
                    ]
                });

                var yellow = new JustGage({
                    id: "yellowIssues",
                    value: data.yellowIssues,
                    min: 0,
                    max: 100,
                    title: "Yellow Issues",
                    levelColors: [
                        "#faff00",
                        "#faff00",
                        "#faff00"
                    ]
                });
*/
                setInterval(function() {
                    trashHoldValues.refresh(getRandomInt(45, 50));
                }, 2500);

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

        $("#loaderIcon").append("<img id='theImg' src='./img/preloader.gif'/>");
        $.ajax({
            url: navapp.clientLocation + getCallCenterLogEP + "?id=" + navapp.id, //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                $('#loaderIcon').empty();
                $("#ribbon-header").html(templateRibbon(data));
                data.forEach(function (key) {
                    key.calllogdate = new Date(key.calllogdate);   //new Date(1382086394000)
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

        $("#main-container").empty();

        $("#loaderIcon").append("<img id='theImg' src='./img/preloader.gif'/>");
        $.ajax({
            url: navapp.clientLocation + getSocialMediaEP + "?id=" + navapp.id, //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            //async: false,
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                $('#loaderIcon').empty();
                $("#ribbon-header").html(templateRibbon(data));
                    data.forEach(function (key) {
                      key.post = key.post.replace("�", "'");
                    $("#main-container").append(templateDisplay(key));
                });
            }
        }).fail(function (err) {

        }).done(function () {

        });
    };
});