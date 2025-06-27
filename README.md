### HypeCard – AI-Powered Video Business Cards

HypeCard is a web app that lets individuals and businesses create personalized, AI-generated video business cards in minutes.

Users simply choose their use case — personal branding or business — and fill out a short form with details like name, role, tagline, and description. They then select a male or female avatar, and HypeCard generates a talking AI video that introduces them or their brand.

Each video comes with a clean, shareable landing page (like hypecard.me/32jieo) and an option to download the video.

🎥 Create your first AI video card for free

🔁 Upgrade to Pro to generate multiple cards or unlock shareable links

🧍 Perfect for creators, freelancers, startups, and personal brands

⚡ Powered by AI video generation using Tavus

Your digital introduction — automated, professional, and ready to share.

(HypeCard Architecture)
🧍 User → Frontend
Visits /login or /signup

Enters email/password

Frontend sends it to backend for authentication

🌐 Frontend ↔ Backend
Login/Signup Handling

Backend validates login/signup using Supabase Auth

If successful, sends back a token (JWT or Supabase session)

📝 /form Route (Personal or Business Input)
User fills form with details

Frontend sends the form + token to backend

Backend Logic:

Checks token validity (is the user logged in?)

Checks if the user is Pro or not (from Supabase or RevenueCat)

If free, allow only 1 video

If Pro, allow unlimited

If allowed → Call Tavus

Sends data to Tavus API (name, tagline, etc.)

Tavus returns video URL

Store in Supabase

Backend saves user info + video URL in Supabase DB

Frontend gets video link

Renders preview or lets user download

💸 /pro and /pro/form
User visits /pro to upgrade

Frontend sends to RevenueCat

After payment, RevenueCat notifies backend via webhook or API

Backend marks user as pro

Stores this status in Supabase

Pro user can now access /pro/form

Same logic, but:

Can generate unlimited videos

Gets a shareable link like hypecard.me/abc123
