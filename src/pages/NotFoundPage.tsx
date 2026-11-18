import { Link } from "react-router";
export default function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <p>this page does not exist</p>
      <Link to="/">&larr; Back home</Link>
    </>
  );
}
