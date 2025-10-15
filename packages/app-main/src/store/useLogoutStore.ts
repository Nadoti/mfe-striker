import { create } from 'zustand';

interface LogoutStore {
  isOpen: boolean;
  isLoading: boolean;
  openModal: () => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
}

export const useLogoutStore = create<LogoutStore>((set) => ({
  isOpen: false,
  isLoading: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false, isLoading: false }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

