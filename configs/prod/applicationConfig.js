/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/2/13
 * Time: 12:28 PM
 * DEVELOPMENT ENVIRONMENT SETTINGS
 * Intent is to use single Configuration file for all project requirements.
 * Please feel free to use/expand this config to your requirements,
 * please keep in mind that other configuration files MUST BE updated
 */

"use strict";

module.exports = {
    solrEP: {
        SOLR: "http://ec2-54-200-131-81.us-west-2.compute.amazonaws.com:8983/",
        //SOLR: "http://localhost:8983/",
        getAllCompaniesInitialStart: "solr/select?q=isCompany:true&fl=fname,lname,id,email,companyname&wt=json&indent=true",
        getCustomerOverview: "solr/select?q=id:",
        getCallLogs: "solr/select?q=companyid:",
        getSingleCompany: "solr/select?q=id:",
        getSocialMedia: "",
        searchAsYouType: "solr/select?q=companyname:"
    }
};

//http://ec2-54-200-131-81.us-west-2.compute.amazonaws.com:8983/solr/select?q=companyid:1&fq=isSocial:true&wt=json&indent=true

//http://ec2-54-200-131-81.us-west-2.compute.amazonaws.com:8983/solr/select?q=companyid:1&fq=isSocial:false&wt=json&indent=true

//http://ec2-54-148-31-2.us-west-2.compute.amazonaws.com:8983/solr/select?q=" + searchCriteria + ":" + searchParam + "&wt=json&indent=true";
