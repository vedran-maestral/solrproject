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
                //$("#maintabs").show();
                navapp.id = e.currentTarget.id;
               //First - Show Second Screen

                getRibbonHeader(e.currentTarget.id);
                //showMainCenterPanel();

                $(this).addClass('selected').siblings().removeClass("selected");
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
                navapp.id = e.currentTarget.id;
                //First - Show Second Screen

                getRibbonHeader(e.currentTarget.id);
                //showMainCenterPanel();

                $(this).addClass('selected').siblings().removeClass("selected");
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
                getRibbonHeader(e.currentTarget.id);
            });
            Messenger().post({
                message: "Found - record with ID: " + key.id,
                hideAfter: 6
            });
        });
    }

    /***********************************
     ********Event Handlers Kingdom******
     ************************************/
        //Register event handlers
    $(document).on("click", "#customer-overview", showCustomerOverview);


    $(document).on("click", "#call-center", showCallCenterLogs);

    $(document).on("click","#social-media", showSocialMedia);


    $("#searchid-button").on("click", singleCompanySearch);

    $("#search-id-text").on("keyup", function (e) {
        if (e.which === 13) {
            singleCompanySearch();
        }
    });

    $("#temp-button").on("click", searchAsYouType);
    $("#search-text").on("keyup", searchAsYouType);

    $(document).on("click","#resetMainControlPanel", function(){
        showMainCenterPanel();
    });


    $(document).on("click",".returntomain", function(){
        $("#navigator-table").show();
        $("#search-container").show();
        $("#call-center-main").hide();
        $("#data-holder").hide();
    });


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

                $("#thirdlink").text("Customer Overview");
                $("#maintabs").hide();
                $("#ribbon-header").html(templateRibbon(data));
                $("#currentdata").append(templateDisplay(data));

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

                setInterval(function () {
                    trashHoldValues.refresh(getRandomInt(45, 50));
                }, 2500);
            }
        }).fail(function (err) {

        }).done(function () {
            $(".getnavobject").on("click", function (e) {
                $("#maintabs").show();
                navapp.id = e.currentTarget.id;
                $(this).addClass('selected').siblings().removeClass("selected");
                Messenger().post({
                    message: "Selected record ID - " + e.currentTarget.id + "<br>",
                    hideAfter: 6
                });
            });
        });
    };

    function showCallCenterLogs() {
        var sourceRibbon = $("#ribbon-template").html(),
            templateRibbon = Handlebars.compile(sourceRibbon),
            sourceDisplay = $("#call-center-template").html(),
            templateDisplay = Handlebars.compile(sourceDisplay),
            tempDate;

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
                $("#thirdlink").text("Call Center Logs");
                $("#maintabs").hide();

                data.forEach(function (key) {
                    tempDate = new Date(key.calllogdate);
                    key.calllogdate = tempDate.toUTCString();//tempDate.toDateString());
                    //$("#data-holder").append(templateDisplay(key));
                    $("#currentdata").append(templateDisplay(key));
                });
            }
        }).fail(function (err) {

        }).done(function () {
        });
    };

    function showSocialMedia() {
        var source = $("#ribbon-template").html(),
            templateRibbon = Handlebars.compile(source),
            sourceDisplay = $("#social-media-template").html(),
            templateDisplay = Handlebars.compile(sourceDisplay);

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
                $("#thirdlink").text("Social Media Logs");
                $("#maintabs").hide();

                $("#ribbon-header").html(templateRibbon(navapp.headerObject));
                data.forEach(function (key) {
                    key.post = key.post.replace("�", "'");
                    $("#currentdata").append(templateDisplay(key));
                });
            }
        }).fail(function (err) {

        }).done(function () {

        });
    };

    /*
     These functions should be extenralized in separate module:
     */
    function getRibbonHeader(companyId) {
        //populate the app mofdel object with curren tcompany data
        console.log(companyId);
        $.ajax({
            url: navapp.clientLocation + getSingleCompanyEP + "?id=" + parseInt(companyId), //TO DO Get this from config
            data: "",//JSON.stringify(stuffToSend),
            contentType: "text/plain",
            type: 'GET',
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                debugger;
                navapp.headerObject = data[0];
                showMainCenterPanel();
            }
        });
    }

    function showMainCenterPanel () {
        $("#call-center-main").show();
        $("#data-holder").show();

        $('#data-holder').empty();
        
        $("#navigator-table").hide();
        $("#search-container").hide();

        var callCenterMain = $("#call-center-main").html(),
            templateCcMain = Handlebars.compile(callCenterMain);

        var ribbonTemplate = $("#ribbon-template").html(),
            templateRibbon = Handlebars.compile(ribbonTemplate);

        $("#data-holder").append(templateCcMain(navapp.headerObject));
        $("#ribbon-holder").append(templateRibbon(navapp.headerObject));
    }
});