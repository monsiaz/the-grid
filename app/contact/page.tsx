import ContactHeroFrame from "@/components/contact/ContactHeroFrame";

export default function ContactPage() {
  return (
    <main className="bg-primary text-secondary w-full overflow-x-hidden">
      <ContactHeroFrame
        backgroundImage="/images/contact/frame-3.png"
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
