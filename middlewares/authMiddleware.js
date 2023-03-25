const jwt = require('jsonwebtoken');
const  User  = require('../models/users');
const { Jobseeker } = require('../models/jobseekers');
const { Recruiter } = require('../models/recruiters');
const { Employer } = require('../models/employers');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error();
    }
    console.log(user);

    if (user.userRole.superAdmin) {
      // SuperAdmin has full access
      req.user = user;
      next();
    }
    else if (user.userRole.admin) {
      // Admin has access to everything except adding/deleting SuperAdmin users
      req.user = user;
      if (req.method === 'POST' && req.path === '/users' && req.body.userRole === 'SuperAdmin') {
        throw new Error();
      }
      if (req.method === 'DELETE' && req.path.startsWith('/users/') && req.path.endsWith('/SuperAdmin')) {
        throw new Error();
      }
      next();
    } else if (user.userRole === 'Company HR') {
      // Company HR has access to jobs and jobseekers collections
      req.user = user;
      if (req.method === 'POST' && req.path.startsWith('/jobs')) {
        next();
      } else if (req.method === 'GET' && req.path.startsWith('/jobs')) {
        next();
      } else if (req.method === 'PUT' && req.path.startsWith('/jobs')) {
        next();
      } else if (req.method === 'PATCH' && req.path.startsWith('/jobs')) {
        next();
      } else if (req.method === 'DELETE' && req.path.startsWith('/jobs')) {
        next();
      } else if (req.method === 'POST' && req.path.startsWith('/jobseekers')) {
        next();
      } else if (req.method === 'GET' && req.path.startsWith('/jobseekers')) {
        next();
      } else if (req.method === 'PUT' && req.path.startsWith('/jobseekers')) {
        next();
      } else if (req.method === 'PATCH' && req.path.startsWith('/jobseekers')) {
        next();
      } else {
        throw new Error();
      }
    } else if (user.userRole === 'Client Manager') {
      // Client Manager has access to employers and jobseekers collections
      req.user = user;
      if (req.method === 'POST' && req.path.startsWith('/employers')) {
        next();
      } else if (req.method === 'GET' && req.path.startsWith('/employers')) {
        next();
      } else if (req.method === 'PUT' && req.path.startsWith('/employers')) {
        next();
      } else if (req.method === 'PATCH' && req.path.startsWith('/employers')) {
        next();
      } else if (req.method === 'DELETE' && req.path.startsWith('/employers')) {
        next();
      } else if (req.method === 'POST' && req.path.startsWith('/jobseekers')) {
        next();
      } else if (req.method === 'GET' && req.path.startsWith('/jobseekers')) {
        next();
      } else if (req.method === 'PUT' && req.path.startsWith('/jobseekers')) {
        next();
      } else if (req.method === 'PATCH' && req.path.startsWith('/jobseekers')) {
        next();
      } else if (req.method === 'DELETE' && req.path.startsWith('/jobseekers')) {
        next();
        
      } else if (user.userRole === 'Jobseeker') {
        // Jobseeker can access only their own profile
        if (req.method === 'GET' && req.path === `/jobseekers/${user.jobseekerProfile}`) {
          next();
        } else if (req.method === 'PUT' && req.path === `/jobseekers/${user.jobseekerProfile}`) {
          next();
        } else if (req.method === 'PATCH' && req.path === `/jobseekers/${user.jobseekerProfile}`) {
          next();
        } else {
          throw new Error();
        }
    } else if (user.userRole === 'Recruiter') {
        // Recruiter can access only their own profile
        if (req.method === 'GET' && req.path === `/recruiters/${user.recruiterProfile}`) {
          req.user = user;
          next();
        } else if (req.method === 'PUT' && req.path === `/recruiters/${user.recruiterProfile}`) {
          req.user = user;
          next();
        } else if (req.method === 'PATCH' && req.path === `/recruiters/${user.recruiterProfile}`) {
          req.user = user;
          next();
        } else {
          throw new Error();
        }
      }
    } else {
        throw new Error();
      }
      {
      res.status(401).send({ error: 'Not authorized to access this resource' });
    }
    next();
  }catch (error){}
}    

module.exports = authMiddleware;