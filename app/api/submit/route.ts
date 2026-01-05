import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      email,
      phoneNumber,
      educationYear,
      collegeName,
      courseDegreeName,
      gender,
      skills,
      startAt7AM,
      punctuality,
      workMondayToSaturday,
      complete90Days,
      breakNotExceed1Hour,
      endOnMisbehavior,
      endOnNoOutput,
      officeCommuteTime,
      strength,
      weakness,
      hobbies,
      englishFluencyRating,
    } = body

    // Validate required fields
    if (!name || !email || !phoneNumber || !educationYear || !collegeName || 
        !courseDegreeName || !gender || !officeCommuteTime || !englishFluencyRating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store skills as JSON string
    const skillsJson = JSON.stringify(skills || [])

    const application = await prisma.internshipApplication.create({
      data: {
        name,
        email,
        phoneNumber,
        educationYear,
        collegeName,
        courseDegreeName,
        gender,
        skills: skillsJson,
        startAt7AM: startAt7AM || false,
        punctuality: punctuality || false,
        workMondayToSaturday: workMondayToSaturday || false,
        complete90Days: complete90Days || false,
        breakNotExceed1Hour: breakNotExceed1Hour || false,
        endOnMisbehavior: endOnMisbehavior || false,
        endOnNoOutput: endOnNoOutput || false,
        officeCommuteTime,
        strength: strength || '',
        weakness: weakness || '',
        hobbies: hobbies || '',
        englishFluencyRating: parseInt(englishFluencyRating) || 5,
      },
    })

    return NextResponse.json(
      { message: 'Application submitted successfully', id: application.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

