import db, { auth, provider } from "lib/firebase";

export default function LogIn({ setNewUser, setUser }) {
  
  async function signIn() {
    const data = await auth.signInWithPopup(provider)
    if(data) {
      await checkUsername(data.user.uid)
      setUser(data.user)
    }
  }

  // Could do a checkUserEmail and 
  // have preloaded emails with no signUp option 
  // to keep it locked down to allowed users

  async function checkUsername(uid) {
    const usernameRef = db.collection("usernames").where("uid", "==", uid)
    const querySnapshot = await usernameRef.get()
    setNewUser(querySnapshot.empty)
  }


  return (
    <div className="login-container">
      <header className="login-header"></header>
      <div className="login-wrapper">
        <div className="login-options-container">
          <div className="login-title-container">
            <h1 className="login-title">Sign up for Tiktok</h1>
          </div>
          <div className="login-options">
            <LoginOption src="/email.png" text="Use phone or email" />
            <LoginOption src="/facebook.png" text="Continue with Facebook" />
            <LoginOption src="/google.png" text="Continue with Google" onClick={signIn} />
            <LoginOption src="/twitter.png" text="Continue with Twitter" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginOption({ text, src, onClick }) {
  return (
    <div className="login-option-wrapper" onClick={onClick}>
      <div className="login-option-icon-wrapper">
        <img src={src} alt={text} className="login-option-icon" />
      </div>
      <h3 className="login-option-text">{text}</h3>
    </div>
  );
}
