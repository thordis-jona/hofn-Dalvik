import { Field, Form, type FormStore, type SubmitHandler, useForm } from '@formisch/react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import * as v from 'valibot';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const InquirySchema = v.pipe(
  v.object({
    name: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('Skrifaðu nafnið þitt.'),
      v.minLength(2, 'Nafnið þarf að vera að minnsta kosti 2 stafir.'),
      v.maxLength(80, 'Nafnið má vera mest 80 stafir.'),
    ),
    email: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('Sláðu inn netfang.'),
      v.email('Netfangið virðist ekki vera gilt.'),
      v.maxLength(254, 'Netfangið er of langt.'),
    ),
    checkin: v.pipe(
      v.string(),
      v.check((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Komudagurinn er ekki gild dagsetning.'),
      v.check((value) => value === '' || value >= todayIso(), 'Komudagur getur ekki verið liðinn.'),
    ),
    checkout: v.pipe(
      v.string(),
      v.check((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Brottfarardagurinn er ekki gild dagsetning.'),
    ),
    guests: v.pipe(
      v.string(),
      v.check((value) => value === '' || /^[1-8]$/.test(value), 'Veldu 1–8 gesti.'),
    ),
    phone: v.pipe(v.string(), v.trim(), v.maxLength(40, 'Símanúmerið er of langt.')),
    message: v.pipe(v.string(), v.trim(), v.maxLength(2000, 'Skilaboðin mega vera mest 2000 stafir.')),
  }),
  v.forward(
    v.partialCheck(
      [['checkin'], ['checkout']],
      ({ checkin, checkout }) => checkout === '' || checkin !== '',
      'Veldu komudag áður en þú velur brottfarardag.',
    ),
    ['checkin'],
  ),
  v.forward(
    v.partialCheck(
      [['checkin'], ['checkout']],
      ({ checkin, checkout }) => checkin === '' || checkout !== '',
      'Veldu brottfarardag.',
    ),
    ['checkout'],
  ),
  v.forward(
    v.partialCheck(
      [['checkin'], ['checkout']],
      ({ checkin, checkout }) => checkin === '' || checkout === '' || checkout > checkin,
      'Brottfarardagur þarf að vera eftir komudag.',
    ),
    ['checkout'],
  ),
);

type FieldErrorProps = {
  id: string;
  error: string | null;
};

function FieldError({ id, error }: FieldErrorProps) {
  if (!error) return null;
  return <p className="form-error" id={id} role="alert">{error}</p>;
}

type InquiryFieldPath =
  | readonly ['name']
  | readonly ['email']
  | readonly ['checkin']
  | readonly ['checkout']
  | readonly ['guests']
  | readonly ['phone']
  | readonly ['message'];

type InputFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'aria-describedby' | 'aria-invalid' | 'form' | 'id' | 'name' | 'onBlur' | 'onChange' | 'onFocus'
> & {
  form: FormStore<typeof InquirySchema>;
  id: string;
  label: string;
  path: InquiryFieldPath;
};

function InputField({ form, id, label, path, required, ...inputProps }: InputFieldProps) {
  return (
    <Field of={form} path={path}>
      {(field) => {
        const error = field.errors && (field.isEdited || form.isSubmitted) ? field.errors[0] : null;
        const errorId = `${id}-error`;
        return (
          <div className="form-field">
            <label htmlFor={id}>{label} {required && <span aria-hidden="true">*</span>}</label>
            <input
              {...field.props}
              {...inputProps}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={Boolean(error)}
              id={id}
              required={required}
            />
            <FieldError id={errorId} error={error} />
          </div>
        );
      }}
    </Field>
  );
}

type TextareaFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'aria-describedby' | 'aria-invalid' | 'form' | 'id' | 'name' | 'onBlur' | 'onChange' | 'onFocus'
> & {
  form: FormStore<typeof InquirySchema>;
  id: string;
  label: string;
  path: readonly ['message'];
};

function TextareaField({ form, id, label, path, ...textareaProps }: TextareaFieldProps) {
  return (
    <Field of={form} path={path}>
      {(field) => {
        const error = field.errors && (field.isEdited || form.isSubmitted) ? field.errors[0] : null;
        const errorId = `${id}-error`;
        return (
          <div className="form-field">
            <label htmlFor={id}>{label}</label>
            <textarea
              {...field.props}
              {...textareaProps}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={Boolean(error)}
              id={id}
            ></textarea>
            <FieldError id={errorId} error={error} />
          </div>
        );
      }}
    </Field>
  );
}

export default function InquiryForm() {
  const inquiryForm = useForm({
    schema: InquirySchema,
    validate: 'blur',
    revalidate: 'input',
  });
  const minDate = todayIso();

  const submitInquiry: SubmitHandler<typeof InquirySchema> = (values) => {
    const subject = encodeURIComponent('Fyrirspurn um bókun - Höfn, Karlsrauðatorg 4');
    const body = encodeURIComponent(
      `Nafn: ${values.name}\nNetfang: ${values.email}\nSími: ${values.phone}\nKomudagur: ${values.checkin}\nBrottfarardagur: ${values.checkout}\nFjöldi gesta: ${values.guests}\n\nSkilaboð:\n${values.message}`,
    );
    window.location.href = `mailto:thordis@manifesto.is?subject=${subject}&body=${body}`;
  };

  return (
    <Form className="request-form" id="requestForm" of={inquiryForm} onSubmit={submitInquiry}>
      <div className="form-row">
        <InputField autoComplete="name" form={inquiryForm} id="name" label="Nafn" path={['name']} required type="text" />
        <InputField autoComplete="email" form={inquiryForm} id="email" inputMode="email" label="Netfang" path={['email']} required type="email" />
      </div>

      <div className="form-row">
        <InputField form={inquiryForm} id="checkin" label="Komudagur" min={minDate} path={['checkin']} suppressHydrationWarning type="date" />
        <InputField form={inquiryForm} id="checkout" label="Brottfarardagur" min={minDate} path={['checkout']} suppressHydrationWarning type="date" />
      </div>

      <div className="form-row">
        <InputField form={inquiryForm} id="guests" inputMode="numeric" label="Fjöldi gesta" max="8" min="1" path={['guests']} placeholder="t.d. 6" type="number" />
        <InputField autoComplete="tel" form={inquiryForm} id="phone" inputMode="tel" label="Símanúmer" path={['phone']} placeholder="t.d. 555 5555" type="tel" />
      </div>

      <div className="form-row full">
        <TextareaField form={inquiryForm} id="message" label="Skilaboð" maxLength={2000} path={['message']} placeholder="Segðu okkur aðeins frá ferðinni þinni..." />
      </div>

      <button className="btn" disabled={inquiryForm.isSubmitting} type="submit">
        {inquiryForm.isSubmitting ? 'Staðfesti upplýsingar…' : 'Senda fyrirspurn'}
      </button>
      <div className="form-note">Fyrirspurnin opnast sem tölvupóstur til thordis@manifesto.is</div>
    </Form>
  );
}
