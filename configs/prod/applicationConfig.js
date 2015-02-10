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
        searchAsYouType: "solr/select?q=companyname:",
        getCallCenterLogCount: "solr/select?q=companyid:"
    }
};

//http://ec2-54-200-131-81.us-west-2.compute.amazonaws.com:8983/solr/select?q=companyid:1&fq=isSocial:true&wt=json&indent=true

//http://ec2-54-200-131-81.us-west-2.compute.amazonaws.com:8983/solr/select?q=companyid:1&fq=isSocial:false&wt=json&indent=true

//http://ec2-54-148-31-2.us-west-2.compute.amazonaws.com:8983/solr/select?q=" + searchCriteria + ":" + searchParam + "&wt=json&indent=true";
//http://ec2-54-200-131-81.us-west-2.compute.amazonaws.com:8983/solr/select?q=companyid:1&fq=isCompany:false&wt=json&indent=true