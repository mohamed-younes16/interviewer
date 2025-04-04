import { UserData } from "@/types";
import { User } from "firebase/auth";

import { create } from "zustand";

type Store = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  setUserData: (data: UserData | null) => void;
  setUser: (u: User | null) => void;
  setLoading: (l: boolean) => void;
};

export const useStore = create<Store>()((set) => ({
  user: null,
  loading: true,
  userData: null,
  setUserData: (userData: UserData | null) => set({ userData }),

  setUser: (user: User | null) => set({ user, loading: false }),
  setLoading: (loading: boolean) => set({ loading }),
}));
