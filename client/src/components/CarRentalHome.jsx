
import {CarGrid, HeroSection, Testimonials, Features} from "./index"
import RideBookingCard from "./pages/RideBookingCard";

const CarRentalHome = () => {
  return (
    <>
      <HeroSection />
      <RideBookingCard />
      <CarGrid />
      <Features />
      <Testimonials />
    </>
  );
};

export default CarRentalHome;
