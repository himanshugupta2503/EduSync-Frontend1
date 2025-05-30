import api from './api';

const CourseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await api.get('/Courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get course by ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/Courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },

  // Create new course (Instructor only)
  createCourse: async (courseData) => {
    try {
      // Format the data with PascalCase property names for .NET backend
      const formattedData = {
        Title: courseData.title,
        Description: courseData.description,
        InstructorId: courseData.instructorId
      };
      
      // Add optional fields only if they exist in courseData
      if (courseData.mediaUrl) formattedData.MediaUrl = courseData.mediaUrl;
      if (courseData.duration) formattedData.Duration = courseData.duration;
      if (courseData.startDate) formattedData.StartDate = courseData.startDate;
      if (courseData.enrollmentLimit) formattedData.EnrollmentLimit = courseData.enrollmentLimit;
      
      console.log('Sending course data to backend:', formattedData);
      const response = await api.post('/Courses', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Update course (Instructor only)
  updateCourse: async (id, courseData) => {
    try {
      // Format the data with PascalCase property names for .NET backend
      const formattedData = {
        Title: courseData.title,
        Description: courseData.description,
        InstructorId: courseData.instructorId
      };
      
      // Add optional fields only if they exist in courseData
      if (courseData.mediaUrl) formattedData.MediaUrl = courseData.mediaUrl;
      if (courseData.duration) formattedData.Duration = courseData.duration;
      if (courseData.startDate) formattedData.StartDate = courseData.startDate;
      if (courseData.enrollmentLimit) formattedData.EnrollmentLimit = courseData.enrollmentLimit;
      
      console.log(`Updating course ${id} with data:`, formattedData);
      const response = await api.put(`/Courses/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Delete course (Instructor only)
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/Courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw error;
    }
  }
};

export default CourseService;
