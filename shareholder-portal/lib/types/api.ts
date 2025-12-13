// API Types
export interface Shareholder {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  type: 'individual' | 'institution';
  status: 'pending' | 'approved' | 'rejected';
  role: 'admin' | 'shareholder';
  ownership: number;
  totalShares: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShareClass {
  id: string;
  name: 'COMMON' | 'PREFERRED' | 'OPTIONS_POOL' | 'TREASURY';
  description?: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  type: 'GENERAL' | 'FINANCIAL' | 'MANAGER_ELECTION' | 'TRANSFER_APPROVAL' | 'AMENDMENT' | 'NEW_SHAREHOLDER';
  status: 'open' | 'closed' | 'approved' | 'rejected' | 'pending';
  requiredThreshold: number;
  createdAt: string;
  updatedAt: string;
  // Optional metadata fields for general/amendment and election-style proposals
  candidates?: Array<{
    name: string;
    position?: string;
    bio?: string;
  }>;
  position?: string;
  numberOfPositions?: number;
  otherDetails?: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  votes?: Vote[];
  transferRequests?: ShareTransferRequest[];
  targetShareholder?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    totalShares?: number;
    ownership?: number;
  };
}

export interface Vote {
  id: string;
  proposalId: string;
  shareholderId: string;
  vote: 'YES' | 'NO' | 'ABSTAIN';
  voteWeight: number;
  createdAt: string;
  shareholder?: {
    id: string;
    firstName: string;
    lastName: string;
    ownership: number;
  };
}

export interface ShareTransferRequest {
  id: string;
  fromShareholderId: string;
  toShareholderId: string;
  shareClassId: string;
  amount: number;
  price: number;
  issueDate: string;
  status: 'pending' | 'voting' | 'approved' | 'rejected' | 'completed';
  proposalId?: string;
  createdAt: string;
  updatedAt: string;
  from?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    totalShares?: number;
  };
  to?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    totalShares?: number;
  };
  shareClass?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface VotingResult {
  totalVotingWeight: number;
  yesWeight: number;
  noWeight: number;
  abstainWeight: number;
  yesPercentage: number;
  noPercentage: number;
  abstainPercentage: number;
  isApproved: boolean;
  requiredThreshold: number;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  size: string;
  icon: string;
  color: string;
  downloads: number;
  category: string;
}

// API Request/Response Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin';
}

export interface CreateNewShareholderProposalRequest {
  title: string;
  description: string;
  acquisitionMode: 'purchaseFromSingle' | 'purchaseByDilution';
  fromShareholderId?: string;
  requiredThreshold?: number;
  newShareholder: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    type: 'individual' | 'institution';
    role: 'shareholder';
    targetOwnership: number;
    targetShares: number;
  };
}

export interface CreateShareTransferProposalRequest {
  title: string;
  description: string;
  toShareholderId: string;
  shareClassId: string;
  amount: number;
  price: number;
  requiredThreshold?: number;
}

export interface CastVoteRequest {
  vote: 'YES' | 'NO' | 'ABSTAIN';
}

export interface CreateGeneralProposalRequest {
  title: string;
  description: string;
  type: 'GENERAL' | 'AMENDMENT';
  requiredThreshold?: number;
  candidates?: Array<{
    name: string;
    position?: string;
    bio?: string;
  }>;
  position?: string;
  numberOfPositions?: number;
  otherDetails?: string;
}

// API Response Wrappers
export interface ShareholdersResponse {
  shareholders: Shareholder[];
}

export interface UsersResponse {
  users: Shareholder[];
}

export interface ShareClassesResponse {
  shareClasses: ShareClass[];
}

export interface ProposalsResponse {
  proposals: Proposal[];
}

export interface ProposalResponse {
  proposal: Proposal;
  votingResults?: VotingResult;
}

export interface VotingResultsResponse {
  votingResults: VotingResult;
}

export interface ReportsResponse {
  reports: Report[];
}