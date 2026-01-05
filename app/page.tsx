'use client'

import { useState } from 'react'

export default function InternshipForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    educationYear: '',
    collegeName: '',
    courseDegreeName: '',
    gender: '',
    skills: [] as string[],
    newSkill: '',
    startAt7AM: false,
    punctuality: false,
    workMondayToSaturday: false,
    complete90Days: false,
    breakNotExceed1Hour: false,
    endOnMisbehavior: false,
    endOnNoOutput: false,
    officeCommuteTime: '',
    strength: '',
    weakness: '',
    hobbies: '',
    englishFluencyRating: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }))
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          educationYear: '',
          collegeName: '',
          courseDegreeName: '',
          gender: '',
          skills: [],
          newSkill: '',
          startAt7AM: false,
          punctuality: false,
          workMondayToSaturday: false,
          complete90Days: false,
          breakNotExceed1Hour: false,
          endOnMisbehavior: false,
          endOnNoOutput: false,
          officeCommuteTime: '',
          strength: '',
          weakness: '',
          hobbies: '',
          englishFluencyRating: 5,
        })
        setTimeout(() => setSubmitStatus(null), 5000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Ba Labah Services Pvt Ltd
            </h1>
            <p className="text-lg text-gray-600">Mira Road</p>
            <h2 className="text-2xl font-semibold text-indigo-600 mt-4">
              Internship Application Form
            </h2>
          </div>

          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Application submitted successfully!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Error submitting application. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Education Information */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Education Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Passout <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="educationYear"
                    required
                    value={formData.educationYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    required
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course/Degree Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="courseDegreeName"
                    required
                    value={formData.courseDegreeName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Skills</h3>
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.newSkill}
                    onChange={(e) => setFormData(prev => ({ ...prev, newSkill: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Add
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Internship Terms */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Internship Terms & Conditions</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="startAt7AM"
                    checked={formData.startAt7AM}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">I will start at 7 AM</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="punctuality"
                    checked={formData.punctuality}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">I will maintain punctuality</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="workMondayToSaturday"
                    checked={formData.workMondayToSaturday}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">I will work Monday to Saturday</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="complete90Days"
                    checked={formData.complete90Days}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">I will complete 90 days internship</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="breakNotExceed1Hour"
                    checked={formData.breakNotExceed1Hour}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">I will not exceed break time of 1 hour</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="endOnMisbehavior"
                    checked={formData.endOnMisbehavior}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">I understand my internship will end if there is any misbehavior/malpractice</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="endOnNoOutput"
                    checked={formData.endOnNoOutput}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">I understand my internship will end if there is no output</span>
                </label>
              </div>
        </div>

            {/* Additional Information */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office Commute Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="officeCommuteTime"
                    required
                    value={formData.officeCommuteTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Commute Time</option>
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="45 minutes">45 minutes</option>
                    <option value="1 hour">1 hour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strength
                  </label>
                  <textarea
                    name="strength"
                    value={formData.strength}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weakness
                  </label>
                  <textarea
                    name="weakness"
                    value={formData.weakness}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hobbies
                  </label>
                  <textarea
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    English Fluency Rating (out of 10) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="englishFluencyRating"
                    required
                    min="1"
                    max="10"
                    value={formData.englishFluencyRating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
