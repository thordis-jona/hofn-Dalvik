import { Field, Form, type FormStore, type SubmitHandler, useForm } from '@formisch/react';
import { getLocalTimeZone, today } from '@internationalized/date';
import { useMemo, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import * as v from 'valibot';

function todayIso() {
  return today(getLocalTimeZone()).toString();
}

export interface InquiryFormMessages {
  validation: {
    name: {
      required: string;
      minLength: string;
      maxLength: string;
    };
    email: {
      required: string;
      invalid: string;
      maxLength: string;
    };
    checkin: {
      invalid: string;
      past: string;
    };
    checkout: {
      invalid: string;
    };
    guests: {
      range: string;
    };
    phone: {
      maxLength: string;
    };
    message: {
      maxLength: string;
    };
    dates: {
      checkinRequired: string;
      checkoutRequired: string;
      checkoutAfterCheckin: string;
    };
  };
  fields: {
    name: { label: string };
    email: { label: string };
    checkin: { label: string };
    checkout: { label: string };
    guests: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
  };
  submit: {
    idle: string;
    submitting: string;
  };
  note: string;
  email: {
    subject: string;
    labels: {
      name: string;
      email: string;
      phone: string;
      checkin: string;
      checkout: string;
      guests: string;
      message: string;
    };
  };
}

export interface InquiryFormProps {
  locale: 'is-IS' | 'en-GB';
  messages: InquiryFormMessages;
}

function createInquirySchema(messages: InquiryFormMessages['validation']) {
  return v.pipe(
    v.object({
      name: v.pipe(
        v.string(),
        v.trim(),
        v.nonEmpty(messages.name.required),
        v.minLength(2, messages.name.minLength),
        v.maxLength(80, messages.name.maxLength),
      ),
      email: v.pipe(
        v.string(),
        v.trim(),
        v.nonEmpty(messages.email.required),
        v.email(messages.email.invalid),
        v.maxLength(254, messages.email.maxLength),
      ),
      checkin: v.pipe(
        v.string(),
        v.check((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), messages.checkin.invalid),
        v.check((value) => value === '' || value >= todayIso(), messages.checkin.past),
      ),
      checkout: v.pipe(
        v.string(),
        v.check((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), messages.checkout.invalid),
      ),
      guests: v.pipe(
        v.string(),
        v.check((value) => value === '' || /^[1-8]$/.test(value), messages.guests.range),
      ),
      phone: v.pipe(v.string(), v.trim(), v.maxLength(40, messages.phone.maxLength)),
      message: v.pipe(v.string(), v.trim(), v.maxLength(2000, messages.message.maxLength)),
    }),
    v.forward(
      v.partialCheck(
        [['checkin'], ['checkout']],
        ({ checkin, checkout }) => checkout === '' || checkin !== '',
        messages.dates.checkinRequired,
      ),
      ['checkin'],
    ),
    v.forward(
      v.partialCheck(
        [['checkin'], ['checkout']],
        ({ checkin, checkout }) => checkin === '' || checkout !== '',
        messages.dates.checkoutRequired,
      ),
      ['checkout'],
    ),
    v.forward(
      v.partialCheck(
        [['checkin'], ['checkout']],
        ({ checkin, checkout }) => checkin === '' || checkout === '' || checkout > checkin,
        messages.dates.checkoutAfterCheckin,
      ),
      ['checkout'],
    ),
  );
}

type InquirySchema = ReturnType<typeof createInquirySchema>;

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
  form: FormStore<InquirySchema>;
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
  form: FormStore<InquirySchema>;
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

export default function InquiryForm({ locale, messages }: InquiryFormProps) {
  const schema = useMemo(() => createInquirySchema(messages.validation), [messages.validation]);
  const inquiryForm = useForm({
    schema,
    validate: 'blur',
    revalidate: 'input',
  });
  const minDate = todayIso();

  const submitInquiry: SubmitHandler<InquirySchema> = (values) => {
    const subject = encodeURIComponent(messages.email.subject);
    const labels = messages.email.labels;
    const body = encodeURIComponent(
      `${labels.name}: ${values.name}\n${labels.email}: ${values.email}\n${labels.phone}: ${values.phone}\n${labels.checkin}: ${values.checkin}\n${labels.checkout}: ${values.checkout}\n${labels.guests}: ${values.guests}\n\n${labels.message}:\n${values.message}`,
    );
    window.location.href = `mailto:thordis@manifesto.is?subject=${subject}&body=${body}`;
  };

  return (
    <Form className="request-form" id="requestForm" of={inquiryForm} onSubmit={submitInquiry}>
      <div className="form-row">
        <InputField autoComplete="name" form={inquiryForm} id="name" label={messages.fields.name.label} path={['name']} required type="text" />
        <InputField autoComplete="email" form={inquiryForm} id="email" inputMode="email" label={messages.fields.email.label} path={['email']} required type="email" />
      </div>

      <div className="form-row">
        <InputField form={inquiryForm} id="checkin" label={messages.fields.checkin.label} lang={locale} min={minDate} path={['checkin']} suppressHydrationWarning type="date" />
        <InputField form={inquiryForm} id="checkout" label={messages.fields.checkout.label} lang={locale} min={minDate} path={['checkout']} suppressHydrationWarning type="date" />
      </div>

      <div className="form-row">
        <InputField form={inquiryForm} id="guests" inputMode="numeric" label={messages.fields.guests.label} max="8" min="1" path={['guests']} placeholder={messages.fields.guests.placeholder} type="number" />
        <InputField autoComplete="tel" form={inquiryForm} id="phone" inputMode="tel" label={messages.fields.phone.label} path={['phone']} placeholder={messages.fields.phone.placeholder} type="tel" />
      </div>

      <div className="form-row full">
        <TextareaField form={inquiryForm} id="message" label={messages.fields.message.label} maxLength={2000} path={['message']} placeholder={messages.fields.message.placeholder} />
      </div>

      <button className="btn" disabled={inquiryForm.isSubmitting} type="submit">
        {inquiryForm.isSubmitting ? messages.submit.submitting : messages.submit.idle}
      </button>
      <div className="form-note">{messages.note}</div>
    </Form>
  );
}
