import { getRecommendations } from '../controllers/recommendation.controller.js';
import Ad from '../models/Ad.js';
import Transaction from '../models/Transaction.js';
import Member from '../models/Member.js';
import Location from '../models/Location.js';

// Mock Sequelize models
jest.mock('../models/Ad.js');
jest.mock('../models/Transaction.js');
jest.mock('../models/Member.js');
jest.mock('../models/Location.js');

describe('getRecommendations', () => {
  beforeEach(() => {
    // Reset mock models before each test
    Ad.findAll.mockReset();
    Transaction.findAll.mockReset();
    Transaction.findOne.mockReset();
    Member.findByPk.mockReset();
    Location.findByPk.mockReset();
  });

  it('should return recommendations based on transactionId', async () => {
    const req = {
      query: { transactionId: 'tx-1' },
      member: { id: 1 }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Transaction.findByPk.mockResolvedValue({
      id: 'tx-1',
      memberId: 1,
      locationId: 101,
      vehicleNumber: 'XYZ-1234',
      vehicleDetails: JSON.stringify({ make: 'Toyota', model: 'Camry' }),
      paid:10.00,
      serviceFee:4.00,
      total:14.00,
      entryTime: "2024-04-01T12:00:00Z",
      exitTime: "2024-04-01T14:00:00Z",
      discount:1.00

    });

    Member.findByPk.mockResolvedValue({
      id: 1,
      vehicles: JSON.stringify(['XYZ-1234'])
    });

    Transaction.findAll.mockResolvedValue([
      {
        id: 'tx-1',
        memberId: 1,
        vehicleDetails: JSON.stringify({ make: 'Toyota', model: 'Camry' })
      }
    ]);

    Ad.findAll.mockResolvedValue([
      {
        id: 10,
        locationIds: JSON.stringify([101]),
        categoryId: 4,
        get: jest.fn().mockReturnValue({
          id: 10,
          locationIds: JSON.stringify([101]),
          categoryId: 4
        })
      }
    ]);

    Location.findByPk.mockResolvedValue({
      name:"Test Location"
    })

    await getRecommendations(req, res);

    expect(res.json).toHaveBeenCalled();
    const response = res.json.mock.calls[0][0];
    expect(response.memberId).toBe(1);
    expect(response.transactionId).toBe('tx-1');
    expect(response.recommendations.length).toBe(1);
  });

  it('should return recommendations based on memberId and locationId', async () => {
    const req = {
      query: { memberId: 2, locationId: 102 },
      member: { id: 2 }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Member.findByPk.mockResolvedValue({
      id: 2,
      vehicles: JSON.stringify([])
    });

    Location.findByPk.mockResolvedValue({
      name:"Test Location 2"
    })

    Ad.findAll.mockResolvedValue([
      {
        id: 12,
        locationIds: JSON.stringify([102]),
        categoryId: 2,
        get: jest.fn().mockReturnValue({
          id: 12,
          locationIds: JSON.stringify([102]),
          categoryId: 2
        })
      }
    ]);

    await getRecommendations(req, res);

    expect(res.json).toHaveBeenCalled();
    const response = res.json.mock.calls[0][0];
    expect(response.memberId).toBe(2);
    expect(response.locationId).toBe(102);
    expect(response.recommendations.length).toBe(1);
  });

  it('should return 404 if transaction is not found', async () => {
    const req = {
      query: { transactionId: 'nonexistent-tx' },
      member: { id: 1 }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Transaction.findByPk.mockResolvedValue(null);

    await getRecommendations(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Transaction not found' });
  });

  it('should return 404 if member is not found', async () => {
    const req = {
      query: { memberId: 999, locationId: 101 },
      member: { id: 999 }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Member.findByPk.mockResolvedValue(null);

    await getRecommendations(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Member not found' });
  });

  it('should return 403 if member tries to access another member\'s data', async () => {
    const req = {
      query: { memberId: 2, locationId: 101 },
      member: { id: 1 }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Member.findByPk.mockResolvedValue({ id: 2 });

    await getRecommendations(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: You can only access your own recommendations' });
  });

  it('should return 500 if an internal server error occurs', async () => {
    const req = {
      query: { memberId: 1, locationId: 101 },
      member: { id: 1 }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Member.findByPk.mockRejectedValue(new Error('Database error'));

    await getRecommendations(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
  });
});