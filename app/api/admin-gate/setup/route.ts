import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signAdminToken, COOKIE_NAME } from "@/lib/admin-jwt"

const ADMIN_GATE_TOKEN = "FaltuXornexz"
const ADMIN_GATE_COOKIE = "admin_gate"

const GATE_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
}

// GET: displays setup form or handles direct query param setup
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const key = searchParams.get("key")

  if (key !== ADMIN_GATE_TOKEN) {
    return new NextResponse(null, { status: 404 })
  }

  const emailParam = searchParams.get("email")
  const passwordParam = searchParams.get("password")

  // If email and password provided in query, configure directly
  if (emailParam && passwordParam) {
    return await handleSetup(emailParam, passwordParam, req)
  }

  // Otherwise, render an interactive setup UI
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Setup | Xornexz</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #05060A; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .card { background: #0E1018; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 36px; max-width: 440px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; text-align: center; }
    p.sub { color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 28px; }
    .field { margin-bottom: 20px; }
    label { display: block; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 8px; }
    input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 12px 14px; color: #fff; font-size: 14px; outline: none; transition: border-color 0.2s; }
    input:focus { border-color: #8b5cf6; }
    button { width: 100%; background: linear-gradient(135deg, #7c3aed, #06b6d4); color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; margin-top: 8px; }
    button:hover { opacity: 0.9; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .status { margin-top: 15px; font-size: 13px; text-align: center; display: none; }
    .status.error { color: #f87171; display: block; }
    .status.success { color: #4ade80; display: block; }
    .note { margin-top: 20px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Configure Super Admin</h1>
    <p class="sub">Set up or reset your admin credentials directly</p>
    <form id="setupForm" method="POST" action="/api/admin-gate/setup">
      <input type="hidden" name="key" value="${ADMIN_GATE_TOKEN}">
      <div class="field">
        <label for="email">Admin Email</label>
        <input type="email" id="email" name="email" placeholder="admin@xornexz.com" required autocomplete="email">
      </div>
      <div class="field">
        <label for="password">New Password</label>
        <input type="password" id="password" name="password" placeholder="Choose a strong password" required autocomplete="new-password">
      </div>
      <button type="submit" id="btn">Set Admin Credentials & Log In</button>
      <div id="status" class="status"></div>
    </form>
    <p class="note">This securely writes the hashed password to your database and logs you in immediately.</p>
  </div>

  <script>
    const form = document.getElementById('setupForm');
    const btn = document.getElementById('btn');
    const status = document.getElementById('status');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btn.disabled = true;
      btn.textContent = 'Saving & Logging In...';
      status.className = 'status';
      status.style.display = 'none';

      try {
        const res = await fetch('/api/admin-gate/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: '${ADMIN_GATE_TOKEN}',
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
          })
        });

        if (res.ok) {
          status.className = 'status success';
          status.innerHTML = 'Success! Credentials saved.<br><a href="/admin/dashboard" style="display:inline-block;margin-top:8px;color:#38bdf8;font-weight:600;text-decoration:underline;">Click here to enter Admin Dashboard &rarr;</a>';
          status.style.display = 'block';
          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 400);
        } else {
          const data = await res.json().catch(() => ({}));
          status.className = 'status error';
          status.textContent = data.error || 'Failed to configure admin credentials.';
          status.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Set Admin Credentials & Log In';
        }
      } catch (err) {
        status.className = 'status error';
        status.textContent = 'Network or server error. Please try again.';
        status.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Set Admin Credentials & Log In';
      }
    });
  </script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  })
}

// POST: handles form submission from setup page or API call
export async function POST(req: NextRequest) {
  let key = ""
  let email = ""
  let password = ""

  const contentType = req.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")

  if (isJson) {
    const body = await req.json().catch(() => ({}))
    key = body.key || ""
    email = body.email || ""
    password = body.password || ""
  } else {
    const formData = await req.formData().catch(() => null)
    if (formData) {
      key = String(formData.get("key") || "")
      email = String(formData.get("email") || "")
      password = String(formData.get("password") || "")
    }
  }

  if (key !== ADMIN_GATE_TOKEN) {
    return new NextResponse(null, { status: 404 })
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
  }

  return await handleSetup(email, password, req, isJson)
}

async function handleSetup(email: string, password: string, req: NextRequest, isJson = false) {
  try {
    const normalizedEmail = email.trim().toLowerCase()
    const hashedPassword = await bcrypt.hash(password, 12)

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        password: hashedPassword,
        role: "SUPER_ADMIN",
        isActive: true,
        lastLoginAt: new Date(),
      },
      create: {
        name: "Admin",
        email: normalizedEmail,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        isActive: true,
        lastLoginAt: new Date(),
      },
    })

    // Sign JWT session token
    const token = await signAdminToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // If client requested via JSON, return JSON with cookies attached
    if (isJson) {
      const res = NextResponse.json({ ok: true, redirect: "/admin/dashboard" })
      res.cookies.set(ADMIN_GATE_COOKIE, ADMIN_GATE_TOKEN, GATE_COOKIE_OPTS)
      res.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
      return res
    }

    // Standard redirect: MUST use 303 (See Other) so POST converts to GET!
    // Next.js default is 307 which causes browsers to POST to the page route, resulting in an empty white screen.
    const res = NextResponse.redirect(new URL("/admin/dashboard", req.url), 303)
    res.cookies.set(ADMIN_GATE_COOKIE, ADMIN_GATE_TOKEN, GATE_COOKIE_OPTS)
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return res
  } catch (error) {
    console.error("[admin-setup] Error creating admin:", error)
    return NextResponse.json({ error: "Failed to configure database record" }, { status: 500 })
  }
}
