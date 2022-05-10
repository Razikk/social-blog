import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import EnterPage from "./enter";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

import toast from "react-hot-toast";

export default function Home() {
  return (
    <div>
      <Link
        prefetch={false}
        href={{
          pathname: "/[username]",
          query: { username: "pau123" },
        }}
      >
        <a>Pau&apos;s profile</a>
      </Link>
      <button onClick={() => toast.success("hello toast!")}>Toast Me</button>
    </div>
  );
}
