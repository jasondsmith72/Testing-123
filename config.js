/**
 * Configuration for Service Monitor
 */
module.exports = {
  // Services to monitor
  services: [
    {
      name: 'Example API',
      url: 'https://api.example.com/health',
      expectedStatus: 200,
      checkInterval: '*/5 * * * *' // Check every 5 minutes
    },
    {
      name: 'Company Website',
      url: 'https://example.com',
      expectedStatus: 200,
      checkInterval: '*/15 * * * *' // Check every 15 minutes
    },
    {
      name: 'Client Portal',
      url: 'https://portal.example.com/api/status',
      expectedStatus: 200,
      checkInterval: '*/10 * * * *' // Check every 10 minutes
    }
  ],
  
  // Notification settings
  notifications: {
    email: {
      enabled: true,
      recipients: ['admin@example.com'],
      fromAddress: 'monitor@example.com'
    },
    slack: {
      enabled: false,
      webhook: 'https://hooks.slack.com/services/YOUR_WEBHOOK_URL'
    }
  },
  
  // Server settings
  server: {
    port: 3000,
    host: 'localhost'
  }
};