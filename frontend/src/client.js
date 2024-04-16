import { Chart, Colors } from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Toastify from 'toastify-js'
Chart.register(ChartDataLabels)
Chart.register(Colors)
Chart.defaults.color = '#fff'

const topics = [
  { id: 0, title: 'Strategic Board & C-Level', colour: '#7030A0', lighter: '#7030A0', lineTotal: 0 },
  { id: 1, title: 'Master Domain Owners & Product Leads', colour: '#0070C0', lighter: '#80caff',lineTotal: 1 },
  { id: 2, title: 'End-to-end Programmes and Cross-domain', colour: '#00B050', lighter: '#79ffb6', lineTotal: 2 },
  { id: 3, title: 'Domain Architects & Owners', colour: '#00B0F0', lighter: '#93e2ff', lineTotal: 3 },
  { id: 4, title: 'Domain POs & BAs', colour: '#92D050', lighter: '#d3ecb9', lineTotal: 2 },
  { id: 5, title: 'Tech Lead & Architects ', colour: '#FFC000', lighter: '#ffe699', lineTotal: 0 },
  { id: 6, title: 'Development Teams', colour: '#C00000', lighter: '#ff8080',lineTotal: 0 },
  { id: 7, title: 'Operational Services', colour: '#DC678A', lighter: '#f1c2d0',lineTotal: 0 },
  { id: 8, title: 'Infra, security and technical specialists', colour: '#FF9900', lighter: '#ffd699', lineTotal: 0 }
]

const totalMax = 15
const lineMax = 8

const times = [
    {id: 0, title: 'Architecting', lineTotal: 15},
    {id: 1, title: 'Getting input', lineTotal: 15},
    {id: 2, title: 'Providing information', lineTotal: 15}
]
const types = [
    {id: 0, title: 'Perfect' },
    {id: 1, title: 'Almost Perfect' },
    {id: 2, title: 'Goldplating' },
    {id: 3, title: 'Ivory Tower' },
    {id: 4, title: 'Just Consultants' },
    {id: 5, title: 'Absent Architect' }
]

const renderSkills = () => {
  const total = topics.reduce((acc, topic) => acc + topic.lineTotal, 0)
  const spare = totalMax - total
  const html =
  `<div class="row py-1">
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
    <div class="row py-1">
        <div class="col-6 d-flex justify-content-start align-items-center" style="colorxxx: ${topic.colour};">
            <div class="text-start">
                ${topic.title}
            </div>
        </div>
        <div class="col-6 d-flex justify-content-start align-items-center">
            <div class="input-group mb-3">
                <button class="btn btn-outline-secondary action" data-topic="${index}" data-value="-1" type="button"><i class="bi bi-dash-lg"></i></button>
                <input type="text" class="form-control text-center counter counter-${index}" data-topic="${index}" disabled placeholder="${topic.lineTotal}"
                    style="

                    background-position: ${backgroundPosition}">
                <button class="btn btn-outline-secondary action" data-topic="${index}" data-value="1" type="button"><i class="bi bi-plus-lg"></i></button>
            </div>
        </div>
    </div>`
  }).join('')}
        <div class="row py-1">
            <div class="col-12 d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-outline-light w-100 submit" disabled>${spare} points remaining</button>
            </div>
        </div>
        <div class="row py-1">
            <div class="col-12 d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-link w-100 time-link">Next question</button>
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

    Toastify({
        text: "Submitted",
        duration: 3000,
        position: 'center',
        style: {
             background: "linear-gradient(to right, black, black)"   
        }
    }).showToast()



    submitBtn.setAttribute('disabled', 'disabled')
    await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(topics.map(t => t.lineTotal))
    })
    drawTime()

    // window.alert('Submitted - Thanks!')
  })
  document.querySelector('.time-link').addEventListener('click', async () => {
    drawTime()
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
                <a href="/time" class="link-light link-underline link-underline-opacity-0"><h1>Elevator Architecture</h1></a>
            </div>
        </div>
    </div>
    <div class="">
        <img src="/img/qr.png" style="width: 160px; position: fixed; bottom: 10px; right: 10px;"/>
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
  await fetch('/api/time', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(times.map(t => t.lineTotal))
  })
  window.location.pathname = '/results'
}

