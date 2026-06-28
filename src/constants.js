export const DESIGNATIONS = [
  'PUBLIC SCHOOL TEACHER',
  'PRIVATE SCHOOL TEACHER',
  'GOVERNMENT EMPLOYEE',
  'PRIVATE EMPLOYEE',
  'OTHERS',
];

export const DEPED_STATUS = ['DepEd', 'Non-DepEd'];

export const TEACHING_STATUS = ['Teaching', 'Non-Teaching'];

export const GENDER = ['Male', 'Female'];

export const SECTIONS = [
  { id: 'personal', label: 'Personal Information' },
  { id: 'employment', label: 'Employment Details' },
  { id: 'contact', label: 'Contact & Address' },
  { id: 'voter', label: 'Voter Information' },
  { id: 'experience', label: 'Election Experience' },
];

export const INITIAL_FORM = {
  firstName: '',
  middleName: '',
  lastName: '',
  tin: '',
  depedStatus: '',
  designation: '',
  teachingStatus: '',
  salaryGrade: '',
  contactNumber: '',
  altContactNumber: '',
  email: '',
  gender: '',
  birthdate: '',
  address: '',
  votingBarangay: '',
  precinctNumber: '',
  electionExperience: '',
};