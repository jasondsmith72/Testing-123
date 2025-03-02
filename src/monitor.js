/**
 * Service Monitor class to check service status
 */
const axios = require('axios');
const cron = require('node-cron');

class ServiceMonitor {
  constructor(config) {
    this.services = config.services;
    this.notifications = config.notifications;
    this.serviceStats = {};
    
    // Initialize stats for each service
    this.services.forEach(service => {
      this.serviceStats[service.name] = {
        name: service.name,
        status: 'UNKNOWN',
        upChecks: 0,
        totalChecks: 0,
        uptime: 100,
        lastChecked: 'Never',
        responseTime: 0,
        history: []
      };
    });
  }

  async checkService(service) {
    const startTime = Date.now();
    const stats = this.serviceStats[service.name];
    
    try {
      const response = await axios.get(service.url, {
        timeout: 5000, // 5 second timeout
        validateStatus: null // Don't throw on any status code
      });
      
      const responseTime = Date.now() - startTime;
      const isUp = response.status === service.expectedStatus;
      
      // Update stats
      stats.responseTime = responseTime;
      stats.lastChecked = new Date().toLocaleString();
      stats.totalChecks++;
      
      if (isUp) {
        stats.upChecks++;
        stats.status = 'UP';
      } else {
        stats.status = 'DOWN';
        this.sendNotification(service, `Service ${service.name} is DOWN. Got status ${response.status}, expected ${service.expectedStatus}`);
      }
      
      // Calculate uptime percentage
      stats.uptime = ((stats.upChecks / stats.totalChecks) * 100).toFixed(2);
      
      // Store history (last 100 checks)
      stats.history.unshift({
        timestamp: new Date(),
        status: stats.status,
        responseTime
      });
      
      if (stats.history.length > 100) {
        stats.history.pop();
      }
      
      console.log(`[${new Date().toLocaleString()}] ${service.name}: ${stats.status} - Response time: ${responseTime}ms`);
    } catch (error) {
      // Handle errors (timeout, connection refused, etc.)
      stats.status = 'DOWN';
      stats.lastChecked = new Date().toLocaleString();
      stats.totalChecks++;
      stats.uptime = ((stats.upChecks / stats.totalChecks) * 100).toFixed(2);
      
      const errorMessage = error.code || error.message;
      console.error(`[${new Date().toLocaleString()}] Error checking ${service.name}: ${errorMessage}`);
      
      this.sendNotification(service, `Service ${service.name} is DOWN. Error: ${errorMessage}`);
      
      // Store history
      stats.history.unshift({
        timestamp: new Date(),
        status: 'DOWN',
        error: errorMessage
      });
      
      if (stats.history.length > 100) {
        stats.history.pop();
      }
    }
  }

  startMonitoring() {
    console.log('Starting service monitoring...');
    
    this.services.forEach(service => {
      // Schedule checks based on the configured interval
      cron.schedule(service.checkInterval, () => {
        this.checkService(service);
      });
      
      // Do an initial check immediately
      this.checkService(service);
    });
  }

  getStats() {
    // Return an array of service stats
    return Object.values(this.serviceStats);
  }

  sendNotification(service, message) {
    // This is a simplified implementation - just logging to console
    console.log(`NOTIFICATION: ${message}`);
    
    // In a real application, you would implement email or Slack notifications here
    if (this.notifications.email.enabled) {
      console.log(`Would send email to ${this.notifications.email.recipients.join(', ')}`);
    }
    
    if (this.notifications.slack.enabled) {
      console.log('Would send Slack notification');
    }
  }
}

module.exports = ServiceMonitor;