"use client";

import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
} from "../motion";

type ContactFormProps = {
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  messageLabel: string;
  sendLabel: string;
};

type ContactFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email";
};

function ContactFieldLine({ id, label, type = "text" }: ContactFieldProps) {
  return (
    <motion.div
      className="border-secondary/95 focus-within:border-secondary flex items-center border-b pb-3 transition-colors duration-300"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={id}
        placeholder={label}
        className="w-full bg-transparent text-base leading-[1.2] uppercase placeholder:text-white/95 focus:placeholder:text-white/70 focus:outline-none"
        autoComplete={type === "email" ? "email" : "off"}
      />
    </motion.div>
  );
}

export default function ContactForm({
  firstNameLabel,
  lastNameLabel,
  emailLabel,
  messageLabel,
  sendLabel,
}: ContactFormProps) {
  return (
    <motion.form
      className="bg-accent/90 flex w-full items-end justify-center gap-32 px-16 py-16 max-[1100px]:gap-10 max-[1100px]:px-8 max-[1100px]:py-10 max-[800px]:flex-col max-[800px]:items-stretch max-[800px]:gap-8 max-[800px]:px-6 max-[800px]:py-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-1 flex-col gap-8">
        <ContactFieldLine id="first-name" label={firstNameLabel} />
        <ContactFieldLine id="last-name" label={lastNameLabel} />
        <ContactFieldLine id="email" label={emailLabel} type="email" />
        <motion.div
          className="border-secondary/95 focus-within:border-secondary border-b pb-3 transition-colors duration-300"
          variants={fadeUp}
          transition={smoothTransition}
        >
          <label htmlFor="message" className="sr-only">
            {messageLabel}
          </label>
          <textarea
            id="message"
            name="message"
            placeholder={messageLabel}
            className="h-[140px] w-full resize-none bg-transparent text-base leading-[1.2] uppercase placeholder:text-white/95 focus:placeholder:text-white/70 focus:outline-none"
          />
        </motion.div>
      </div>
      <motion.button
        type="submit"
        className="border-secondary h-[50px] min-w-[101px] rounded-full border-2 px-9 py-4 text-base leading-[1.2] uppercase transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-accent active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-[800px]:self-end"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        {sendLabel}
      </motion.button>
    </motion.form>
  );
}
