import ContactHero from "@/components/contact/ContactHero";

export default function ContactPage() {
  return (
    <main className="bg-primary text-secondary w-full ">
      <ContactHero
        backgroundImage="/images/contact/backdrop.webp"
        title={
          <>
            Get <span className="text-muted">in touch</span>
          </>
        }
        firstNameLabel="First Name"
        lastNameLabel="Last Name"
        emailLabel="Email"
        messageLabel="Message"
        sendLabel="Send"
      />
    </main>
  );
}
