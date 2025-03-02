/**
 * Tests for the ServiceMonitor class
 */
const ServiceMonitor = require('../src/monitor');

// Mock axios
jest.mock('axios');
const axios = require('axios');

// Mock node-cron
jest.mock('node-cron', () => ({
  schedule: jest.fn((cron, callback) => {
    // Store the callback but don't execute it
    return { stop: jest.fn() };
  })
}));

describe('ServiceMonitor', () => {
  let monitor;
  let mockConfig;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock console methods to prevent logging during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create a mock config for testing
    mockConfig = {
      services: [
        {
          name: 'Test Service',
          url: 'https://test.example.com/health',
          expectedStatus: 200,
          checkInterval: '*/5 * * * *'
        }
      ],
      notifications: {
        email: {
          enabled: false,
          recipients: []
        },
        slack: {
          enabled: false
        }
      },
      server: {
        port: 3000,
        host: 'localhost'
      }
    };
    
    // Create a new ServiceMonitor instance
    monitor = new ServiceMonitor(mockConfig);
  });
  
  test('should initialize with correct service stats', () => {
    const stats = monitor.getStats();
    
    expect(stats.length).toBe(1);
    expect(stats[0].name).toBe('Test Service');
    expect(stats[0].status).toBe('UNKNOWN');
    expect(stats[0].uptime).toBe(100);
    expect(stats[0].lastChecked).toBe('Never');
  });
  
  test('should mark service as UP when status matches expected', async () => {
    // Mock axios to return a successful response
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { status: 'healthy' }
    });
    
    await monitor.checkService(mockConfig.services[0]);
    
    const stats = monitor.getStats();
    expect(stats[0].status).toBe('UP');
    expect(stats[0].upChecks).toBe(1);
    expect(stats[0].totalChecks).toBe(1);
    expect(stats[0].uptime).toBe('100.00');
  });
  
  test('should mark service as DOWN when status does not match expected', async () => {
    // Mock axios to return an error response
    axios.get.mockResolvedValueOnce({
      status: 500,
      data: { error: 'Internal Server Error' }
    });
    
    await monitor.checkService(mockConfig.services[0]);
    
    const stats = monitor.getStats();
    expect(stats[0].status).toBe('DOWN');
    expect(stats[0].upChecks).toBe(0);
    expect(stats[0].totalChecks).toBe(1);
    expect(stats[0].uptime).toBe('0.00');
  });
  
  test('should mark service as DOWN when request fails', async () => {
    // Mock axios to throw an error
    axios.get.mockRejectedValueOnce(new Error('Connection refused'));
    
    await monitor.checkService(mockConfig.services[0]);
    
    const stats = monitor.getStats();
    expect(stats[0].status).toBe('DOWN');
    expect(stats[0].upChecks).toBe(0);
    expect(stats[0].totalChecks).toBe(1);
    expect(stats[0].uptime).toBe('0.00');
  });
});