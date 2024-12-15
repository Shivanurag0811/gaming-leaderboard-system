const request = require('supertest');
const app = require('../server');  // Import your Express app

describe('GET /api/games', () => {
  it('should fetch all games', async () => {
    const response = await request(app).get('/api/games');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
