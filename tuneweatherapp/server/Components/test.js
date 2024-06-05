


let arr = ['23562482458245', '4569245274562458', '2582452jg4uoj2457', '245710909846']



let mystring = (`oijeroig&iuehrgoij?seed_tracks=${arr.map((trackId, index) => {return index !== arr.length-1 ? `${trackId}%2C+` : trackId})}`).replaceAll(',', '')

console.log(mystring)