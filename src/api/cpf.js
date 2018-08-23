const getInvalidos = () => {
    const arr = [];
    for(let i = 0; i < 9; i++){
        let str = "";
        for(let j = 0; j < 11; j++){
            str += i+'';
        }
        arr.push(str);
    }
    return arr;
}

module.exports = (strCPF) => {
    var Soma;
    var Resto;
    Soma = 0;
    if(!strCPF || strCPF.length != 11)
        return false;
    if(getInvalidos().indexOf(strCPF) != -1)
        return false;
     
    for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;
     
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
     
    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
     
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}