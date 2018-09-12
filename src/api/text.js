const spaceRegex = /\s{2,}/g;

const capitalizeText = (title = "") => {
    title = title.trim();
    title = title.replace(spaceRegex, ' ');
    let titleArr = title.split(' ');
    let words = [];
    for(let section of titleArr){
        if(section.length <= 2 && section.length > 0){
            section = section[0].toLowerCase().concat(section.substring(1));
        }
        else if(section.length > 0){
            section = section[0].toUpperCase().concat(section.substring(1));
        }
        words.push(section);
    }
    return words.join(' ');
}

module.exports = {
    capitalizeText
}