import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from "resend";

initializeApp();

const resendApiKey = defineSecret("RESEND_API_KEY");

// Called manually by authorised admin users only
export const sendEmail = onCall(
  { secrets: [resendApiKey], maxInstances: 10 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in.");
    }

    const uid = request.auth.uid;
    const db = getFirestore();
    const permDoc = await db.collection("userPermissions").doc(uid).get();

    if (!permDoc.exists || permDoc.data()?.canSendEmail !== true) {
      throw new HttpsError("permission-denied", "Not authorised to send emails.");
    }

    const { to, subject, html } = request.data as {
      to: string;
      subject: string;
      html: string;
    };

    if (!to || !subject || !html) {
      throw new HttpsError("invalid-argument", "Missing to, subject, or html.");
    }

    const resend = new Resend(resendApiKey.value());
    const { error } = await resend.emails.send({
      from: "Icecup <noreply@icecupakureyri.com>",
      to,
      subject,
      html,
    });

    if (error) throw new HttpsError("internal", error.message);
    return { success: true };
  }
);

// Fires automatically when the apply form submits — no auth needed
export const onApplicationSubmitted = onDocumentCreated(
  { document: "applicationSubmissions/{docId}", secrets: [resendApiKey], maxInstances: 10 },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const { responsibleEmail, responsibleName, teamName, competitionName, token, pin } = data as {
      responsibleEmail: string;
      responsibleName: string;
      teamName: string;
      competitionName: string;
      token: string;
      pin: string;
    };

    if (!responsibleEmail) return;

    const appUrl = `https://icecupakureyri.com/application/${token}`;

    const resend = new Resend(resendApiKey.value());
    await resend.emails.send({
      from: "Icecup <noreply@icecupakureyri.com>",
      to: responsibleEmail,
      subject: `Application received — ${competitionName}`,
      html: `
        <h2>Thanks for applying, ${responsibleName}!</h2>
        <p>We've received your application for <strong>${teamName}</strong> to compete in <strong>${competitionName}</strong>.</p>
        <p>You can view or edit your application at any time using the link below:</p>
        <p><a href="${appUrl}">${appUrl}</a></p>
        <p><strong>Your PIN: ${pin}</strong></p>
        <p>Keep this email safe — you'll need the PIN to access your application.</p>
        <br/>
        <p>We'll be in touch once your application has been reviewed.</p>
        <p>— The Icecup Team</p>
      `,
    });

    // Clean up the trigger document
    await event.data?.ref.delete();
  }
);
