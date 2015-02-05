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
        getAllCompaniesInitialStart: "solr/select?q=isCompany:true&fl=fname,lname,id,email,companyname&wt=json&indent=true",
        getCustomerOverview: "solr/select?q=id:",
        getCallLogs: 'solr/select?q=companyid:',
        getSocialMedia: '',
        filterQuery: ''

    }


};
