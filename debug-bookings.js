const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBookings() {
  try {
    console.log('Checking bookings for room-202...\n');
    
    const bookings = await prisma.booking.findMany({
      where: {
        roomId: 'room-202',
        status: {
          in: ['CONFIRMED', 'COMPLETED', 'PENDING']
        }
      },
      orderBy: {
        checkIn: 'asc'
      }
    });

    console.log(`Found ${bookings.length} bookings:`);
    
    bookings.forEach((booking, index) => {
      console.log(`\nBooking ${index + 1}:`);
      console.log('  ID:', booking.id);
      console.log('  CheckIn:', booking.checkIn);
      console.log('  CheckOut:', booking.checkOut);
      console.log('  CheckIn (ISO):', booking.checkIn.toISOString());
      console.log('  CheckOut (ISO):', booking.checkOut.toISOString());
      console.log('  CheckIn (Date String):', booking.checkIn.toISOString().split('T')[0]);
      console.log('  CheckOut (Date String):', booking.checkOut.toISOString().split('T')[0]);
      console.log('  Status:', booking.status);
      console.log('  Guest:', booking.guestName);
      
      // Test our logic
      const checkInDate = booking.checkIn.toISOString().split('T')[0];
      const checkOutDate = booking.checkOut.toISOString().split('T')[0];
      const checkIn = new Date(checkInDate + 'T00:00:00Z');
      const checkOut = new Date(checkOutDate + 'T00:00:00Z');
      
      const bookedDates = [];
      const current = new Date(checkIn);
      
      while (current < checkOut) {
        bookedDates.push(current.toISOString().split('T')[0]);
        current.setUTCDate(current.getUTCDate() + 1);
      }
      
      console.log('  Should mark as booked:', bookedDates);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBookings();