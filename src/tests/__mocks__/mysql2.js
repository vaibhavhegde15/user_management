const mysql = jest.createMockFromModule('mysql2');

const mockPool = {
  getConnection: jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue([[], []]),
    release: jest.fn(),
  }),
};

mysql.createPool = jest.fn(() => mockPool);

module.exports = mysql;
