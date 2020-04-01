str = 'SELECT COUNT(*) FROM individuals WHERE individuals.is_genotyped = true';
arr = str.split("WHERE");
console.log(arr);