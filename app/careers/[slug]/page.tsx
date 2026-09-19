"use client";
import { use } from "react";

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { jobs } from '@/lib/data/jobs';
import Link from 'next/link';
export default function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const job = jobs.find(j => j.slug === slug);
  
  if (!job) {
    notFound();
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    coverLetter: '',
    expectedSalary: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append('jobId', job.id);
      data.append('jobTitle', job.title);
      
      if (file) {
        data.append('resume', file);
      }

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Submission failed');
      
      setStatus('success');
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        linkedin: '', portfolio: '', coverLetter: '', expectedSalary: ''
      });
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-white font-inter pb-20 pt-32">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/careers" className="text-[#06B6D4] hover:underline mb-8 inline-block">
          &larr; Back to Careers
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-space font-bold mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-400">
            <span className="px-3 py-1 rounded-full bg-white/10">{job.department}</span>
            <span className="px-3 py-1 rounded-full bg-white/10">{job.location}</span>
            <span className="px-3 py-1 rounded-full bg-white/10">{job.type}</span>
            <span className="px-3 py-1 rounded-full bg-white/10">{job.experience}</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-16">
          <h3 className="text-2xl font-space font-bold mb-4">About the Role</h3>
          <p className="text-gray-300 mb-8">{job.description}</p>
          
          <h3 className="text-2xl font-space font-bold mb-4">Responsibilities</h3>
          <ul className="list-disc pl-5 text-gray-300 mb-8 space-y-2">
            {job.responsibilities.map((req, i) => <li key={i}>{req}</li>)}
          </ul>
          
          <h3 className="text-2xl font-space font-bold mb-4">Requirements</h3>
          <ul className="list-disc pl-5 text-gray-300 mb-8 space-y-2">
            {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
          </ul>
        </div>

        {/* Application Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10">
          <h2 className="text-3xl font-space font-bold mb-8">Apply for this role</h2>
          
          {status === 'success' ? (
            <div className="p-6 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200">
              Thank you for applying! We've received your application and will be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name *</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-[#05060A] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#7C3AED]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name *</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-[#05060A] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#7C3AED]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#05060A] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#7C3AED]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-[#05060A] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#7C3AED]" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">LinkedIn Profile</label>
                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full bg-[#05060A] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#7C3AED]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Portfolio / Website</label>
                    <input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} className="w-full bg-[#05060A] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#7C3AED]" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Resume & Cover Letter</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Resume / CV * (PDF, DOCX)</label>
                  <input required type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full bg-[#05060A] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#7C3AED] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7C3AED]/20 file:text-[#7C3AED] hover:file:bg-[#7C3AED]/30" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Cover Letter</label>
                  <textarea name="coverLetter" value={formData.coverLetter} onChange={handleInputChange} rows={4} className="w-full bg-[#05060A] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#7C3AED] resize-none"></textarea>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Additional Info</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Expected Salary</label>
                  <input type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleInputChange} placeholder="e.g. $100,000" className="w-full bg-[#05060A] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#7C3AED]" />
                </div>
              </div>

              {status === 'error' && (
                <div className="text-red-400 text-sm">Something went wrong. Please try again.</div>
              )}

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
