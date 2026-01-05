'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Application {
  id: string
  name: string
  email: string
  phoneNumber: string
  educationYear: string
  collegeName: string
  courseDegreeName: string
  gender: string
  skills: string[]
  startAt7AM: boolean
  punctuality: boolean
  workMondayToSaturday: boolean
  complete90Days: boolean
  breakNotExceed1Hour: boolean
  endOnMisbehavior: boolean
  endOnNoOutput: boolean
  officeCommuteTime: string
  strength: string
  weakness: string
  hobbies: string
  englishFluencyRating: number
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      } else {
        setError('Failed to fetch applications')
      }
    } catch (err) {
      setError('Error loading applications')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Ba Labah Services Pvt Ltd
              </h1>
              <p className="text-gray-600">Admin Dashboard - Internship Applications</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Back to Form
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Total Applications: {applications.length}
            </h2>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <ApplicationRow key={app.id} application={app} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ApplicationRow({ application }: { application: Application }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {application.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {application.email}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {application.phoneNumber}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {application.collegeName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {application.courseDegreeName}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          <div className="flex flex-wrap gap-1">
            {application.skills.slice(0, 2).map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                {skill}
              </span>
            ))}
            {application.skills.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{application.skills.length - 2}
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(application.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            {isExpanded ? 'Hide' : 'View'}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={8} className="px-6 py-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Personal Details</h4>
                <p><span className="font-medium">Gender:</span> {application.gender}</p>
                <p><span className="font-medium">Year of Passout:</span> {application.educationYear}</p>
                <p><span className="font-medium">Commute Time:</span> {application.officeCommuteTime}</p>
                <p><span className="font-medium">English Fluency:</span> {application.englishFluencyRating}/10</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Terms & Conditions</h4>
                <div className="space-y-1">
                  <p>✓ Start at 7 AM: {application.startAt7AM ? 'Yes' : 'No'}</p>
                  <p>✓ Punctuality: {application.punctuality ? 'Yes' : 'No'}</p>
                  <p>✓ Work Mon-Sat: {application.workMondayToSaturday ? 'Yes' : 'No'}</p>
                  <p>✓ Complete 90 Days: {application.complete90Days ? 'Yes' : 'No'}</p>
                  <p>✓ Break ≤ 1 Hour: {application.breakNotExceed1Hour ? 'Yes' : 'No'}</p>
                  <p>✓ End on Misbehavior: {application.endOnMisbehavior ? 'Yes' : 'No'}</p>
                  <p>✓ End on No Output: {application.endOnNoOutput ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Additional Info</h4>
                <p><span className="font-medium">Strength:</span> {application.strength || 'N/A'}</p>
                <p><span className="font-medium">Weakness:</span> {application.weakness || 'N/A'}</p>
                <p><span className="font-medium">Hobbies:</span> {application.hobbies || 'N/A'}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

