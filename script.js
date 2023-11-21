import { ref, set, onValue, push, db } from './firebase.js'
let myBarChart = null

const dbUsersRef = ref(db, 'users')
try {
  init()
  setBarChart()
} catch (e) {
  console.log(e)
}

/**
 * Displays Updated User Data into the HTML table.
 * @param {Object} data - customer data in realtime database
 */
function displayData (data) {
  let html = `
  <table style="margin-left: auto; margin-right: auto; text-align: center; border-collapse: collapse; width: 60%; table-layout: auto;">
  <thead>
    <tr>
      <th style="border: 1px solid black; padding: 8px;">ID</th>
      <th style="border: 1px solid black; padding: 8px;">First Name</th>
      <th style="border: 1px solid black; padding: 8px;">Username</th>
      <th style="border: 1px solid black; padding: 8px;">IP Address</th>
      <th style="border: 1px solid black; padding: 8px;">High Score</th>
      <th style="border: 1px solid black; padding: 8px;">Game Name</th>
      <th style="border: 1px solid black; padding: 8px;">Gender</th>
    </tr>
  </thead>
  <tbody>
  `

  for (const item in data) {
    console.log(item)
    html += `<tr>
      <td style="border: 1px solid black; padding: 8px;">${item}</td>
      <td style="border: 1px solid black; padding: 8px;">${data[item].first_name}</td>
      <td style="border: 1px solid black; padding: 8px;">${data[item].username}</td>
      <td style="border: 1px solid black; padding: 8px;">${data[item].ipaddress}</td>
      <td style="border: 1px solid black; padding: 8px;">${data[item].highscore}</td>
      <td style="border: 1px solid black; padding: 8px;">${data[item].game}</td>
      <td style="border: 1px solid black; padding: 8px;">${data[item].gender}</td>
    </tr>`
  }
  html += `</tbody>
    </table>`
  document.getElementById('result').innerHTML = html
}

/**
 * Adds eventlistener to submit button that collects the data from the input boxes into the database.
 * Subsequently calls the writedata, displayData, and setBarChart() function.
 */
function init () {
  document.getElementById('button').addEventListener('click', () => {
    const fname = document.getElementById('fname').value
    const username = document.getElementById('username').value
    const ipaddress = document.getElementById('ipaddress').value
    const highscore = document.getElementById('highscore').value
    const game = document.getElementById('game').value
    const gender = document.getElementById('gender').value
    writeData(fname, username, ipaddress, highscore, game, gender)
  })

  onValue(dbUsersRef, (snapshot) => {
    const data = snapshot.val()
    displayData(data)
    prepareChartData(data)
  })
}

/**
 * Pushes new data into the database
 */
function writeData (fname, username, ipaddress, highscore, game, gender) {
  push(dbUsersRef, {
    first_name: fname,
    username,
    ipaddress,
    highscore,
    game,
    gender
  }).catch(error => {
    console.error('Error writing data: ', error)
  })
}

/**
 * Updates initiated bar chart with updated data.
 * @param {Object[]} labels - usernames that act as x-axis labels
 * @param {Object[]} scores - scores that will serve as the y-axis data
 */
function updateChart (labels, scores) {
  const ctx = document.getElementById('myChart').getContext('2d')
  if (!myBarChart) {
    myBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'High Scores',
          data: scores,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  } else {
    myBarChart.data.labels = labels
    myBarChart.data.datasets.forEach((dataset) => {
      dataset.data = scores
    })
    myBarChart.update()
  }
}

/**
 * Prepares updated data in order for barchart update.
 * Used once barchart is already initiated.
 * @param {Object[]} usersData - Updated User Data
 */
function prepareChartData (usersData) {
  const filteredUsers = Object.values(usersData).filter(user => user.highscore >= 0)
  const sortedUsers = filteredUsers.sort((a, b) => b.highscore - a.highscore)
  const labels = sortedUsers.map(user => user.username)
  const scores = sortedUsers.map(user => user.highscore)
  updateChart(labels, scores)
}

/**
 * Adds user data into the barchart.
 * Extracts, filters, and sorts the high scores and inserts it into the bar chart.
 * Subsequently calls the displayData function.
 */
function setBarChart () {
  onValue(dbUsersRef, (snapshot) => {
    const usersData = snapshot.val()
    const filteredUsers = []

    for (const userId in usersData) {
      const user = usersData[userId]
      if (user.highscore >= 0) {
        filteredUsers.push(user)
      }
    }

    const sortedUsers = filteredUsers.sort((a, b) => b.highscore - a.highscore)
    const labels = sortedUsers.map(user => user.username)
    const scores = sortedUsers.map(user => user.highscore)

    updateChart(labels, scores)
  })
}
