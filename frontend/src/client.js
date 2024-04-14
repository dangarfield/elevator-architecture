import { Chart, Colors } from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
Chart.register(ChartDataLabels)
Chart.register(Colors)

const topics = [
  { id: 0, title: 'Strategic Board & C-Level', colour: '#7030A0', lighter: '#7030A0', lineTotal: 0 },
  { id: 1, title: 'End-to-end, Customer Channels, Programmes', colour: '#0070C0', lighter: '#80caff',lineTotal: 1 },
  { id: 2, title: 'Functional Domains', colour: '#00B050', lighter: '#79ffb6', ineTotal: 2 },
  { id: 3, title: 'Data Management Services', colour: '#00B0F0', lighter: '#93e2ff', lineTotal: 3 },
  { id: 4, title: 'DevOps, Auth', colour: '#92D050', lighter: '#d3ecb9', lineTotal: 2 },
  { id: 5, title: 'Integration Services', colour: '#FFC000', lighter: '#ffe699', lineTotal: 0 },
  { id: 6, title: 'Security Services', colour: '#C00000', lighter: '#ff8080',lineTotal: 0 },
  { id: 7, title: 'Technology & Infrastructure Services', colour: '#DC678A', lighter: '#f1c2d0',lineTotal: 0 },
  { id: 8, title: 'Operational Services', colour: '#FF9900', lighter: '#ffd699', lineTotal: 0 }
]
const totalMax = 15
const lineMax = 8

const renderSkills = () => {
  const total = topics.reduce((acc, topic) => acc + topic.lineTotal, 0)
  const spare = totalMax - total
  const html =
  `<div class="row h-11">
            <div class="col-12 d-flex justify-content-center align-items-center">
                <div class="content">
                    <h1>Elevator Architecture</h1>
                </div>
            </div>
        </div>
        ${topics.map((topic, index) => {
        const width = topic.lineTotal / lineMax * 100
        console.log('width ', width)
        const backgroundPosition = width === '' ? '0 0' : `${-width}% 0`
    return `
    <div class="row h-11">
        <div class="col-6 d-flex justify-content-start align-items-center" style="colorxxx: ${topic.colour};">
            <div class="text-start">
                ${topic.title}
            </div>
        </div>
        <div class="col-6 d-flex justify-content-start align-items-center">
            <div class="input-group mb-3">
                <button class="btn btn-outline-secondary action" data-topic="${index}" data-value="-1" type="button">-</button>
                <input type="text" class="form-control text-center counter" data-topic="${index}" disabled placeholder="${topic.lineTotal}"
                    style="
                    
                    background-position: ${backgroundPosition}">
                <button class="btn btn-outline-secondary action" data-topic="${index}" data-value="1" type="button">+</button>
            </div>
        </div>
    </div>`
  }).join('')}
        <div class="row h-11">
            <div class="col-6 offset-6 d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-outline-secondary w-100 submit" disabled>${spare} points remaining</button>
            </div>
        </div>`

  document.querySelector('.content').innerHTML = html
}
const bindSkillsActions = () => {
  const submitBtn = document.querySelector('.submit')
  document.querySelectorAll('.action').forEach(button => {
    button.addEventListener('click', function () {
      const total = topics.reduce((acc, topic) => acc + topic.lineTotal, 0)
      const spare = totalMax - total
      console.log('total', totalMax, total, '->', spare)

      const valueAdj = parseInt(this.getAttribute('data-value'))
      const topicIndex = parseInt(this.getAttribute('data-topic'))
      const topic = topics[topicIndex]
      console.log('topicIndex', topicIndex, topic, valueAdj)
      if (topic.lineTotal + valueAdj < 0) {
        console.log('less than 0')
      } else if (topic.lineTotal + valueAdj > lineMax) {
        console.log('greater than lineMax')
      } else if (spare <= 0 && valueAdj > 0) {
        console.log('no points left')
      } else {
        topic.lineTotal = topic.lineTotal + valueAdj
        const counter = document.querySelector(`.counter[data-topic="${topicIndex}"]`)
        counter.value = topic.lineTotal
        const width = topic.lineTotal / lineMax * 100
        console.log('width ', width)
        counter.style.backgroundPosition = width === '' ? '0 0' : `${-width}% 0`
      }
      const totalUpdated = topics.reduce((acc, topic) => acc + topic.lineTotal, 0)
      const spareUpdated = totalMax - totalUpdated
      if (spareUpdated > 0) {
        submitBtn.innerHTML = `${spareUpdated} points remaining`
        submitBtn.setAttribute('disabled', 'disabled')
        submitBtn.classList.remove('btn-secondary')
        submitBtn.classList.add('btn-outline-secondary')
      } else {
        submitBtn.innerHTML = 'Submit'
        submitBtn.removeAttribute('disabled')
        submitBtn.classList.remove('btn-outline-secondary')
        submitBtn.classList.add('btn-secondary')
      }
    })
  })
  submitBtn.addEventListener('click', async () => {
    console.log('Submit')

    submitBtn.setAttribute('disabled', 'disabled')

    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(topics.map(t => t.lineTotal))
    })

    window.alert('Submitted - Thanks!')
    return response.json()
  })
}
const initAddSkills = () => {
  renderSkills()
  bindSkillsActions()
}

