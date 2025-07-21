export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  collegeInfo: CollegeInfo;
  graduationDetails: GraduationDetails;
  codilityScores: CodilityScore[];
  midtermScore: number;
  gcScore: number;
  finalScore: number;
}

export interface CollegeInfo {
  collegeName: string;
  department: string;
  major: string;
}

export interface GraduationDetails {
  graduationDate: string;
  cgpa: number;
}

export interface CodilityScore {
  testName: string;
  score: number;
}