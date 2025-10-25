console.log('=== FizzBuzz (1〜100) ===\n');

function fizzbuzz(max = 100) {
  const results = [];
  
  for (let i = 1; i <= max; i++) {
    let output = '';
    
    if (i % 3 === 0) output += 'Fizz';
    if (i % 5 === 0) output += 'Buzz';
    
    // 何も該当しない場合は数字そのまま
    if (output === '') output = i.toString();
    
    results.push(output);
    
    // 10個ずつ改行して見やすく表示
    if (i % 10 === 0) {
      console.log(results.slice(-10).join(', '));
    }
  }
  
  return results;
}

// 実行
const results = fizzbuzz(100);

console.log(`\n完了！合計 ${results.length} 個の要素を処理しました。`);

// 統計を表示
const fizzCount = results.filter(r => r.includes('Fizz') && !r.includes('Buzz')).length;
const buzzCount = results.filter(r => r.includes('Buzz') && !r.includes('Fizz')).length;
const fizzbuzzCount = results.filter(r => r === 'FizzBuzz').length;
const numberCount = results.filter(r => !isNaN(r)).length;

console.log('\n=== 統計 ===');
console.log(`Fizz: ${fizzCount}個`);
console.log(`Buzz: ${buzzCount}個`);
console.log(`FizzBuzz: ${fizzbuzzCount}個`);
console.log(`数字: ${numberCount}個`);