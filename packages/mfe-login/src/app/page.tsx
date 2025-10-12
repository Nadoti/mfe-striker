'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { AuthLayout } from "./components/AuthLayout";
import { SignupForm } from "./components/SignupForm";

export default function Home() {
  return (
   <div className="d-flex justify-center">
      <AuthLayout title="Crie sua conta">
        <SignupForm />
      </AuthLayout>
    </div>
  );
}
