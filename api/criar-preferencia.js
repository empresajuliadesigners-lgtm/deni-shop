// api/criar-preferencia.js
//
// Na Vercel, todo arquivo dentro da pasta "api/" vira automaticamente uma
// rota. Este arquivo responde em: https://SEU-PROJETO.vercel.app/api/criar-preferencia
//
// A ACCESS TOKEN fica só aqui, lida da variável de ambiente MP_ACCESS_TOKEN
// que você configura no painel da Vercel — nunca escrita neste arquivo.

const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ erro: 'Método não permitido.' });
    return;
  }
  if (!process.env.MP_ACCESS_TOKEN) {
    res.status(500).json({ erro: 'MP_ACCESS_TOKEN não configurada no projeto da Vercel.' });
    return;
  }

  try {
    const { itens, pedidoId } = req.body;

    if (!Array.isArray(itens) || itens.length === 0) {
      res.status(400).json({ erro: 'Nenhum item enviado.' });
      return;
    }

    const items = itens.map((item) => ({
      title: item.nome,
      quantity: Number(item.qty) || 1,
      unit_price: Number(item.preco) || 0,
      currency_id: 'BRL'
    }));

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items,
        external_reference: pedidoId,
        back_urls: {
          success: `https://${req.headers.host}/#carrinho`,
          failure: `https://${req.headers.host}/#carrinho`,
          pending: `https://${req.headers.host}/#carrinho`
        },
        auto_return: 'approved'
      }
    });

    res.status(200).json({ init_point: result.init_point, preference_id: result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Não foi possível criar a preferência de pagamento.' });
  }
};
