/* LEARNING NOTES FROM PAT
    Here we create a global state using zustand to manage authentication.
    As this is just a mock implementation, we are using localStorage instead
    of making real API calls to a backend server.
*/

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = { email: string };

// This is the "shape" of our auth store (state)
export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  delete: () => void;
  clearError: () => void;
}

/**
 * Zustand store for authentication state management.
 * It includes methods for login, registration, logout, and error handling.
 * The state is persisted in localStorage under the key 'auth'.
 */
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({ 
      token: null,
      user: null,
      loading: false,
      error: null,

      /**
       * Creates a token and user object upon successful login.
       * @param email String
       * @param password String
       */
      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        await new Promise((r) => setTimeout(r, 400)); // simulating network latency

        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const found = users.find((u: any) => u.email === email && u.password === password);

        if (!found) {
          const err = 'Invalid email or password';
          set({ error: err, loading: false });
          throw new Error(err);
        }

        const token = 'mock-token-' + Date.now();
        const user = { email };

        // keep compatibility with existing helpers that read token/user from localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        set({ token, user, loading: false });
      },

      /**
       * Stores new user credentials and creates a token in local storage.
       * @param email String
       * @param password String
       */
      register: async (email: string, password: string) => {
        set({ loading: true, error: null });
        await new Promise((r) => setTimeout(r, 700)); // mock latency

        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        if (users.some((u: any) => u.email === email)) {
          const err = 'User already exists';
          set({ error: err, loading: false });
          throw new Error(err);
        }

        users.push({ email, password });
        localStorage.setItem('mock_users', JSON.stringify(users));

        const token = 'mock-token-' + Date.now();
        const user = { email };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        set({ token, user, loading: false });
      },

      /**
       * Removes user credentials from localStorage and clears the auth state.
       */
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null });
      },

      /**
       * Delete the currently authenticated user's credentials from localStorage
       * and remove them from the mock_users list.
       */
      delete: () => {
        try {
          const state = get();
          const user = state.user;

          if (user && user.email) {
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            const filtered = users.filter((u: any) => u.email !== user.email);
            localStorage.setItem('mock_users', JSON.stringify(filtered));
          }

          // Clear auth tokens and state
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({ token: null, user: null });
        } catch (err) {
          // set a generic error message so UI can react if needed
          set({ error: 'Failed to delete account' });
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'auth' }
  )
);

export default useAuthStore;
