"use strict";

let OpenFDASearch = require("./search");
let request = require("superagent");


/**
 * Provides some base service pipings for all openfda services
 */
class OpenFDABaseService {

    /**
     * Constructor for the base service
     * @param {OpenFDAApi} api The parent api
     * @param {String} path The path relative to the parent api
     */
    constructor (api, path) {
        this.api = api;
        this.path = path;
        this.childSearch = new OpenFDASearch(this);
    }

    /**
     * Builds the final url to use to call the FDA services
     * @returns The final url
     */
    buildUrl() {
        let baseUrl = this.api.path + this.path;
        let search = this.childSearch.buildUrl();
        var apiKey = this.api.apiKey;

        let queryArgs = [];
        if (this.api.apiKey) {
            queryArgs.push("api_key=" + apiKey);
        }

        if (search) {
            queryArgs.push("search=" + search);
        }

        if (this.limitArg) {
            queryArgs.push("limit=" + this.limitArg);
        }

        if (this.skipArg) {
            queryArgs.push("skip=" + this.skipArg);
        }

        return baseUrl + (queryArgs.length ? "?" + queryArgs.join("&") : "");
    }

    /**
     * Limits the number of results to the number provided
     * @param {number} num The number of results to return
     */
    limit(num) {
        this.limitArg = num;
        return this;
    }

    /**
     * Skips the number of results
     * @param {number} num The number of results to skip
     */
    skip(num) {
        this.skipArg = num;
        return this;
    }

    /**
     * The search for this service call
     */
    search(str) {
        return this.childSearch.search(str);
    }

    /**
     * Runs the service call
     * @returns A promise for the service call
     */
    run(success, failure) {
        var url = this.buildUrl();
        return new Promise((resolve, reject) => {
            request.get(url).end((err, res) => {
                console.log(res);
                if (res.ok) {
                    if (success) {
                        success(res.body);
                    }
                    resolve(res.body);
                } else {
                    if (failure) {
                        failure(err);
                    }
                    reject(err);
                }
            });
        });
    }
}

module.exports = OpenFDABaseService;