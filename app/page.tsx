import { redirect } from "next/navigation";
import LoginPage from "./(publicpage)/login/page";

export default function Home() {
  redirect("/login");
  return <LoginPage />;
}
