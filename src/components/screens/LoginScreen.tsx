import { useState } from 'react'
import { supabaseService } from '../../supabase/SupabaseService'

type LoginScreenProps = {
  onBack: () => void
  onSignup: () => void
  onLogin: (name: string) => void
}

export default function LoginScreen({ onBack, onSignup, onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    const normalizedEmail = email.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(normalizedEmail)) {
      setErrorMessage('Enter a valid email address.')
      return
    }
    if (!password.trim()) {
      setErrorMessage('Enter your password.')
      return
    }

    setIsSubmitting(true)
    const { data, error } = await supabaseService.signIn(normalizedEmail, password)
    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    onLogin(data.user?.user_metadata?.name ?? normalizedEmail.split('@')[0])
  }

  return (
    <section className="auth-screen" aria-labelledby="login-title">
      <button className="back-button" type="button" onClick={onBack}><span aria-hidden="true">&#8592;</span> Back to market</button>
      <div className="auth-panel">
        <span className="brand-mark auth-mark" aria-hidden="true">SM</span><p className="eyebrow">Welcome back</p><h1 id="login-title">Log in to your account</h1><p className="auth-intro">Keep your favorite market picks close at hand.</p>
        <form onSubmit={handleSubmit}>
          <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /></label>
          {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
          <button className="checkout-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Log in'}</button>
        </form>
        <p className="auth-switch">New to Stenson Market? <button type="button" onClick={onSignup}>Create an account</button></p>
      </div>
    </section>
  )
}
