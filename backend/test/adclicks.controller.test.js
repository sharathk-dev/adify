import { recordClickLogger } from '../controllers/adclicks.controller.js'; // adjust path as needed
import AdClick from '../models/AdClick.js'; // adjust path as needed

// Mock Express response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  return res;
};

// Mock AdClick methods
jest.mock('../models/AdClick.js', () => ({
  getAdClick: jest.fn(),
  insertAdClick: jest.fn(),
  updateAdClick: jest.fn()
}));

describe('recordClickLogger', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if adId or memberId is missing', async () => {
    const req = { body: { adId: '', memberId: '' } };
    const res = mockResponse();

    await recordClickLogger(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "adId and memberId are required" });
  });

  it('should insert a new ad click if no existing record', async () => {
    const req = {
      body: {
        adId: 'ad123',
        memberId: 'user456',
        transactionId: 'txn789',
        isClicked: true
      }
    };
    const res = mockResponse();

    AdClick.getAdClick.mockResolvedValue(null);
    AdClick.insertAdClick.mockResolvedValue({});

    await recordClickLogger(req, res);

    expect(AdClick.getAdClick).toHaveBeenCalledWith('txn789');
    expect(AdClick.insertAdClick).toHaveBeenCalledWith('ad123', 'user456', true);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Ad click recorded" });
  });

  it('should update ad click if record already exists', async () => {
    const req = {
      body: {
        adId: 'ad123',
        memberId: 'user456',
        transactionId: 'txn789',
        isClicked: true
      }
    };
    const res = mockResponse();

    AdClick.getAdClick.mockResolvedValue({ transactionId: 'txn789' });
    AdClick.updateAdClick.mockResolvedValue({});

    await recordClickLogger(req, res);

    expect(AdClick.getAdClick).toHaveBeenCalledWith('txn789');
    expect(AdClick.updateAdClick).toHaveBeenCalledWith('txn789');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Ad click recorded" });
  });

  it('should return 500 if an error is thrown', async () => {
    const req = {
      body: {
        adId: 'ad123',
        memberId: 'user456',
        transactionId: 'txn789',
        isClicked: true
      }
    };
    const res = mockResponse();

    AdClick.getAdClick.mockRejectedValue(new Error('DB failure'));

    await recordClickLogger(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
