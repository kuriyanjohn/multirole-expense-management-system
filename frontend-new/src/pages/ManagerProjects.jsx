import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FolderKanban, Plus, Pencil, Trash2, XCircle, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';

const ManagerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState({ name: '', description: '', budget: 0, status: 'active' });
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchProjects();
  }, [token, navigate]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/manager/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProjects(await res.json());
      } else {
        toast.error('Failed to load projects');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setCurrentProject(project);
      setIsEditing(true);
    } else {
      setCurrentProject({ name: '', description: '', budget: 0, status: 'active' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProject({ name: '', description: '', budget: 0, status: 'active' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentProject.name.trim()) return toast.error('Project name is required');

    try {
      const url = isEditing 
        ? `http://localhost:5000/api/manager/projects/${currentProject._id}`
        : 'http://localhost:5000/api/manager/projects';
      
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(currentProject),
      });

      if (res.ok) {
        toast.success(isEditing ? 'Project updated' : 'Project created');
        handleCloseModal();
        fetchProjects();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Action failed');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/manager/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success('Project deleted');
        fetchProjects();
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary-600" /></div>;

  return (
    <Layout role="manager" title="Manage Projects">
      <div className="animate-fade-in space-y-8">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Your Projects</h2>
            <p className="text-slate-500 text-sm mt-1">Create and manage projects to categorize team expenses.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="glass-card p-6 flex flex-col hover:shadow-lg transition-shadow group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <FolderKanban className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(project)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(project._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 truncate" title={project.name}>{project.name}</h3>
              <p className="text-slate-500 text-sm mt-2 line-clamp-2 flex-grow">{project.description || 'No description provided.'}</p>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Budget</p>
                  <p className="text-slate-700 font-semibold mt-1">${project.budget.toLocaleString()}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <FolderKanban className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-700">No projects yet</h3>
              <p className="text-slate-500 mt-1">Get started by creating your first project.</p>
              <button 
                onClick={() => handleOpenModal()} 
                className="mt-6 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
              >
                Create Project
              </button>
            </div>
          )}
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition"><XCircle className="h-6 w-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
                <input 
                  type="text" 
                  value={currentProject.name} 
                  onChange={(e) => setCurrentProject({...currentProject, name: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Q3 Marketing Campaign"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  value={currentProject.description} 
                  onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Brief overview of the project goals..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Budget ($)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={currentProject.budget} 
                    onChange={(e) => setCurrentProject({...currentProject, budget: Number(e.target.value)})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select 
                    value={currentProject.status} 
                    onChange={(e) => setCurrentProject({...currentProject, status: e.target.value})}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition shadow-sm">
                  {isEditing ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default ManagerProjects;
