import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const applications = await prisma.internshipApplication.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Parse skills JSON for each application
    const applicationsWithParsedSkills = applications.map((app: any) => ({
      ...app,
      skills: JSON.parse(app.skills || '[]'),
    }))

    return NextResponse.json(applicationsWithParsedSkills)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

