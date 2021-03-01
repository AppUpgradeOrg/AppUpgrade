export const sum = (a: number, b: number) => a + b;

test('1 + 2 = 3', () => {
  const result = sum(1, 2);
  expect(result).toBe(3);
});
