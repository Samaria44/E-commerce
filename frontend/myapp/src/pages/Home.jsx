import Hero from "../components/Carousel";
import Features from "../components/feature";
import CategoryCarousel from "../components/CategoryCarousel";
import ProductCarousel from "../components/ProductCarousel";
import Banner from "../components/banner";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CategoryCarousel />
      <ProductCarousel label="Trending Now" title="Popular This Week" />
      <Banner />
    </>
  );
}
