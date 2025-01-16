import { Suspense } from "react";
import LoginComponent from "./loginComponent";

export default function LoginPage() {
  return (
    <Suspense fallback={<div></div>}>
      <LoginComponent />
    </Suspense>
  );
}
