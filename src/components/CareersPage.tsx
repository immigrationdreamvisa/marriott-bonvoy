import React, { useState } from 'react';
import { TAKE_CARE_PILLARS, JOB_OPENINGS, JobOpening } from '../data/careers';
import {
  Briefcase,
  Users,
  Globe2,
  Heart,
  Award,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  X,
  FileText,
  Upload,
  Check
} from 'lucide-react';

export const CareersPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [activeJob, setActiveJob] = useState<JobOpening | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantResume, setApplicantResume] = useState<string | null>(null);
  const [applicationSuccessCode, setApplicationSuccessCode] = useState<string | null>(null);

  const departments = [
    'All',
    'Culinary & F&B',
    'Hotel Operations',
    'Luxury Concierge',
    'Technology & Engineering'
  ];

  const filteredJobs = JOB_OPENINGS.filter(job => {
    return selectedDept === 'All' || job.department === selectedDept;
  });

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingCode = 'APP-' + Math.floor(100000 + Math.random() * 900000);
    setApplicationSuccessCode(trackingCode);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* Hero */}
      <div className="bg-stone-900 text-white relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=85"
            alt="Careers Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-radial from-transparent to-stone-900/90" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-amber-400 mb-3 block">
            Careers at Marriott International
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mb-4">
            Where Belonging Begins
          </h1>
          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base font-light leading-relaxed mb-8">
            Join a global family of more than 400,000 associates across 139 countries and territories. Grow your craft with world-renowned hotel brands and an award-winning culture of opportunity.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-stone-800">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">8,000+</div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider">Properties Worldwide</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">139</div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider">Countries & Territories</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">#1</div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider">World's Best Workplace</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">400k+</div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider">Passionate Associates</div>
            </div>
          </div>
        </div>
      </div>

      {/* TakeCare Culture Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8a1538] block mb-2">
            Our Culture & Heritage
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-bold mb-3">
            The TakeCare Philosophy
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Founded on the guiding belief that when we take care of our associates, they take care of our guests, and the world flourishes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {TAKE_CARE_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-[#8a1538]/40 transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a1538] block mb-1">
                Pillar 0{idx + 1}
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">{pillar.title}</h3>
              <p className="text-[11px] font-semibold text-stone-500 mb-2">{pillar.subtitle}</p>
              <p className="text-xs text-stone-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        {/* Job Listings Board */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200 pb-8 mb-8">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-[#8a1538] block mb-1">
                Open Career Opportunities
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Explore Available Positions
              </h3>
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                    selectedDept === dept
                      ? 'bg-[#8a1538] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="border border-stone-200 hover:border-stone-400 rounded-2xl p-6 transition-all hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-stone-50/50"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#8a1538]/10 text-[#8a1538] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                      {job.brand}
                    </span>
                    <span className="bg-stone-200 text-stone-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                      {job.department}
                    </span>
                    <span className="text-stone-400 font-mono text-[10px]">ID: {job.jobId}</span>
                  </div>

                  <h4 className="font-serif text-xl font-bold text-stone-900">{job.title}</h4>

                  <div className="flex items-center gap-4 text-xs text-stone-600">
                    <span className="font-semibold text-stone-800">{job.property}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8a1538]" />
                      {job.location}, {job.country}
                    </span>
                    <span>· {job.employmentType}</span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 pt-1">{job.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setActiveJob(job);
                      setIsApplying(false);
                      setApplicationSuccessCode(null);
                    }}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-stone-900 hover:bg-[#8a1538] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>View Role</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Details & Application Modal */}
      {activeJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-stone-900 border border-stone-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setActiveJob(null);
                setIsApplying(false);
                setApplicationSuccessCode(null);
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!isApplying ? (
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-[#8a1538]/10 text-[#8a1538] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    {activeJob.brand}
                  </span>
                  <span className="text-stone-400 font-mono text-xs">ID: {activeJob.jobId}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-1">{activeJob.title}</h3>
                <p className="text-xs text-stone-600 mb-4">
                  {activeJob.property} · {activeJob.location}, {activeJob.country} · {activeJob.employmentType}
                </p>

                <p className="text-xs text-stone-700 leading-relaxed mb-6 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  {activeJob.description}
                </p>

                <div className="mb-6 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {activeJob.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8a1538] shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Qualifications & Experience
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {activeJob.qualifications.map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    onClick={() => setIsApplying(true)}
                    className="px-6 py-2.5 bg-[#8a1538] hover:bg-[#6e0f2b] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                  >
                    Apply for this Position
                  </button>
                </div>
              </div>
            ) : !applicationSuccessCode ? (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <h3 className="font-serif text-2xl font-bold">Apply for {activeJob.title}</h3>
                <p className="text-xs text-stone-500 mb-4">{activeJob.property} · Reference {activeJob.jobId}</p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#8a1538]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. eleanor.vance@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#8a1538]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Telephone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 555-019-2834"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#8a1538]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Resume / CV *</label>
                    <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:border-[#8a1538] cursor-pointer bg-stone-50">
                      <input
                        type="file"
                        id="resume-file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setApplicantResume(e.target.files[0].name);
                          }
                        }}
                      />
                      <label htmlFor="resume-file" className="cursor-pointer">
                        <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1" />
                        <span className="text-xs font-semibold text-stone-700 block">
                          {applicantResume ? applicantResume : 'Click to upload PDF or DOCX file'}
                        </span>
                        <span className="text-[10px] text-stone-400">Max file size: 10MB</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                  >
                    ← Back to Description
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#8a1538] hover:bg-[#6e0f2b] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2">Application Received!</h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto mb-6">
                  Thank you, <strong>{applicantName}</strong>. Your application for <strong>{activeJob.title}</strong> at {activeJob.property} has been logged in the Marriott International Talent Portal.
                </p>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 inline-block mb-6">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Candidate Tracking Reference</span>
                  <span className="font-mono text-xl font-bold text-[#8a1538] tracking-widest">{applicationSuccessCode}</span>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setActiveJob(null);
                      setIsApplying(false);
                      setApplicationSuccessCode(null);
                    }}
                    className="px-6 py-2.5 bg-stone-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-800"
                  >
                    Return to Careers
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
