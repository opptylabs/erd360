import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import _, {upperCase} from "lodash";
import {formatDollar} from "../../lib/format_dollar";

ChartJS.register(ArcElement, Tooltip, Legend);

const mixColors = (nb) => {
    const colors = [
        '#1F43F6',
        '#3555F6',
        '#4B68F7',
        '#617AF8',
        '#778DF9',
        '#8D9FFA',
        '#A4B2FB',
        '#BAC5FC',
        '#D1D8FD',
        '#E8ECFE'
    ]

    if (nb * 2 >= colors.length) {
        return colors
    }
    let selectedColors = []
    const interval = 3
    for (let i = 0; selectedColors.length < nb; i = i + interval) {
        selectedColors.push(colors[i])
    }
    return selectedColors
}

const mixData = (items, filterType) => {

    const filteredItems = _.filter(items, (item) => {
        return filterType === '' || item.type === filterType
    })

    const groups = _.groupBy(filteredItems, 'type')

    let labels = []
    let data = []

    if (filterType !== '' || _.values(groups).length < 2) {
        // detail d'un type
        const sortedItems = _.sortBy(filteredItems,(item) => {
            return - _.sumBy(item, 'valueUsd')
        })

        labels = _.map(sortedItems, 'identifier')

        data = _.map(sortedItems, 'valueUsd')
    } else {
        // groupé par type
        const sortedGroups = _.sortBy(groups,(group) => {
            return - _.sumBy(group, 'valueUsd')
        })

        labels = _.map(_.map(sortedGroups, (group) => {
            return _.first(group).type
        }), upperCase)

        data = _.map(sortedGroups, (group) => {
            return _.sumBy(group, 'valueUsd')
        })
    }

    return {
        labels: labels,
        datasets: [
            {
                label: 'Value USD',
                data: data,
                backgroundColor: mixColors(_.values(data).length),
                borderWidth: 0,
            },
        ]
    }
}

export default function Chart360(props) {
    const data = mixData(props.account.items, props.filterType)

    const options = {
        layout: {
            padding: 20
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.label + ' ' + formatDollar(context.parsed)
                    }
                }
            }
        }
    }
    return <Pie data={data} options={options} type={'pie'} className={"max-h-96"} />;
}
