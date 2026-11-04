/* Página estática de retorno do OAuth (Stox Central, Etapa 0). Só exibe o que chegou na URL para o operador copiar. NÃO faz nenhuma requisição, não guarda nada e não carrega nada de terceiros. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function mostrar(id) { ['sec-ok', 'sec-erro', 'sec-vazio'].forEach(function (s) { $(s).hidden = s !== id; }); }
  var p = new URLSearchParams(window.location.search || '');
  var code = p.get('code'), state = p.get('state'), erro = p.get('error');
  var textoCopia = '';
  if (erro) {
    $('msg-erro').textContent = 'O Mercado Livre informou: ' + String(erro).slice(0, 60);
    mostrar('sec-erro');
  } else if (code && state) {
    if (code.length > 200 || state.length > 100 || !/^[A-Za-z0-9_-]+$/.test(code) || !/^[A-Za-z0-9_-]+$/.test(state)) {
      $('msg-erro').textContent = 'O retorno veio em um formato inesperado e foi recusado.';
      mostrar('sec-erro');
    } else {
      textoCopia = 'code=' + code + '&state=' + state;
      $('texto').textContent = textoCopia;
      mostrar('sec-ok');
    }
  } else {
    mostrar('sec-vazio');
  }
  try { window.history.replaceState(null, '', window.location.pathname); } catch (e) { /* sem histórico: ignora */ }   // tira o código da barra de endereço
  $('copiar').addEventListener('click', function () {
    function ok() { $('copiado').hidden = false; }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(textoCopia).then(ok, function () { selecionar(); }); } else { selecionar(); }
    function selecionar() { var r = document.createRange(); r.selectNodeContents($('texto')); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
  });
})();
