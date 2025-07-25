// statistics.js
// ランダム数列の統計計算：平均値、中央値、分散、標準偏差

console.log('=== 統計計算プログラム ===\n');

// ランダムな数字配列を生成（0-100の範囲）
function generateRandomArray(size = 100, min = 0, max = 100) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return array;
}

// 平均値を計算
function calculateMean(array) {
  const sum = array.reduce((acc, num) => acc + num, 0);
  return sum / array.length;
}

// 中央値を計算
function calculateMedian(array) {
  const sorted = [...array].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    // 配列長が偶数の場合、中央2つの平均
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    // 配列長が奇数の場合、中央の値
    return sorted[middle];
  }
}

// 分散を計算
function calculateVariance(array) {
  const mean = calculateMean(array);
  const squaredDiffs = array.map(num => Math.pow(num - mean, 2));
  return calculateMean(squaredDiffs);
}

// 標準偏差を計算
function calculateStandardDeviation(array) {
  return Math.sqrt(calculateVariance(array));
}

// 最大値・最小値・範囲を計算
function calculateRange(array) {
  const min = Math.min(...array);
  const max = Math.max(...array);
  return { min, max, range: max - min };
}

// メイン処理
const numbers = generateRandomArray(100, 0, 100);

console.log('生成されたランダム数列の一部（最初の20個）:');
console.log(numbers.slice(0, 20).join(', ') + '...\n');

// 統計計算
const mean = calculateMean(numbers);
const median = calculateMedian(numbers);
const variance = calculateVariance(numbers);
const standardDeviation = calculateStandardDeviation(numbers);
const { min, max, range } = calculateRange(numbers);

// 結果表示
console.log('=== 統計結果 ===');
console.log(`データ数: ${numbers.length}個`);
console.log(`最小値: ${min}`);
console.log(`最大値: ${max}`);
console.log(`範囲: ${range}`);
console.log(`平均値: ${mean.toFixed(2)}`);
console.log(`中央値: ${median}`);
console.log(`分散: ${variance.toFixed(2)}`);
console.log(`標準偏差: ${standardDeviation.toFixed(2)}`);

// ヒストグラム的な分布表示（10区間）
console.log('\n=== 分布 (10区間) ===');
const bins = 10;
const binSize = (max - min) / bins;
const histogram = new Array(bins).fill(0);

numbers.forEach(num => {
  const binIndex = Math.min(Math.floor((num - min) / binSize), bins - 1);
  histogram[binIndex]++;
});

histogram.forEach((count, index) => {
  const rangeStart = (min + index * binSize).toFixed(1);
  const rangeEnd = (min + (index + 1) * binSize).toFixed(1);
  const bar = '█'.repeat(Math.round(count / 2)); // 視覚的なバー
  console.log(`${rangeStart}-${rangeEnd}: ${count}個 ${bar}`);
});

console.log('\n=== 計算完了 ===');