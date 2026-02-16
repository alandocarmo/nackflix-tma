import { create } from "zustand";

const EPOCH_LENGTH_SEC_DEFAULT = 300;

export const useEpochStore = create((set, get) => ({
  epochLengthSec: EPOCH_LENGTH_SEC_DEFAULT,
  epochStartMs: Date.now(),
  epochId: 1,
  proofsAccepted: 0,

    syncEpochNow: () => {
    const { epochStartMs, epochLengthSec, epochId } = get();
    const now = Date.now();
    const elapsedSec = Math.floor((now - epochStartMs) / 1000);

    if (elapsedSec >= epochLengthSec) {
      const epochsPassed = Math.floor(elapsedSec / epochLengthSec);
      set({
        epochStartMs: epochStartMs + epochsPassed * epochLengthSec * 1000,
        epochId: epochId + epochsPassed,
        proofsAccepted: 0
      });
    }
  },

  markProofAccepted: () => set((s) => ({ proofsAccepted: s.proofsAccepted + 1 })),

}));