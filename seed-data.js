const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Internship = require('./models/Internship');
const Placement = require('./models/Placement');

const createUserWithHashedPassword = async ({ email, password, role }) => {
  const user = new User({ email, password, role });
  await user.save(); // triggers password hashing middleware
  return user;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected for seeding...');

    await User.deleteMany({});
    await Student.deleteMany({});
    await Company.deleteMany({});
    await Internship.deleteMany({});
    await Placement.deleteMany({});
    console.log('✓ Old data cleared');

    // Create companies
    const company1 = await Company.create({
      name: 'Google India',
      email: 'hr@google.com',
      phoneNumber: '9876543210',
      website: 'google.com',
      location: 'Bangalore',
      description: 'Search and Cloud Services',
      hrContact: { name: 'John Doe', phone: '9876543210', email: 'john@google.com' },
    });

    const company2 = await Company.create({
      name: 'Microsoft India',
      email: 'hr@microsoft.com',
      phoneNumber: '9876543211',
      website: 'microsoft.com',
      location: 'Hyderabad',
      description: 'Cloud and Software',
      hrContact: { name: 'Sarah Smith', phone: '9876543211', email: 'sarah@microsoft.com' },
    });

    const company3 = await Company.create({
      name: 'Amazon India',
      email: 'hr@amazon.com',
      phoneNumber: '9876543212',
      website: 'amazon.com',
      location: 'Delhi',
      description: 'E-commerce and Cloud',
      hrContact: { name: 'Mike Johnson', phone: '9876543212', email: 'mike@amazon.com' },
    });

    console.log('✓ Companies created');

    // Create internships
    const internship1 = await Internship.create({
      position: 'Backend Developer Intern',
      companyId: company1._id,
      description: 'Build scalable APIs using Node.js and MongoDB',
      location: 'Bangalore',
      stipend: 75000,
      duration: '3 months',
      requiredSkills: ['Node.js', 'MongoDB', 'REST APIs'],
      eligibility: { minGPA: 7.0, allowedDepartments: ['CSE', 'IT'] },
      applicationDeadline: new Date('2025-12-31'),
    });

    const internship2 = await Internship.create({
      position: 'Frontend Developer Intern',
      companyId: company2._id,
      description: 'Build responsive web apps using React',
      location: 'Hyderabad',
      stipend: 60000,
      duration: '3 months',
      requiredSkills: ['React', 'JavaScript', 'CSS'],
      eligibility: { minGPA: 6.5, allowedDepartments: ['CSE', 'IT'] },
      applicationDeadline: new Date('2025-12-31'),
    });

    const internship3 = await Internship.create({
      position: 'Data Science Intern',
      companyId: company3._id,
      description: 'Work on ML models and data analysis',
      location: 'Delhi',
      stipend: 80000,
      duration: '3 months',
      requiredSkills: ['Python', 'Machine Learning', 'SQL'],
      eligibility: { minGPA: 7.5, allowedDepartments: ['CSE', 'IT'] },
      applicationDeadline: new Date('2025-12-31'),
    });

    console.log('✓ Internships created');

    // Create placements
    const placement1 = await Placement.create({
      position: 'Software Engineer - Backend',
      companyId: company1._id,
      description: 'Full-time backend development role',
      location: 'Bangalore',
      salary: 1500000,
      jobType: 'full-time',
      requiredSkills: ['Node.js', 'MongoDB', 'AWS'],
      eligibility: { minGPA: 7.5, allowedDepartments: ['CSE', 'IT'] },
      applicationDeadline: new Date('2025-12-31'),
    });

    const placement2 = await Placement.create({
      position: 'Software Engineer - Frontend',
      companyId: company2._id,
      description: 'Full-time frontend development role',
      location: 'Hyderabad',
      salary: 1400000,
      jobType: 'full-time',
      requiredSkills: ['React', 'TypeScript', 'Redux'],
      eligibility: { minGPA: 7.0, allowedDepartments: ['CSE', 'IT'] },
      applicationDeadline: new Date('2025-12-31'),
    });

    const placement3 = await Placement.create({
      position: 'Data Scientist',
      companyId: company3._id,
      description: 'Full-time data science role',
      location: 'Delhi',
      salary: 1600000,
      jobType: 'full-time',
      requiredSkills: ['Python', 'TensorFlow', 'SQL', 'Spark'],
      eligibility: { minGPA: 8.0, allowedDepartments: ['CSE', 'IT'] },
      applicationDeadline: new Date('2025-12-31'),
    });

    console.log('✓ Placements created');

    // Update company offers
    company1.internshipOffers.push(internship1._id);
    company1.placementOffers.push(placement1._id);
    await company1.save();

    company2.internshipOffers.push(internship2._id);
    company2.placementOffers.push(placement2._id);
    await company2.save();

    company3.internshipOffers.push(internship3._id);
    company3.placementOffers.push(placement3._id);
    await company3.save();

    console.log('✓ Company references updated');

    // Create Users and Students
    const admin = await createUserWithHashedPassword({
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✓ Admin created');

    const student1User = await createUserWithHashedPassword({
      email: 'student1@example.com',
      password: 'pass123',
      role: 'student',
    });
    const student1 = await Student.create({
      userId: student1User._id,
      email: student1User.email,
      name: 'Raj Kumar',
      rollNo: 'CSE001',
      department: 'CSE',
      gpa: 8.5,
      skills: ['Node.js', 'MongoDB', 'React'],
    });

    const student2User = await createUserWithHashedPassword({
      email: 'student2@example.com',
      password: 'pass123',
      role: 'student',
    });
    const student2 = await Student.create({
      userId: student2User._id,
      email: student2User.email,
      name: 'Priya Singh',
      rollNo: 'CSE002',
      department: 'CSE',
      gpa: 8.2,
      skills: ['Python', 'Django', 'PostgreSQL'],
    });

    console.log('✓ Students created');
    console.log('\n✅ Data seeded successfully!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
