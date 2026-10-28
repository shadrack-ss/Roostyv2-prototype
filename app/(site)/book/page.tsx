import type { Metadata } from 'next';
import { PageHero } from '@/components/site/blocks';
import { ContactDetails } from '@/components/site/contact-card';
import { getRooms, getSection, getSettings } from '@/lib/content/queries';
import { toRoomCard } from '../rooms/rooms-data';
import BookingForm from './booking-form';

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getSection('book.hero')).title };
}

export default async function Book({ searchParams }: { searchParams: Promise<{ room?: string }> }) {
  const [{ room }, hero, form, sidebar, settings, rooms] = await Promise.all([
    searchParams,
    getSection('book.hero'),
    getSection('book.form'),
    getSection('book.sidebar'),
    getSettings(),
    getRooms(),
  ]);

  return (
    <>
      <PageHero data={hero} />

      <div className="site-section site-section-sm">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-8 mb-5">
              {rooms.length === 0 ? (
                <div className="p-5 bg-white">
                  <p className="mb-0">Online booking is not available right now. Please call or email us to reserve a room.</p>
                </div>
              ) : (
                <BookingForm
                  rooms={rooms.map(toRoomCard)}
                  initialRoomSlug={room}
                  copy={form}
                />
              )}
            </div>

            <div className="col-lg-4">
              <div className="p-4 mb-3 bg-white">
                <h3 className="h5 text-black mb-3">{sidebar.title}</h3>
                {sidebar.text && <p className="mb-4">{sidebar.text}</p>}
                <ContactDetails settings={settings} showAddress={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
