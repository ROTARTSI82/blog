// Import the functions you need from the SDKs you need
import { type FirebaseApp, initializeApp } from "firebase/app";
import { type Analytics, getAnalytics, logEvent, setUserId} from "firebase/analytics";
import { type AppCheck, initializeAppCheck, ReCaptchaV3Provider} from "firebase/app-check";

import {
  type Firestore,
  getFirestore,
  doc,
  collection,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
  getDoc
} from "firebase/firestore";

import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
  type User,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "@firebase/auth";

import {useEffect, type FC, useRef, useState} from "react";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";


// https://firebase.google.com/docs/web/setup#available-libraries

export interface AppContext {
  app?: FirebaseApp,
  analytics?: Analytics,
  auth?: Auth,
  provider?: GoogleAuthProvider,
  appCheck?: AppCheck,
  db?: Firestore,
}

const nullCtx: AppContext = {};

const firebaseCtx = atom<AppContext | null>(null);
const firebaseUser = atom<User | null>(null);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx2oWM-mjiJQaR966eNBqyNVdRz0OO_CU",
  authDomain: "personal-website-6eaad.firebaseapp.com",
  projectId: "personal-website-6eaad",
  storageBucket: "personal-website-6eaad.firebasestorage.app",
  messagingSenderId: "596717279502",
  appId: "1:596717279502:web:5480659af6b89bfe4b1f5f",
  measurementId: "G-EHRKKGTZWH"
};

let curKey = 0;
const nextKey = () => curKey++;

export const FirebaseLoader: FC = () => {
  useEffect( () => {
    const app = initializeApp(firebaseConfig);
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6LdFT24rAAAAAHgVJ7QOvPZEOmXPCfNkYpNBLrvo'),
      isTokenAutoRefreshEnabled: true
    });

    const analytics = getAnalytics(app);
    logEvent(analytics, "page_view", {
      "page_location": window.location.href,
      "page_path": window.location.pathname,
      "page_title": document.title
    });

    const auth = getAuth(app);
    const db = getFirestore(app);
    auth.useDeviceLanguage();
    const provider = new GoogleAuthProvider();

    onAuthStateChanged(auth, (usr) => {
      firebaseUser.set(usr);
      if (usr)
        setUserId(analytics, usr.uid);
    });

    firebaseCtx.set({
      app, analytics, provider, auth, appCheck, db
    });
  }, []);

  return <></>
};

export const LoginButton: FC = () => {
  const { auth, provider, analytics } = useStore(firebaseCtx) ?? nullCtx;
  const user = useStore(firebaseUser);

  if (!auth || !provider)
    return <span className={"text-red-500"}>Firebase not Loaded</span>;

  const trySignIn = () => {
    signInWithPopup(auth, provider).then(logon => {
      if (analytics)
        logEvent(analytics, 'login', {
          "method": logon.providerId ?? "null",
          "user": logon.user.uid
        });
    }).catch(alert);
  };

  return <>
    {user ? user.displayName : <button onClick={trySignIn}>Log In</button>}
  </>
}


export interface NeedsURLId {
  url: string
}

interface CommentRecord {
  updated: Timestamp,
  content: string,
  name: string,
  pfp: string
}

export const CommentSection: FC<NeedsURLId> = ({ url }) => {
  const { auth, db } = useStore(firebaseCtx) ?? nullCtx;
  const user = useStore(firebaseUser);

  const textbox = useRef<HTMLTextAreaElement | null>(null);
  const pageId = url.replaceAll("/", '_');

  const [ posted, setPosted ] = useState(false);
  const postComment = () => {
    if (!user || !db)
      return;
    setDoc(doc(db, "pages", pageId, "comments", user.uid), {
      "updated": Timestamp.now(),
      "content": textbox.current?.value ?? "empty",
      "name": user.displayName,
      "pfp": user.photoURL,
    }).catch(alert).then(_ => {
      setPosted(true);
      setTimeout(_ => setPosted(false), 3000);
    });
  };

  const signout = () => {
    if (auth)
      signOut(auth).catch(alert);
  };

  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [myContent, setMyContent] = useState("");

  useEffect(() => {
    if (!db)
      return;
    const q = query(collection(db, "pages", pageId, "comments"), orderBy("updated"), limit(100));
    getDocs(q).then(docs => {
      let ret: CommentRecord[] = []
      docs.forEach(doc => {
        ret.push(doc.data() as unknown as CommentRecord)
      });
      setComments(ret);
    }).catch(alert);
  }, [db, posted]);

  useEffect(() => {
    if (!user || !db)
      return;
    getDoc(doc(db, "pages", pageId, "comments", user.uid)).then(doc => {
      const content = (doc.data() as unknown as CommentRecord).content;
      setMyContent(content);
      if (textbox.current)
        textbox.current.value = content;
    })
  }, [db, user, posted]);

  const dispComments = comments.map(record => <div className={"comment"} key={nextKey()}>
    <div className={"tight-flex"}>
      <img className={"pfp"} alt="pfp" src={record.pfp}/>
      <b>{record.name}</b>
      <span className={"timestamp"}>{record.updated.toDate().toLocaleString()}</span>
    </div>
    <span className={"comment-content"}>{record.content}</span>
    <hr/>
  </div>);

  if (!db || !user)
    return <>
      <h1>Log in to Comment</h1>
      <LoginButton/>
      <hr/>
      {dispComments}
    </>;
  return <div id={"comment-section"}>
    { posted ? <h3 className={"text-teal-500"}>Comment Updated</h3> : <>
      <h2>Post a Comment</h2>
      <p>
        You may only post one comment, which may be updated and edited as you wish.
      </p>

      <textarea ref={textbox} rows={5} cols={33} defaultValue={myContent}/>
      <br/>
      <div className={"tight-flex"}>
        <button onClick={postComment}>Submit</button>
        <button onClick={signout}>Log Out</button>
      </div>
      <p className={'tight-flex'}>
        <img className={"pfp"} alt="pfp" src={user.photoURL ?? ""}/>
        <span>
          Signed in as <b>{user.displayName}</b>.
        </span>
      </p>
    </> }
    <hr/>
    {dispComments}
  </div>
};
