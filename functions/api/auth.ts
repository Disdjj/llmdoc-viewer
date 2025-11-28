interface Env {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}

interface RequestBody {
  code: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  try {
    const body = await request.json() as RequestBody
    const { code } = body

    if (!code) {
      return Response.json({ error: "Missing code parameter" }, { status: 400 })
    }

    // Exchange code for access token
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const data = await response.json() as { access_token?: string; error?: string; error_description?: string }

    if (data.error) {
      return Response.json(
        { error: data.error_description || data.error },
        { status: 400 }
      )
    }

    if (!data.access_token) {
      return Response.json({ error: "No access token received" }, { status: 400 })
    }

    return Response.json({ token: data.access_token })
  } catch (error) {
    console.error("Auth error:", error)
    return Response.json({ error: "Token exchange failed" }, { status: 500 })
  }
}
