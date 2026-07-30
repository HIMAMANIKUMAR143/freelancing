import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { Search, MapPin, Briefcase, DollarSign, ShieldCheck, Tag } from 'lucide-react';

export const Marketplace = () => {
  const { currentUser, openAuthModal, showToast } = useAuth();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');
  const [locationType, setLocationType] = useState('All');
  const [maxBudget, setMaxBudget] = useState(20000);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  // Selected project for modal drawer
  const [selectedProject, setSelectedProject] = useState(null);

  // Proposal modal state inside drawer
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedBid, setProposedBid] = useState('');
  const [estDuration, setEstDuration] = useState('1 to 3 months');
  const [submittingProposal, setSubmittingProposal] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category !== 'All') params.append('category', category);
      if (type !== 'All') params.append('type', type);
      if (locationType !== 'All') params.append('locationType', locationType);
      if (maxBudget) params.append('maxBudget', maxBudget);

      const res = await fetch(`/api/projects?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, type, locationType, maxBudget]);

  const handleSearchInput = async (val) => {
    setQuery(val);
    if (val.length >= 2) {
      try {
        const res = await fetch(`/api/projects/suggestions?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
    fetchProjects();
  };

  const selectSuggestion = (val) => {
    setQuery(val);
    setSuggestions([]);
    fetchProjects();
  };

  const handleOpenDetail = async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedProject(data.project);
        setProposedBid(data.project.budget);
      }
    } catch (err) {
      showToast('Could not load project details', 'error');
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setSelectedProject(null);
      return openAuthModal('register');
    }
    if (!coverLetter.trim() || !proposedBid) {
      return showToast('Please enter cover letter and bid amount', 'error');
    }

    setSubmittingProposal(true);
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user-id': currentUser.id
        },
        body: JSON.stringify({
          project_id: selectedProject.id,
          cover_letter: coverLetter,
          proposed_bid: Number(proposedBid),
          estimated_duration: estDuration
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit proposal');

      showToast('Proposal submitted successfully!', 'success');
      setProposalModalOpen(false);
      setSelectedProject(null);
      setCoverLetter('');
      fetchProjects();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingProposal(false);
    }
  };

  return (
    <div style={{ padding: '24px 0' }}>
      
      {/* Search Header Banner */}
      <div className="search-banner">
        <h2 style={{ fontSize: '28px' }}>Explore Verified Projects Worldwide</h2>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by job title, location (e.g. London, Remote, New York), or tech stack..."
            value={query}
            onChange={e => handleSearchInput(e.target.value)}
          />
          {suggestions.length > 0 && (
            <div className="autocomplete-dropdown active">
              {suggestions.map((s, idx) => (
                <div key={idx} className="autocomplete-item" onClick={() => selectSuggestion(s.label)}>
                  <span>{s.type === 'skill' ? '🏷️' : '💼'}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="marketplace-layout">
        
        {/* Sidebar Filters */}
        <aside className="filter-sidebar">
          {/* Work Location Setup Filter */}
          <div className="filter-group">
            <div className="filter-title">Work Location Setup</div>
            <label className="filter-option">
              <input type="radio" name="loc" value="All" checked={locationType === 'All'} onChange={() => setLocationType('All')} /> All Setup Models
            </label>
            <label className="filter-option">
              <input type="radio" name="loc" value="Remote" checked={locationType === 'Remote'} onChange={() => setLocationType('Remote')} /> 🌐 Remote (Global)
            </label>
            <label className="filter-option">
              <input type="radio" name="loc" value="Hybrid" checked={locationType === 'Hybrid'} onChange={() => setLocationType('Hybrid')} /> 🏢 Hybrid Setup
            </label>
            <label className="filter-option">
              <input type="radio" name="loc" value="In-Office" checked={locationType === 'In-Office'} onChange={() => setLocationType('In-Office')} /> 🏬 In-Office HQ
            </label>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <div className="filter-title">Category</div>
            <label className="filter-option">
              <input type="radio" name="cat" value="All" checked={category === 'All'} onChange={() => setCategory('All')} /> All Categories
            </label>
            <label className="filter-option">
              <input type="radio" name="cat" value="Web Development" checked={category === 'Web Development'} onChange={() => setCategory('Web Development')} /> Web Development
            </label>
            <label className="filter-option">
              <input type="radio" name="cat" value="Design & Creative" checked={category === 'Design & Creative'} onChange={() => setCategory('Design & Creative')} /> Design & Creative
            </label>
            <label className="filter-option">
              <input type="radio" name="cat" value="DevOps & Cloud" checked={category === 'DevOps & Cloud'} onChange={() => setCategory('DevOps & Cloud')} /> DevOps & Cloud
            </label>
          </div>

          {/* Project Type Filter */}
          <div className="filter-group">
            <div className="filter-title">Project Type</div>
            <label className="filter-option">
              <input type="radio" name="type" value="All" checked={type === 'All'} onChange={() => setType('All')} /> All Types
            </label>
            <label className="filter-option">
              <input type="radio" name="type" value="Fixed" checked={type === 'Fixed'} onChange={() => setType('Fixed')} /> Fixed Price
            </label>
            <label className="filter-option">
              <input type="radio" name="type" value="Hourly" checked={type === 'Hourly'} onChange={() => setType('Hourly')} /> Hourly Rate
            </label>
          </div>

          {/* Max Budget Range */}
          <div className="filter-group">
            <div className="filter-title">Max Budget ($)</div>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
            />
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'right' }}>Up to ${Number(maxBudget).toLocaleString()}</div>
          </div>
        </aside>

        {/* Project Cards Grid */}
        <main>
          <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Showing {projects.length} verified active project{projects.length === 1 ? '' : 's'}
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <h3>No projects found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Try adjusting your location setup filters or search keywords.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(p => (
                <div key={p.id} className="project-card">
                  <div className="project-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <div className="project-title" onClick={() => handleOpenDetail(p.id)}>{p.title}</div>
                        <span className={`badge ${p.location_type === 'Remote' ? 'badge-emerald' : p.location_type === 'Hybrid' ? 'badge-blue' : 'badge-amber'}`}>
                          {p.location_type === 'Remote' ? '🌐 Global Remote' : p.location_type === 'Hybrid' ? '🏢 Hybrid' : '🏬 In-Office'}
                        </span>
                      </div>
                      <div className="project-meta">
                        <span>Posted by <strong>{p.company_name || p.client_name}</strong></span>
                        <span>•</span>
                        <span>📍 {p.location_name || p.client_location}</span>
                        <span>•</span>
                        <span>💼 {p.category}</span>
                        <span>•</span>
                        <span className="badge badge-emerald">${Number(p.client_total_spent || 0).toLocaleString()} spent</span>
                      </div>
                    </div>

                    <div className="project-budget">
                      {p.project_type === 'fixed' ? `$${Number(p.budget).toLocaleString()}` : `$${p.budget}/hr`}
                    </div>
                  </div>

                  <p className="project-description">{p.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="skills-list">
                      {p.skills.map((s, idx) => (
                        <span key={idx} className="skill-tag">{s}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{p.proposal_count} proposal{p.proposal_count === 1 ? '' : 's'}</span>
                      <button className="btn btn-sm btn-primary" onClick={() => handleOpenDetail(p.id)}>View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Project Detail Drawer Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          footer={
            currentUser?.role === 'freelancer' ? (
              <button className="btn btn-primary" onClick={() => setProposalModalOpen(true)}>Submit Proposal</button>
            ) : !currentUser ? (
              <button className="btn btn-primary" onClick={() => openAuthModal('register')}>Sign In to Apply</button>
            ) : null
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedProject.category} • {selectedProject.experience_level} Level</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
                  {selectedProject.project_type === 'fixed' ? `Fixed Price: $${Number(selectedProject.budget).toLocaleString()}` : `Hourly Rate: $${selectedProject.budget}/hr`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedProject.company_name || selectedProject.client_name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📍 {selectedProject.location_name || selectedProject.client_location}</div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Project Overview</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{selectedProject.description}</p>
            </div>

            <div>
              <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Required Skills</h4>
              <div className="skills-list">
                {selectedProject.skills.map((s, idx) => (
                  <span key={idx} className="skill-tag" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue)' }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              🔒 <strong>Step In Escrow Protected:</strong> Client's payment is secured before work begins and released upon milestone completion.
            </div>
          </div>
        </Modal>
      )}

      {/* Submit Proposal Modal */}
      {proposalModalOpen && selectedProject && (
        <Modal
          isOpen={proposalModalOpen}
          onClose={() => setProposalModalOpen(false)}
          title={`Submit Proposal for ${selectedProject.title}`}
        >
          <form onSubmit={handleSubmitProposal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Your Proposed Bid Amount ($) *</label>
              <input
                type="number"
                className="search-input"
                style={{ paddingLeft: '16px' }}
                value={proposedBid}
                onChange={e => setProposedBid(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Estimated Delivery Duration</label>
              <select className="search-input" style={{ paddingLeft: '16px' }} value={estDuration} onChange={e => setEstDuration(e.target.value)}>
                <option value="Less than 1 month">Less than 1 month</option>
                <option value="1 to 3 months">1 to 3 months</option>
                <option value="3 to 6 months">3 to 6 months</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Cover Letter & Work Plan *</label>
              <textarea
                className="search-input"
                style={{ paddingLeft: '16px', minHeight: '140px', fontFamily: 'inherit' }}
                placeholder="Explain why you are the best fit for this project, past relevant experience, and key milestone deliverables..."
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                required
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setProposalModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submittingProposal}>
                {submittingProposal ? 'Submitting...' : 'Send Proposal'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
