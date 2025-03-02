/**
 * Main application entry point
 */
const express = require('express');
const ServiceMonitor = require('./monitor');
const config = require('../config');

// Initialize the service monitor
const monitor = new ServiceMonitor(config);

// Start monitoring services
monitor.startMonitoring();

// Setup the web server for the dashboard
const app = express();
const PORT = config.server.port || 3000;

// Serve the dashboard
app.get('/', (req, res) => {
  const stats = monitor.getStats();
  res.send(`
    <html>
      <head>
        <title>Service Monitor</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .status-up { color: green; }
          .status-down { color: red; }
          .header { display: flex; justify-content: space-between; align-items: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Service Monitor Dashboard</h1>
          <p>Last updated: ${new Date().toLocaleString()}</p>
        </div>
        <table>
          <tr>
            <th>Service</th>
            <th>Status</th>
            <th>Uptime</th>
            <th>Last Checked</th>
            <th>Response Time</th>
          </tr>
          ${stats.map(service => `
            <tr>
              <td>${service.name}</td>
              <td class="status-${service.status === 'UP' ? 'up' : 'down'}">${service.status}</td>
              <td>${service.uptime}%</td>
              <td>${service.lastChecked}</td>
              <td>${service.responseTime}ms</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `);
});

// API endpoint to get service stats as JSON
app.get('/api/stats', (req, res) => {
  res.json(monitor.getStats());
});

// Start the server
app.listen(PORT, config.server.host, () => {
  console.log(`Service Monitor dashboard running at http://${config.server.host}:${PORT}`);
});