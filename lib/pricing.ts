import { prisma } from './prisma'

export interface GuestBreakdown {
  adults: number
  children: number
  infants: number
}

export interface PricingResult {
  totalPrice: number
  breakdown: {
    adults: { count: number; unitPrice: number; totalPrice: number }
    children: { count: number; unitPrice: number; totalPrice: number }
    infants: { count: number; unitPrice: number; totalPrice: number }
  }
  nights: number
}

/**
 * Calculate total price for a room booking based on new pricing rules
 */
export async function calculateRoomPrice(
  roomId: string,
  guests: GuestBreakdown,
  nights: number
): Promise<PricingResult> {
  const { adults, children, infants } = guests

  // Get adult pricing based on total adult count
  const adultPricing = await prisma.roomPricing.findUnique({
    where: {
      roomId_guestType_guestCount: {
        roomId,
        guestType: 'ADULT',
        guestCount: adults,
      },
    },
  })

  // Get child pricing (per child)
  const childPricing = await prisma.roomPricing.findUnique({
    where: {
      roomId_guestType_guestCount: {
        roomId,
        guestType: 'CHILD',
        guestCount: 1,
      },
    },
  })

  if (!adultPricing) {
    throw new Error(`Adult pricing not found for room ${roomId} with ${adults} adults`)
  }

  // Calculate prices
  const adultTotalPrice = adults * adultPricing.price * nights
  const childUnitPrice = childPricing?.price || 0
  const childTotalPrice = children * childUnitPrice * nights
  const infantTotalPrice = 0 // Infants are free

  const totalPrice = adultTotalPrice + childTotalPrice + infantTotalPrice

  return {
    totalPrice,
    breakdown: {
      adults: {
        count: adults,
        unitPrice: adultPricing.price,
        totalPrice: adultTotalPrice,
      },
      children: {
        count: children,
        unitPrice: childUnitPrice,
        totalPrice: childTotalPrice,
      },
      infants: {
        count: infants,
        unitPrice: 0,
        totalPrice: infantTotalPrice,
      },
    },
    nights,
  }
}

/**
 * Get available pricing options for a room
 */
export async function getRoomPricingOptions(roomId: string) {
  const pricing = await prisma.roomPricing.findMany({
    where: { roomId },
    orderBy: [
      { guestType: 'asc' },
      { guestCount: 'asc' },
    ],
  })

  const adultPricing = pricing.filter(p => p.guestType === 'ADULT')
  const childPricing = pricing.filter(p => p.guestType === 'CHILD')

  return {
    adult: adultPricing,
    child: childPricing,
  }
}

/**
 * Get the minimum price for a room (1 adult)
 */
export async function getMinimumRoomPrice(roomId: string): Promise<number> {
  const pricing = await prisma.roomPricing.findUnique({
    where: {
      roomId_guestType_guestCount: {
        roomId,
        guestType: 'ADULT',
        guestCount: 1,
      },
    },
  })

  return pricing?.price || 0
}