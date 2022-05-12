import { signInWithPopup, signOut } from "firebase/auth";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import Image from "next/image";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../lib/context";
import debounce from "lodash.debounce";

import googleIcon from "../public/google.png";

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  function signInWithGoogle() {
    signInWithPopup(auth, googleAuthProvider);
  }

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <Image width={30} height={30} src={googleIcon} alt="Google logo" />
      <p className="btn-text">Sign in with Google</p>
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => signOut(auth)}>Sign Out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      // Create refs for both documents
      const userDoc = doc(firestore, `users/${user.uid}`);
      const usernameDoc = doc(firestore, `usernames/${formValue}`);

      // Commit both docs together as a batch write.
      const batch = writeBatch(firestore);
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });

      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  }

  function onChange(e) {
    const value = e.target.value.toLowerCase();
    const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (value.length < 3) {
      setFormValue(value);
      setLoading(false);
      setIsValid(false);
    }

    if (regex.test(value)) {
      setFormValue(value);
      setLoading(true);
      setIsValid(false);
    }
  }

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const docRef = doc(firestore, "usernames", username);
        const docSnap = await getDoc(docRef);
        console.log("Firestore read executed!");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is either invalid or taken!</p>;
  } else {
    return <p></p>;
  }
}
