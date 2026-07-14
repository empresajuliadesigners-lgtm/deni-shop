// api/webhook.js
//
// Configure esta URL (https://SEU-PROJETO.vercel.app/api/webhook) no painel
// de notificações do Mercado Pago para saber quando um pagamento muda de
// status (aprovado, rejeitado, etc).

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  console.log('Notificação recebida do Mercado Pago:', req.body);
  // Aqui você pode consultar o pagamento pela API do Mercado Pago usando o
  // ID recebido e atualizar o status do pedido onde você guardar seus dados.
  res.status(200).send('ok');
};