const drawTime = async () => {
    const html =
    `<div class="row py-1">
            <div class="col-12 d-flex justify-content-center align-items-center">
                <div class="content">
                    <h1>Elevator Architecture</h1>
                </div>
            </div>
        </div>
    ${times.map((time, index) => {
        const width = time.lineTotal / 100 * 100
        console.log('width ', width)
        const backgroundPosition = width === '' ? '0 0' : `${-width}% 0`
    return `
    <div class="row py-1">
        <div class="col-6 d-flex justify-content-start align-items-center" style="colorxxx: ${topics[index].colour};">
            <div class="text-start">
                ${time.title}
            </div>
        </div>
        <div class="col-6 d-flex justify-content-start align-items-center">
            <div class="input-group mb-3">
                <button class="btn btn-outline-secondary action" data-time="${index}" data-value="-5" type="button"><i class="bi bi-dash-lg"></i></button>
                <input type="text" class="form-control text-center counter counter-${index}" data-time="${index}" disabled placeholder="${time.lineTotal}"
                    style="

                    background-position: ${backgroundPosition}">
                <button class="btn btn-outline-secondary action" data-time="${index}" data-value="5" type="button"><i class="bi bi-plus-lg"></i></button>
            </div>
        </div>
    </div>`
  }).join('')}
    <div class="row py-1">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <button type="button" class="btn btn-outline-light w-100 time-submit" disabled>55 points remaining</button>
        </div>
    </div>
    `
    document.querySelector('.content').innerHTML = html
    console.log('drawTime')

    
    const timeSubmitBtn = document.querySelector('.time-submit')
    document.querySelectorAll('.action').forEach(button => {
        button.addEventListener('click', function () {

            const total = times.reduce((acc, time) => acc + time.lineTotal, 0)
            const spare = 100 - total
            console.log('total', total, '->', spare)
            
            const valueAdj = parseInt(this.getAttribute('data-value'))
            const timeIndex = parseInt(this.getAttribute('data-time'))
            const time = times[timeIndex]
            console.log('timeIndex', timeIndex, time, valueAdj)

            if (time.lineTotal + valueAdj < 0) {
                console.log('less than 0')
            } else if (time.lineTotal + valueAdj > 100) {
                console.log('greater than lineMax')
            } else if (spare <= 0 && valueAdj > 0) {
                console.log('no points left')
            } else {
                time.lineTotal = time.lineTotal + valueAdj
                const counter = document.querySelector(`.counter[data-time="${timeIndex}"]`)
                counter.value = time.lineTotal
                const width = time.lineTotal / 100 * 100
                console.log('width ', width)
                counter.style.backgroundPosition = width === '' ? '0 0' : `${-width}% 0`
            }

            const totalUpdated = times.reduce((acc, time) => acc + time.lineTotal, 0)
            const spareUpdated = 100 - totalUpdated
            if (spareUpdated > 0) {
                timeSubmitBtn.innerHTML = `${spareUpdated} points remaining`
                timeSubmitBtn.setAttribute('disabled', 'disabled')
                timeSubmitBtn.classList.remove('btn-secondary')
                timeSubmitBtn.classList.add('btn-outline-secondary')
            } else {
                timeSubmitBtn.innerHTML = 'Submit'
                timeSubmitBtn.removeAttribute('disabled')
                timeSubmitBtn.classList.remove('btn-outline-secondary')
                timeSubmitBtn.classList.add('btn-secondary')
            }

            
        })
    })

    timeSubmitBtn.addEventListener('click', async () => {
        console.log('Submit')

        Toastify({
            text: "Submitted",
            duration: 3000,
            position: 'center',
            style: {
                background: "linear-gradient(to right, black, black)"   
            }
        }).showToast()



        timeSubmitBtn.setAttribute('disabled', 'disabled')
        await fetch('/api/time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(times.map(t => t.lineTotal))
            })
        // drawTime()

        // window.alert('Submitted - Thanks!')
        renderType()
    })
}
const renderType = () => {
    const type = classifyArchitect(times[0].lineTotal, times[1].lineTotal, times[2].lineTotal)
    console.log('type', times[0].lineTotal, times[1].lineTotal, times[2].lineTotal, type)
    document.querySelector('.time-submit').innerHTML = `Architect Type: ${type}`
    document.querySelector('.time-submit').classList.add('btn-light')
    document.querySelector('.time-submit').classList.remove('btn-outline-light')
    document.querySelectorAll('button').forEach(button => {
        button.disabled = true;
    })
}
const renderTimeResults = () => {
    const html =
    ` <div class="row h-10">
            <div class="col-6 offset-3 d-flex justify-content-center align-items-center">
                <div class="content">
                    <a href="/results" class="link-light link-underline link-underline-opacity-0"><h1>Elevator Architecture</h1></a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <canvas id="time-chart" style="height: 80vh!important"></canvas>
            </div>
            <div class="col-6">
                <canvas id="type-chart" style="height: 80vh!important"></canvas>
            </div>
        </div>
    `
    document.querySelector('.content').innerHTML = html

    const timeChartCtx = document.getElementById('time-chart')
    console.log('chartCtx', timeChartCtx)
    const timeChart = new Chart(timeChartCtx, {
        type: 'doughnut',
        data: {
            labels: times.map(t => t.title),
            datasets: [{
                label: 'results',
                // data: [12, 19, 3, 5, 2, 3, 7, 4, 9],
                data: [10, 15,25],
                backgroundColor: topics.map(t => t.colour),
            }]
            },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'left',
                    fullSize: true,
                    labels: {
                        font: {
                            size: 14,
                        },
                        color: 'white'
                    }
                },
                datalabels: {
                    offset: 10,
                    color: 'black',
                    font: {
                        size: 34
                    }
                }
            }
        }
    })

    const typeChartCtx = document.getElementById('type-chart')
    console.log('chartCtx', typeChartCtx)
    const typeChart = new Chart(typeChartCtx, {
        type: 'bar',
        data: {
            labels: types.map(t => t.title),
            datasets: [{
                label: 'results',
                // data: [12, 19, 3, 5, 2, 3, 7, 4, 9],
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: topics.map(t => t.colour).slice(3),
            }]
            },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    color: 'white'
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                    fullSize: true,
                    labels: {
                        font: {
                            size: 14,
                        },
                        color: 'white'
                    }
                },
                datalabels: {
                    offset: 10,
                    color: 'black',
                    font: {
                        size: 34
                    }
                }
            }
        }
    })
    return {timeChart, typeChart}
}
const updateTimeResults = async (timeChart, typeChart) => {
    console.log('updateTimeResults')
    const response = await fetch('/api/time')
    const results = await response.json()

    console.log('data', timeChart.data.datasets[0], results.times, results.types)
    //   const randomList = Array.from({ length: 9 }, () => Math.floor(Math.random() * 21))
    timeChart.data.datasets[0].data = results.times
    timeChart.update()

    //   const randomList = Array.from({ length: 9 }, () => Math.floor(Math.random() * 21))
    typeChart.data.datasets[0].data = results.types
    typeChart.update()
}
const initTimeResults = async () => {
  const {timeChart, typeChart} = renderTimeResults()
  updateTimeResults(timeChart, typeChart)
  setInterval(() => {
    updateTimeResults(timeChart, typeChart)
  }, 6000)
}


const classifyArchitect = (internalPercentage, inwardsPercentage, outwardsPercentage) => {
    if (internalPercentage === 50 && inwardsPercentage === 25 && outwardsPercentage === 25) {
        return "Perfect"
    }
    else if (Math.abs(internalPercentage - 50) <= 5 && Math.abs(inwardsPercentage - 25) <= 5 && Math.abs(outwardsPercentage - 25) <= 5) {
        return "Almost Perfect"
    }
    else if (internalPercentage > 50 && inwardsPercentage > 25) {
        return "Goldplating"
    }
    else if (internalPercentage > 50) {
        return "Ivory Tower"
    }
    else if (internalPercentage < 50 && outwardsPercentage > 25) {
        return "Just Consultants"
    }
    else if (internalPercentage < 50) {
        return "Absent Architect"
    }
}

if (window.location.pathname === '/results') {
  console.log('The URL path is /results')
  initResults()
} else if (window.location.pathname === '/clear') {
  console.log('clear')
  clearResults()
} else if (window.location.pathname === '/time') {
  initTimeResults()
} else {
  initAddSkills()
}
