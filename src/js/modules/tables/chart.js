import Chart from 'chart.js';
const tableWrapper = document.getElementById('cases-wrapper');

const beginChartCountry = 'USA'
const type = [];

const ctx = document.getElementById('myChart').getContext('2d');
const config = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Confirmed',
        data: [],
        borderWidth: 1.5,
        fill: false,
      },
      {
        label: 'Deaths',
        data: [],
        borderWidth: 1.5,
        fill: false,
      },
      {
        label: 'Recovered',
        data: [],
        borderWidth: 1.5,
        fill: false,
      },
    ]  
  },
  options: {
    title: {
      display: true,
      text: 'Total cases',
    },
    elements: {
      point: {
        radius: 0
      }
    },
    scales: {
      xAxes: [{
        type: "time",
          time: {
            unit: 'month'
          },
      }],
      yAxes: [{
        ticks: {
          callback: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            }
            if (value <= 1) return 
              return value
          },
        }
      }]
    }
  }
});

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        Date: date,
        Cases: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function totalCasesChart(data) {
  const labelArr = data.map(item => item.Date);
  const dailyConfirmed = data.map(day => day.Confirmed);
  const dailyDeaths = data.map(day => day.Deaths);
  const dailyRecovered = data.map(day => day.Recovered);
  const titleCountry = data.map(day => day.Country);

  let label = labelArr.map(el => new Date(el).toISOString().substr(0, 10));
  config.data.labels = label;
  
  config.data.datasets[0].data = dailyConfirmed;
  config.data.datasets[0].borderColor = 'red'

  config.options.title.text = titleCountry[0];

  config.data.datasets[1].data = dailyDeaths;
  config.data.datasets[1].borderColor = '#888'
  config.data.datasets[1].label = 'Deaths';
  
  config.data.datasets[2].data = dailyRecovered;
  config.data.datasets[2].borderColor = 'rgb(102, 207, 54)'
  config.data.datasets[2].label = 'Recovered';
  config.update()
}

function totalDeathChart(data) {
  const labelGlobal = data.map(item => item.Date);
  const history = data.map(item => Math.abs(item.Cases));

  config.data.labels = labelGlobal;
  config.data.datasets[0].data = history;
  config.update()
}

async function getCovidData(country) {
  const fetchTargetCountry = `https://api.covid19api.com/total/dayone/country/${country}`;
  const res = await fetch(fetchTargetCountry);
  const data = await res.json();
  totalCasesChart(data);
}

export default function markerOnClick(e) {
  const country = e.target.options.dataSchedule;
  getCovidData(country);
}

async function getGlobalHistory(type) {
  const fetchHistory = `https://disease.sh/v3/covid-19/historical/all?lastdays=300`;
  const res = await fetch(fetchHistory)
  const data = await res.json()
  let chartData = buildChartData(data, `${type}`);
  totalDeathChart(chartData)
};

function getCountries (e) {
  const targetCountry = e.target.closest('.country-item').dataset.country;
  getCovidData(targetCountry);
}

tableWrapper.addEventListener('click', (e) => getCountries(e));

function clearConfig() {
  type.pop()
  config.data.datasets[1].data = [];
  config.data.datasets[2].data = [];
  config.data.datasets[1].borderColor = '';
  config.data.datasets[2].borderColor = '';
  config.data.datasets[0].label = '';
  config.data.datasets[1].label = '';
  config.data.datasets[2].label = '';
}

const buttons = document.querySelectorAll('.btn-cases');
buttons.forEach(item => {
  const categoryType =  item.dataset.category;
  item.addEventListener('click', () => {
    switch(categoryType) {
      case 'confirmed':
        clearConfig()
        config.options.title.text = 'Total Confirmed';
        config.data.datasets[0].borderColor = 'red'
        config.data.datasets[0].label = 'Confirmed';
        type.push('cases')
        getGlobalHistory(type);
        break;
      
      case 'deaths': 
        clearConfig()
        config.options.title.text = 'Total Deaths';
        config.data.datasets[0].borderColor = '#888'
        config.data.datasets[0].label = 'Deaths';
        type.push('deaths')
        getGlobalHistory(type);
        break;
      
      case 'recovered': 
        clearConfig()
        config.options.title.text = 'Total Recovered';
        config.data.datasets[0].borderColor = 'rgb(102, 207, 54)'
        config.data.datasets[0].label = 'Recovered';
        type.push('recovered')
        getGlobalHistory(type);
        break;
      default:
        console.error(e);
    }
  });
});

getCovidData(beginChartCountry)
