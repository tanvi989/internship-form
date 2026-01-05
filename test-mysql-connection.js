/**
 * MySQL Connection Test Script
 * Run this to verify your MySQL database connection
 * 
 * Usage: node test-mysql-connection.js
 */

const { PrismaClient } = require('./node_modules/.prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔌 Testing MySQL connection...\n')
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Successfully connected to MySQL database!\n')
    
    // Get database info
    const result = await prisma.$queryRaw`SELECT DATABASE() as current_db, VERSION() as mysql_version`
    console.log('📊 Database Information:')
    console.log(`   Current Database: ${result[0].current_db}`)
    console.log(`   MySQL Version: ${result[0].mysql_version}\n`)
    
    // Count records
    const count = await prisma.internshipApplication.count()
    console.log(`📝 Total Applications: ${count}\n`)
    
    // Test a simple query
    if (count > 0) {
      const firstApp = await prisma.internshipApplication.findFirst({
        select: {
          name: true,
          email: true,
          createdAt: true
        }
      })
      console.log('📄 Sample Record:')
      console.log(`   Name: ${firstApp.name}`)
      console.log(`   Email: ${firstApp.email}`)
      console.log(`   Created: ${firstApp.createdAt}\n`)
    }
    
    console.log('🎉 All tests passed! MySQL connection is working correctly.')
    
  } catch (error) {
    console.error('❌ Connection failed!\n')
    console.error('Error details:')
    console.error(error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Tip: Check if MySQL server is running')
      console.error('   Run: sudo systemctl status mysql')
    } else if (error.code === 'P1001') {
      console.error('\n💡 Tip: Check your DATABASE_URL in .env file')
      console.error('   Format: mysql://user:password@host:port/database')
    } else if (error.code === 'P1000') {
      console.error('\n💡 Tip: Authentication failed. Check username and password')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Connection closed.')
  }
}

// Run the test
testConnection()

