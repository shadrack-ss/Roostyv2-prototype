import type { Metadata } from 'next';
import { PageHero } from '@/components/site/blocks';
import { ContactDetails } from '@/components/site/contact-card';
import { getSection, getSettings } from '@/lib/content/queries';
import ContactForm from './contact-form';

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getSection('contact.hero')).title };
}

export default async function Contact() {
  const [hero, form, settings] = await Promise.all([getSection('contact.hero'), getSection('contact.form'), getSettings()]);

  return (
    <>
      <PageHero data={hero} />

      <div className="site-section site-section-sm">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-8 mb-5">
              <ContactForm buttonLabel={form.buttonLabel} successTitle={form.successTitle} successText={form.successText} />
            </div>

            <div className="col-lg-4">
              <div className="p-4 mb-3 bg-white">
                <h3 className="h5 text-black mb-3">{form.infoHeading}</h3>
                <ContactDetails settings={settings} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
