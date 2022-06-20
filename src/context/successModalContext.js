import { createContext, useContext, useState } from "react";

const SuccessModalContext = createContext()

export function SuccessModalProvider({ children }) {
  const [isSuccessOpen, setSuccessOpen] = useState(false)
  const closeSuccess = () => setSuccessOpen(false)
  const openSuccess = () => setSuccessOpen(true)

  return (
    <SuccessModalContext.Provider value={{ isSuccessOpen, closeSuccess, openSuccess }}>
      {children}
    </SuccessModalContext.Provider>
  );
}

export default function useSuccessModal() {
  const context = useContext(SuccessModalContext)
  if (context === undefined) {
    throw new Error("useSuccessModal must be used with SuccessModalContext.Provider")
  }
  return context
}
