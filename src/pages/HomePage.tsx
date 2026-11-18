import Wordmark from "../components/ui/Wordmark";
export default function HomePage() {
  return (
    <>
      <h1 className="text-4xl tracking-tight">
        <Wordmark />
      </h1>
      <p className="mt-4 text-text-secondary">
        Explore algorithms, data structures, and computer science concepts.
      </p>
    </>
  );
}
