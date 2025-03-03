# Service Monitor Test Project

A simple service monitoring application for testing purposes.

## Features

- Monitor the status of web services
- Display uptime statistics
- Send notifications for service outages

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jasondsmith72/Web-Service-monitor.git
   cd Web-Service-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the application**
   Edit the `config.js` file to set up your services, notification preferences, and server settings.
   ```javascript
   module.exports = {
     // Services to monitor
     services: [
       {
         name: 'Your Service Name',
         url: 'https://your-service-url.com/health',
         expectedStatus: 200,
         checkInterval: '*/5 * * * *' // Check every 5 minutes (cron format)
       },
       // Add more services as needed
     ],
     
     // Notification settings
     notifications: {
       email: {
         enabled: true,
         recipients: ['your-email@example.com'],
         fromAddress: 'monitor@your-domain.com'
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
   ```

## Usage

1. **Start the monitoring service**
   ```bash
   npm start
   ```

2. **Access the dashboard**
   Open your web browser and navigate to `http://localhost:3000` (or whatever host/port you configured)

3. **View service status**
   The dashboard displays real-time status of all configured services, including:
   - Current status (up/down)
   - Last check time
   - Uptime percentage
   - Response time history

4. **Receive notifications**
   When a service goes down or recovers, you'll receive notifications based on your configuration in `config.js`

## Advanced Configuration

### Check Intervals

The `checkInterval` property uses cron syntax for scheduling:

- `*/5 * * * *`: Every 5 minutes
- `*/30 * * * *`: Every 30 minutes
- `0 */1 * * *`: Every hour
- `0 0 * * *`: Once a day at midnight

### Custom Status Codes

You can set different expected status codes for different services:

```javascript
{
  name: 'API with custom status',
  url: 'https://api.example.com/status',
  expectedStatus: 204, // No content response
  checkInterval: '*/5 * * * *'
}
```

## Structure

- `src/`: Application source code
- `config.js`: Configuration file
- `package.json`: Project dependencies
- `tests/`: Test cases

## Running Tests

```bash
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
