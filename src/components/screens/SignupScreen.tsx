import { useState } from 'react'
import { supabaseService } from '../../supabase/SupabaseService'

type SignupScreenProps = {
  onBack: () => void
  onLogin: () => void
  onSignup: (name: string) => void
}

export default function SignupScreen({ onBack, onLogin, onSignup }: SignupScreenProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    const normalizedName = name.trim()
    const normalizedEmail = email.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

    if (!normalizedName) {
      setErrorMessage('Enter your full name.')
      return
    }
    if (!emailPattern.test(normalizedEmail)) {
      setErrorMessage('Enter a valid email address.')
      return
    }
    if (!strongPasswordPattern.test(password)) {
      setErrorMessage('Password must be 8+ characters with uppercase, lowercase, number, and symbol.')
      return
    }

    setIsSubmitting(true)
    const { data, error } = await supabaseService.signUp(normalizedEmail, password, { name: normalizedName })
    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    onSignup(data.user?.user_metadata?.name ?? normalizedName)
  }

  return (
    <section className="auth-screen" aria-labelledby="signup-title">
      <button className="back-button" type="button" onClick={onBack}><span aria-hidden="true">&#8592;</span> Back to market</button>
      <div className="auth-panel">
        <span className="brand-mark auth-mark" aria-hidden="true">SM</span><p className="eyebrow">Join the market</p><h1 id="signup-title">Create your account</h1><p className="auth-intro">Save your favorites and make every shop feel easy.</p>
        <form onSubmit={handleSubmit}>
          <label>Full name<input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required /></label>
          <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" minLength={8} required /></label>
          {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
          <button className="checkout-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <button type="button" onClick={onLogin}>Log in</button></p>
      </div>
    </section>
  )
}
