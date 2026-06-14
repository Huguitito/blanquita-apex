export default async function handler(req, res) {
  // Solo permitimos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const response = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: process.env.RETELL_AGENT_ID,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error de Retell: ${response.status}`);
    }

    const data = await response.json();
    // Le devolvemos el token a la web
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
