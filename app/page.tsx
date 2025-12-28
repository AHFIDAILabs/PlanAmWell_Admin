import { redirect } from "next/navigation";

export default function Home() {
  try {
    redirect("/login");
  } catch {
    return null;
  }
}
