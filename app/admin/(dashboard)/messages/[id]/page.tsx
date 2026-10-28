import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Card, PageHeader, buttonClass, formatDate } from "@/components/admin/ui";
import { prisma } from "@/lib/db";
import { deleteMessage, setMessageRead } from "../actions";

export const metadata: Metadata = { title: "Message" };

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) notFound();

  // Opening a message counts as reading it. The sidebar's unread count
  // catches up on the next navigation.
  if (!message.read) await prisma.contactMessage.update({ where: { id }, data: { read: true } });

  const reply = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || "Your message"}`)}`;

  return (
    <>
      <PageHeader title={message.subject || `Message from ${message.name}`} back={{ href: "/admin/messages", label: "Messages" }} />
      <Card>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3 text-sm">
          <span>
            <strong>{message.name}</strong> <span className="text-muted">&lt;{message.email}&gt;</span>
          </span>
          <span className="text-muted">{formatDate(message.createdAt, true)}</span>
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed">{message.message}</p>
      </Card>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href={reply} className={buttonClass.primary}>Reply by email</a>
        <form action={setMessageRead.bind(null, id, false)}>
          <button type="submit" className={buttonClass.secondary}>Mark as unread</button>
        </form>
        <form action={deleteMessage.bind(null, id)} className="ml-auto">
          <ConfirmButton message="Delete this message? This can't be undone." className={buttonClass.danger}>
            Delete
          </ConfirmButton>
        </form>
      </div>
    </>
  );
}
