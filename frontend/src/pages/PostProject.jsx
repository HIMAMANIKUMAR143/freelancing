import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

export const PostProject = () => {
  const { currentUser, openAuthModal, showToast } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    location_type: 'Remote',
    location_name: 'Global / Remote',
    description: '',
    experience_level: 'Intermediate',
    project_type: 'fixed',
    budget: 3500,
    duration: '1 to 3 months',
    skills: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <h2 style={{ fontSize: '26px' }}>Account Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>Please create a Client account or sign in to post a new job.</p>
        <button className="btn btn-primary" onClick={() => openAuthModal('register')}>Create Account / Sign In</button>
      </div>
    );
  }

  if (currentUser.role !== 'client') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '40px auto' }}>
        <h3>Client Account Required</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>Posting jobs requires a Client account persona.</p>
        <button className="btn btn-primary" onClick={() => openAuthModal('register')}>Switch to Client Account</button>
      </div>
    );
  }

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && !formData.title.trim()) return showToast('Please enter a project title', 'error');
    if (step === 2 && !formData.description.trim()) return showToast('Please enter a detailed description', 'error');
    if (step === 3 && Number(formData.budget) <= 0) return showToast('Please enter a valid budget', 'error');
    setStep(prev => prev + 1);
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const skillsArray = formData.skills
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : ['React', 'Node.js'];

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user-id': currentUser.id
        },
        body: JSON.stringify({
          ...formData,
          budget: Number(formData.budget),
          skills: skillsArray
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish job');

      showToast('Job published live on Step In!', 'success');
      navigate('/marketplace');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 0' }}>
      
      {/* Step Progress Indicator */}
      <div style={{ marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px' }}>
          <div style={{ fontWeight: 700, color: step >= 1 ? 'var(--accent-blue)' : 'var(--text-muted)' }}>1. Basic & Location</div>
          <div style={{ fontWeight: 700, color: step >= 2 ? 'var(--accent-blue)' : 'var(--text-muted)' }}>2. Scope</div>
          <div style={{ fontWeight: 700, color: step >= 3 ? 'var(--accent-blue)' : 'var(--text-muted)' }}>3. Budget</div>
          <div style={{ fontWeight: 700, color: step >= 4 ? 'var(--accent-blue)' : 'var(--text-muted)' }}>4. Publish</div>
        </div>
      </div>

      <div className="card">
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '24px' }}>Step 1: Project Title, Category & Location Setup</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Give your job posting a clear title, category, and work location setup.</p>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Project Title *</label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '20px' }}
                placeholder="e.g. Build a High-Frequency AI Analytics Dashboard in Next.js"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Category *</label>
              <select
                className="search-input"
                style={{ paddingLeft: '20px' }}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Web Development">Web Development</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="DevOps & Cloud">DevOps & Cloud Security</option>
                <option value="AI & Data Science">AI & Data Science</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Work Location Setup Model *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <label className="card" style={{ padding: '16px', cursor: 'pointer', textAlign: 'center', borderColor: formData.location_type === 'Remote' ? 'var(--accent-blue)' : 'var(--border-color)' }}>
                  <input type="radio" name="locType" value="Remote" checked={formData.location_type === 'Remote'} onChange={() => setFormData({ ...formData, location_type: 'Remote', location_name: 'Global / Remote' })} />
                  <div><strong>🌐 Remote (Global)</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Work from anywhere</div>
                </label>
                <label className="card" style={{ padding: '16px', cursor: 'pointer', textAlign: 'center', borderColor: formData.location_type === 'Hybrid' ? 'var(--accent-blue)' : 'var(--border-color)' }}>
                  <input type="radio" name="locType" value="Hybrid" checked={formData.location_type === 'Hybrid'} onChange={() => setFormData({ ...formData, location_type: 'Hybrid', location_name: 'San Francisco, CA (Hybrid)' })} />
                  <div><strong>🏢 Hybrid Setup</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Partial office & remote</div>
                </label>
                <label className="card" style={{ padding: '16px', cursor: 'pointer', textAlign: 'center', borderColor: formData.location_type === 'In-Office' ? 'var(--accent-blue)' : 'var(--border-color)' }}>
                  <input type="radio" name="locType" value="In-Office" checked={formData.location_type === 'In-Office'} onChange={() => setFormData({ ...formData, location_type: 'In-Office', location_name: 'New York, NY (In-Office HQ)' })} />
                  <div><strong>🏬 In-Office HQ</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Onsite location required</div>
                </label>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Location / City Name</label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '20px' }}
                placeholder="e.g. Global / Remote, London UK, San Francisco CA"
                value={formData.location_name}
                onChange={e => setFormData({ ...formData, location_name: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={handleNext}>Next: Detailed Scope →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '24px' }}>Step 2: Project Scope & Description</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Describe the project requirements and expectations.</p>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Detailed Project Description *</label>
              <textarea
                className="search-input"
                style={{ paddingLeft: '20px', minHeight: '160px', fontFamily: 'inherit' }}
                placeholder="Describe what you are building, key deliverables, and tech stack expectations..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Required Experience Level</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <label className="card" style={{ padding: '16px', cursor: 'pointer', textAlign: 'center' }}>
                  <input type="radio" name="exp" value="Entry" checked={formData.experience_level === 'Entry'} onChange={e => setFormData({ ...formData, experience_level: 'Entry' })} /> Entry Level
                </label>
                <label className="card" style={{ padding: '16px', cursor: 'pointer', textAlign: 'center' }}>
                  <input type="radio" name="exp" value="Intermediate" checked={formData.experience_level === 'Intermediate'} onChange={e => setFormData({ ...formData, experience_level: 'Intermediate' })} /> Intermediate
                </label>
                <label className="card" style={{ padding: '16px', cursor: 'pointer', textAlign: 'center' }}>
                  <input type="radio" name="exp" value="Expert" checked={formData.experience_level === 'Expert'} onChange={e => setFormData({ ...formData, experience_level: 'Expert' })} /> Expert
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={handlePrev}>← Back</button>
              <button className="btn btn-primary" onClick={handleNext}>Next: Budget & Terms →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '24px' }}>Step 3: Budget & Payment Terms</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Choose fixed price or hourly billing and set your budget.</p>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Pricing Model</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label className="card" style={{ padding: '16px', cursor: 'pointer' }}>
                  <input type="radio" name="ptype" value="fixed" checked={formData.project_type === 'fixed'} onChange={() => setFormData({ ...formData, project_type: 'fixed' })} />
                  <strong>Fixed Price</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Funded into Step In escrow per milestone.</div>
                </label>
                <label className="card" style={{ padding: '16px', cursor: 'pointer' }}>
                  <input type="radio" name="ptype" value="hourly" checked={formData.project_type === 'hourly'} onChange={() => setFormData({ ...formData, project_type: 'hourly' })} />
                  <strong>Hourly Rate</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Paid based on tracked hours.</div>
                </label>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Estimated Budget ($) *</label>
              <input
                type="number"
                className="search-input"
                style={{ paddingLeft: '20px' }}
                placeholder="e.g. 5000"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={handlePrev}>← Back</button>
              <button className="btn btn-primary" onClick={handleNext}>Next: Required Skills →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '24px' }}>Step 4: Tag Required Skills & Publish</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Add technology tags to match with qualified freelancers.</p>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Skills (comma separated)</label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '20px' }}
                placeholder="React, Node.js, TypeScript, PostgreSQL, UI/UX"
                value={formData.skills}
                onChange={e => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: 'var(--radius-md)', fontSize: '14px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>🚀 Ready to Publish on Step In</div>
              <div style={{ color: 'var(--text-secondary)' }}>Your job posting will immediately appear on the project marketplace with instant search indexing.</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={handlePrev}>← Back</button>
              <button className="btn btn-emerald" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Publishing...' : 'Publish Job Live'}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
