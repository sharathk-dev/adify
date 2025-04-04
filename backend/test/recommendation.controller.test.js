
import { getRecommendedAds } from '../controllers/recommendation.controller.js'; // Adjust path as needed

// Mock lodash
import _ from 'lodash';

// Sample test data (copied and reusable here)
const transactions = [
  { uid: 1001, user_id: 1, totalAmount: "10.00", paidAmount: "2.00", fee: "4.00", transactionId: "abcd-1234", vehicleModel: "Toyota Camry", entryTime: "2024-04-01T12:00:00Z", exitTime: "2024-04-01T14:00:00Z", location_code: 101, vehicleNumber: "XYZ-1234" }
];

const ads = [
  { id: 10, advertiser_id: 2, ad_url: "https://example.com/ad1", image_url: "https://example.com/ad1.jpg", locationIds: [101, 102], CPC: 0.5, category_id: 5 },
  { id: 11, advertiser_id: 3, ad_url: "https://example.com/ad2", image_url: "https://example.com/ad2.jpg", locationIds: [101], CPC: 0.7, category_id: 5 },
  { id: 12, advertiser_id: 4, ad_url: "https://example.com/ad3", image_url: "https://example.com/ad3.jpg", locationIds: [102], CPC: 0.4, category_id: 2 }
];

const adClicks = [
  { id: 5001, ad_id: 10, user_id: 1, timestamp: "2024-04-01T13:30:00Z", isClicked: true }
];

// Mock lodash methods
jest.mock('lodash', () => ({
  last: jest.fn(),
  orderBy: jest.fn()
}));

describe('getRecommendedAds', () => {
  beforeEach(() => {
    // Reset lodash mocks before each test
    _.last.mockReset();
    _.orderBy.mockReset();
  });

  it('should return recommended ads based on category clicks and location', () => {
    // Setup mock return values
    const userId = 1;
    const lastTransaction = transactions[0];

    _.last.mockImplementation(arr => arr[arr.length - 1]);
    _.orderBy.mockImplementation((collection, iteratees, orders) => {
      return collection.sort((a, b) => b.CPC - a.CPC);
    });

    const result = getRecommendedAds(userId);

    expect(result.memberId).toBe(1);
    expect(result.licensePlate).toBe("XYZ-1234");
    expect(result.transactionId).toBe("abcd-1234");

    expect(result.recommended_ads).toEqual([
      {
        ad_url: "https://example.com/ad2",
        target_url: "https://example.com/ad2.jpg",
        ad_id: 11
      },
      {
        ad_url: "https://example.com/ad1",
        target_url: "https://example.com/ad1.jpg",
        ad_id: 10
      }
    ]);
  });

  it('should return ads based only on location if user has no ad clicks', () => {
    // Simulate no clicks
    const userId = 2;
    const transaction = {
      user_id: 2,
      transactionId: "tx-2",
      vehicleNumber: "ABC-9999",
      entryTime: "2024-04-02T10:00:00Z",
      exitTime: "2024-04-02T11:00:00Z",
      location_code: 101,
      paidAmount: "1.00",
      totalAmount: "5.00",
      fee: "1.00"
    };

    // Push to transactions list temporarily
    transactions.push(transaction);

    _.last.mockImplementation(arr => arr[arr.length - 1]);
    _.orderBy.mockImplementation(col => col.sort((a, b) => b.CPC - a.CPC));

    const result = getRecommendedAds(userId);

    expect(result.memberId).toBe(2);
    expect(result.recommended_ads.length).toBe(2);
    expect(result.recommended_ads[0].ad_id).toBe(11); // Highest CPC first

    // Cleanup after test
    transactions.pop();
  });

  it('should return empty array if no transaction is found', () => {
    const result = getRecommendedAds(999); // Unknown user
    expect(result).toEqual([]);
  });

  it('should sort ads by CPC descending', () => {
    const userId = 1;

    _.last.mockImplementation(arr => arr[arr.length - 1]);
    _.orderBy.mockImplementation(col => col.sort((a, b) => b.CPC - a.CPC));

    const result = getRecommendedAds(userId);
    const cpcs = result.recommended_ads.map(ad => {
      const match = ads.find(a => a.id === ad.ad_id);
      return match?.CPC;
    });

    // Check CPC is descending
    expect(cpcs).toEqual([...cpcs].sort((a, b) => b - a));
  });
});
