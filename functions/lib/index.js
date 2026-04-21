"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onApplicationSubmitted = exports.sendEmail = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const params_1 = require("firebase-functions/params");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
const resend_1 = require("resend");
(0, app_1.initializeApp)();
const resendApiKey = (0, params_1.defineSecret)("RESEND_API_KEY");
// Called manually by authorised admin users only
exports.sendEmail = (0, https_1.onCall)({ secrets: [resendApiKey], maxInstances: 10 }, async (request) => {
    var _a;
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Must be logged in.");
    }
    const uid = request.auth.uid;
    const db = (0, firestore_2.getFirestore)();
    const permDoc = await db.collection("userPermissions").doc(uid).get();
    if (!permDoc.exists || ((_a = permDoc.data()) === null || _a === void 0 ? void 0 : _a.canSendEmail) !== true) {
        throw new https_1.HttpsError("permission-denied", "Not authorised to send emails.");
    }
    const { to, subject, html } = request.data;
    if (!to || !subject || !html) {
        throw new https_1.HttpsError("invalid-argument", "Missing to, subject, or html.");
    }
    const resend = new resend_1.Resend(resendApiKey.value());
    const { error } = await resend.emails.send({
        from: "Icecup <noreply@icecupakureyri.com>",
        to,
        subject,
        html,
    });
    if (error)
        throw new https_1.HttpsError("internal", error.message);
    return { success: true };
});
// Fires automatically when the apply form submits — no auth needed
exports.onApplicationSubmitted = (0, firestore_1.onDocumentCreated)({ document: "applicationSubmissions/{docId}", secrets: [resendApiKey], maxInstances: 10 }, async (event) => {
    var _a, _b;
    const data = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    if (!data)
        return;
    const { responsibleEmail, responsibleName, teamName, competitionName, token, pin } = data;
    if (!responsibleEmail)
        return;
    const appUrl = `https://icecupakureyri.com/application/${token}`;
    const resend = new resend_1.Resend(resendApiKey.value());
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
    await ((_b = event.data) === null || _b === void 0 ? void 0 : _b.ref.delete());
});
//# sourceMappingURL=index.js.map