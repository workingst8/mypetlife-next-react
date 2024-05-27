import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface IntroState {
  introComplete: boolean;
  setIntroComplete: (complete: boolean) => void;
}

type MyPersist = (
  config: StateCreator<IntroState>,
  options: PersistOptions<IntroState>
) => StateCreator<IntroState>;

const useIntroStore = create<IntroState>(
  (persist as MyPersist)(
    (set) => ({
      introComplete: false,
      setIntroComplete: (complete) => set({ introComplete: complete }),
    }),
    {
      name: 'intro-store',
    }
  )
);

export default useIntroStore;
