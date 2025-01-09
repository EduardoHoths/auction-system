export interface Auction {
  id: string
  name: string
  referencePrice: number
  status: 'OPEN' | 'CLOSED'
  endTime?: Date
  currentBid?: number
  bids: Bid[]
}

export interface Bid {
  id: string
  auctionId: string
  bidderName: string
  amount: number
  timestamp: Date
}

