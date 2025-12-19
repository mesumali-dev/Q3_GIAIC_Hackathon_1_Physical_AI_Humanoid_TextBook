// ==============================
// API Types
// ==============================
export interface UserResponse {
  success: boolean;
  user_id: string;
  session_token: string;
  background_profile?: {
    software_level: string;
    hardware_background: string;
  };
}

export interface UserProfileUpdate {
  software_level?: string;
  hardware_background?: string;
}

export interface UserProfileResponse {
  user_id: string;
  software_level: string;
  hardware_background: string;
  created_at: string;
  updated_at: string;
}

export interface PersonalizationContextResponse {
  user_context: {
    software_level: string | null;
    hardware_background: string | null;
    personalization_notes: string;
    response_style: string;
    example_preference: string;
  };
}

// ==============================
// API Base URL (Uses proxy in development)
// ==============================
// Empty string means relative URLs, which will be handled by the Docusaurus proxy
const API_BASE_URL = 'http://localhost:8000';

// ==============================
// Helper: Safe JSON handler
// ==============================
const handleResponse = async (response: Response) => {
  const text = await response.text();

  if (!response.ok) {
    // Try to parse the error response to get specific error details
    try {
      const errorData = JSON.parse(text);

      // Handle validation errors (array format at top level)
      if (Array.isArray(errorData) && errorData.length > 0) {
        const validationErrors = errorData.map((error: any) => error.msg || JSON.stringify(error)).join('; ');
        throw new Error(`Validation Error: ${validationErrors}`);
      }
      // Handle specific error cases with user-friendly messages
      else if (errorData.detail) {
        // Check if detail is an array of validation errors (like [{"msg":"Field required",...}, {...}])
        if (Array.isArray(errorData.detail)) {
          const validationErrors = errorData.detail.map((error: any) => error.msg || JSON.stringify(error)).join('; ');
          throw new Error(`Validation Error: ${validationErrors}`);
        }
        // Check if detail is a string with specific error messages
        else if (typeof errorData.detail === 'string') {
          if (errorData.detail.includes('already registered')) {
            throw new Error('This email address is already registered. Please use a different email or try signing in instead.');
          } else if (errorData.detail.includes('Invalid credentials')) {
            throw new Error('Invalid email or password. Please try again.');
          } else if (errorData.detail.includes('not found')) {
            throw new Error('Account not found. Please check your email and try again.');
          } else {
            throw new Error(errorData.detail);
          }
        }
        // For other cases where detail is an object
        else {
          throw new Error('Request validation failed. Please check your input.');
        }
      } else {
        throw new Error(text || 'API request failed');
      }
    } catch {
      // If JSON parsing fails, throw the raw text
      throw new Error(text || 'API request failed');
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON response from server');
  }
};

// ==============================
// Auth Service
// ==============================
export const authService = {
  // ---------- SIGN UP ----------
  async signUp(
    email: string,
    password: string,
    softwareLevel: string,
    hardwareBackground: string
  ): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        software_level: softwareLevel,
        hardware_background: hardwareBackground
      })
    });

    return handleResponse(response);
  },

  // ---------- SIGN IN ----------
  async signIn(email: string, password: string): Promise<UserResponse> {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    return handleResponse(response);
  },

  // ---------- SIGN OUT ----------
  async signOut(): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signout`, {
      method: 'POST'
    });

    return handleResponse(response);
  },

  // ---------- GET PROFILE ----------
  async getUserProfile(token: string): Promise<UserProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return handleResponse(response);
  },

  // ---------- UPDATE PROFILE ----------
  async updateUserProfile(
    token: string,
    profileData: UserProfileUpdate
  ): Promise<UserProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    return handleResponse(response);
  },

  // ---------- PERSONALIZATION ----------
  async getPersonalizationContext(
    token: string
  ): Promise<PersonalizationContextResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/personalization/context`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return handleResponse(response);
  }
};
