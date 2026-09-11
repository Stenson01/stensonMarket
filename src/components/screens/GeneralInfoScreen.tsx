type GeneralInfoScreenProps = {
  title: string
  eyebrow: string
  description: string
  onBack: () => void
}

export default function GeneralInfoScreen({ title, eyebrow, description, onBack }: GeneralInfoScreenProps) {
  return (
    <section className="info-screen" aria-labelledby="info-title">
      <button className="back-button" type="button" onClick={onBack}><span aria-hidden="true">&#8592;</span> Back</button>
      <div className="info-panel">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="info-title">{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  )
}
