import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@1.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  try {
    const { to, from, subject, html, replyTo } = await req.json()

    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      reply_to: replyTo,
    })

    return new Response(
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' } },
      { status: 200 },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' } },
      { status: 500 },
    )
  }
}) 