"use strict";
let React = require("react/addons");

let LineChart = require("react-chartjs").Line;
let _ = require("lodash");

let DrugChart = React.createClass({

    propTypes: {
        store: React.PropTypes.object.isRequired,
        storeMethod: React.PropTypes.string.isRequired,
        dataId: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
        return {
            loading: true,
            data: null
        };
    },


    /*
     * Fetch data on mount
     */
    componentDidMount: function () {
        this.getStateFromStore(this.props.dataId);
    },


    /*
     * Update state based on prop changes
     */
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.dataId !== this.props.dataId) {
            this.getStateFromStore(nextProps.dataId);
        }
    },


    /*
     * Fetch data for the chart
     */
    getStateFromStore: function (id) {
        this.setState({loading: true});
        this.props.store[this.props.storeMethod](id, "20050101", "20150101").then((res) => {
            this.setState({data: res.body.data, loading: false});
        }).catch((err) => {
            console.log("error loading store data", err);
            this.setState({loading: false});
        });
    },


    /*
     * Get style options for the chart
     */
    _getChartOptions: function () {
        return {
            pointDotRadius: 6,
            datasetStrokeWidth: 4,
            pointDotStrokeWidth: 3
        };
    },


    /*
     * Create chart data config
     */
    _getChartData: function () {
        let opts = this._transformData(this.state.data);
        return {
            labels: opts.labels,
            datasets: [{
                label: "Adverse Events",
                fillColor: "rgba(33, 150, 243, 0.16)",
                strokeColor: "#2196F3",
                pointColor: "#2196F3",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: opts.values
            }]
        };
    },


    /*
     * Aggregate the data by year and return labels/values
     */
    _transformData: function (data) {
        let val = _.chain(data)
            .groupBy((item) => {
                return (item.time + "").substr(0, 4); // year
            })
            .reduce((result, value, year) => {
                result[year] = value.length;
                return result;
            }, {})
            .value();

        return {
            labels: _.keys(val),
            values: _.values(val)
        };
    },

    render: function() {
        return <LineChart className={"chart"} data={this._getChartData()} options={this._getChartOptions()} redraw/>;
    }
});

module.exports = DrugChart;
