var Validadores = {
  cpf: function(cpf) {
    var digits = (cpf || '').replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;

    var sum = 0;
    for (var i = 0; i < 9; i++) {
      sum += parseInt(digits.charAt(i)) * (10 - i);
    }
    var rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(digits.charAt(9))) return false;

    sum = 0;
    for (var i = 0; i < 10; i++) {
      sum += parseInt(digits.charAt(i)) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    return rev === parseInt(digits.charAt(10));
  },

  cnpj: function(cnpj) {
    var digits = (cnpj || '').replace(/\D/g, '');
    if (digits.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(digits)) return false;

    var weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    var weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    var sum = 0;
    for (var i = 0; i < 12; i++) {
      sum += parseInt(digits.charAt(i)) * weights1[i];
    }
    var mod = sum % 11;
    var dig1 = mod < 2 ? 0 : 11 - mod;
    if (parseInt(digits.charAt(12)) !== dig1) return false;

    sum = 0;
    for (var i = 0; i < 13; i++) {
      sum += parseInt(digits.charAt(i)) * weights2[i];
    }
    mod = sum % 11;
    var dig2 = mod < 2 ? 0 : 11 - mod;
    return parseInt(digits.charAt(13)) === dig2;
  },

  email: function(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  required: function(value) {
    return value !== null && value !== undefined && value.trim() !== '';
  }
};