import { useState, useContext, createContext } from "react";

type RentVehiclesContextType = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const RentVehiclesContext = createContext<RentVehiclesContextType | null>(null);

export function RentVehiclesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <RentVehiclesContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </RentVehiclesContext.Provider>
  );
}