const renderResults = () => {
  const html =
  ` <div class="row h-10">
        <div class="col-6 offset-3 d-flex justify-content-center align-items-center">
            <div class="content">
                <h1>Elevator Architecture</h1>
            </div>
        </div>
        <div class="col-3 d-flex justify-content-center align-items-center">
            <div class="content">
                <h2 class="text-secondary">https://is.gd/YTamzl</h2>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-4">
            ${topics.map((topic, index) => {
    return `
    <div class="row h-10">
        <div class="d-flex justify-content-end align-items-center" style="color: ${topic.colour};">
            <h3 class="text-end">
                ${topic.title}
            </h3>
        </div>
    </div>`
  }).join('')}
        </div>
        <div class="col-1 ele-pic p-0" style="height: 90vh">
            <img src="/img/elevator-slim-w.png" class='img-fluid p-0 m-0' style="max-height:90vh;"/>
        </div>
        <div class="col-7">
            <canvas id="results-chart" style="height: 100%"></canvas>
        </div>
    </div>
        
  `
  document.querySelector('.content').innerHTML = html

  const ctx = document.getElementById('results-chart')
  console.log('chartCtx', ctx)
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: topics.map(t => t.title),
      datasets: [{
        label: 'results',
        // data: [12, 19, 3, 5, 2, 3, 7, 4, 9],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: topics.map(t => t.colour),
        // backgroundColor: topics.map(t => t.lighter),
        // borderColor: topics.map(t => t.colour)
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        y: {
          beginAtZero: true,
          display: false
        },
        x: {
          ticks: {
            display: false
          }
        }
      },
      elements: {
        bar: {
          borderWidth: 2
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          display: false
        },
        datalabels: {
        //   anchor: 'end',
          offset: 10,
          //   clamp: true
          color: 'black',
          font: {
            size: 34
          }
        }
      }

    }
  })
  return chart
}
const updateResults = async (chart) => {
  console.log('updateResults')
  const response = await fetch('/api/data')
  const results = await response.json()

  console.log('data', chart.data.datasets[0], results)
  //   const randomList = Array.from({ length: 9 }, () => Math.floor(Math.random() * 21))
  chart.data.datasets[0].data = results
  chart.update()
}
const initResults = async () => {
  const chart = renderResults()
  updateResults(chart)
  setInterval(() => {
    updateResults(chart)
  }, 6000)
}

const clearResults = async () => {
  const response = await fetch('/api/data', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(topics.map(t => t.lineTotal))
  })
  console.log('res.json delete', response.json())
  window.location.pathname = '/results'
}
if (window.location.pathname === '/results') {
  console.log('The URL path is /results')
  initResults()
} else if (window.location.pathname === '/clear') {
  console.log('clear')
  clearResults()
} else {
  initAddSkills()
}
