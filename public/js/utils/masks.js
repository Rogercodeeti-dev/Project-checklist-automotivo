var Mascaras = {
  cpf: function(v) {
    v = v.replace(/\D/g, '').substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
  },

  cnpj: function(v) {
    v = v.replace(/\D/g, '').substring(0, 14);
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
    return v;
  },

  phone: function(v) {
    v = v.replace(/\D/g, '').substring(0, 11);
    if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d*)/, '($1) $2');
    } else if (v.length > 0) {
      v = v.replace(/^(\d*)/, '($1');
    }
    return v;
  },

  cep: function(v) {
    v = v.replace(/\D/g, '').substring(0, 8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    return v;
  },

  placa: function(v) {
    v = v.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 7);
    v = v.replace(/^([A-Z]{3})(\d)/, '$1-$2');
    return v;
  },

  aplicar: function(selector, mascara) {
    $(selector).on('input', function() {
      $(this).val(mascara($(this).val()));
    });
  }
};