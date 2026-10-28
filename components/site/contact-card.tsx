import { telHref, type Settings } from '@/lib/content/settings';

/** Address, phones and emails from Site settings, for the Contact and Book sidebars. */
export function ContactDetails({ settings, showAddress = true }: { settings: Settings; showAddress?: boolean }) {
  const phones = [settings.phonePrimary, settings.phoneSecondary].filter(Boolean);
  const emails = [settings.emailPrimary, settings.emailSecondary].filter(Boolean);

  return (
    <>
      {showAddress && settings.address && (
        <>
          <p className="mb-0 font-weight-bold">Address</p>
          <p className="mb-4">{settings.address}</p>
        </>
      )}
      {phones.length > 0 && (
        <>
          <p className="mb-0 font-weight-bold">Phone</p>
          <p className="mb-4">
            {phones.map((phone, i) => (
              <span key={phone}>
                {i > 0 && <br />}
                <a href={telHref(phone)}>{phone}</a>
              </span>
            ))}
          </p>
        </>
      )}
      {emails.length > 0 && (
        <>
          <p className="mb-0 font-weight-bold">Email Address</p>
          <p className="mb-0">
            {emails.map((email, i) => (
              <span key={email}>
                {i > 0 && <br />}
                <a href={`mailto:${email}`}>{email}</a>
              </span>
            ))}
          </p>
        </>
      )}
    </>
  );
}
