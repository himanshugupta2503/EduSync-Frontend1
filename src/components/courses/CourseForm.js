import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import courseService from '../../services/courseService';

const CourseForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const isEditMode = !!courseId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    const fetchCourse = async () => {
      if (isEditMode) {
        try {
          setInitialLoading(true);
          const courseData = await courseService.getCourseById(courseId);
          setFormData({
            title: courseData.title,
            description: courseData.description,
            mediaUrl: courseData.mediaUrl || ''
          });
        } catch (err) {
          console.error('Error fetching course:', err);
          toast.error('Failed to load course data');
          navigate('/instructor/courses');
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchCourse();
  }, [courseId, isEditMode, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    }
    
    if (formData.mediaUrl && !isValidUrl(formData.mediaUrl)) {
      newErrors.mediaUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const courseData = {
        ...formData,
        instructorId: currentUser.userId
      };
      
      if (isEditMode) {
        await courseService.updateCourse(courseId, {
          courseId,
          ...courseData
        });
        toast.success('Course updated successfully');
      } else {
        await courseService.createCourse(courseData);
        toast.success('Course created successfully');
      }
      
      navigate('/instructor/courses');
    } catch (error) {
      console.error('Course submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to save course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1>{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
          <p className="text-muted">
            {isEditMode 
              ? 'Update your course information' 
              : 'Fill in the details to create a new course'}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Course Title*</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter course title"
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description*</label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter course description"
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="mediaUrl" className="form-label">Media URL</label>
                  <input
                    type="text"
                    className={`form-control ${errors.mediaUrl ? 'is-invalid' : ''}`}
                    id="mediaUrl"
                    name="mediaUrl"
                    value={formData.mediaUrl}
                    onChange={handleChange}
                    placeholder="Enter video or other media URL (optional)"
                  />
                  {errors.mediaUrl && <div className="invalid-feedback">{errors.mediaUrl}</div>}
                  <div className="form-text">
                    <i className="bi bi-info-circle me-1"></i>
                    Enter the URL for course video content or supplementary materials.
                  </div>
                </div>
                
                <div className="d-flex justify-content-between">
                  <Link to="/instructor/courses" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : isEditMode ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Tips for Creating Courses</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Provide a clear, descriptive title
                </li>
                <li className="list-group-item">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Include detailed course description
                </li>
                <li className="list-group-item">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Add relevant media content
                </li>
                <li className="list-group-item">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Create assessments to test knowledge
                </li>
              </ul>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title">What's Next?</h5>
              <p className="card-text">
                After creating your course, you can add assessments for students to complete.
              </p>
              <p className="card-text">
                You'll be able to track student progress and view results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
