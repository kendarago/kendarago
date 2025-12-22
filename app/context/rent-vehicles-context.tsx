import React, { createContext, useContext, useState } from "react";
type RentVehiclesType = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const RentVehiclesContext = createContext<RentVehiclesType | undefined>(
  undefined,
);

export function RentVehiclesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <RentVehiclesContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </RentVehiclesContext.Provider>
  );
}

export function useRentVehicles() {
  const context = useContext(RentVehiclesContext);
  if (!context) {
    throw new Error("useContext error");
  }
  return context;
}
