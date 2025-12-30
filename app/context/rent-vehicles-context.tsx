import { useState, useContext } from "react";

const RentVehicles = useContext(null);

export function RentVehiclesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <RentVehiclesProvider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </RentVehiclesProvider>
  );
}
